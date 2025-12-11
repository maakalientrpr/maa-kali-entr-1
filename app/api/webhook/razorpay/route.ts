import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/send-email"; 

export async function POST(req: NextRequest) {
  try {
    // 1. Get Raw Body for Signature Verification
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // 2. Verify Signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 3. Parse Event
    const event = JSON.parse(body);
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;

    // ------------------------------------------------------------------
    // HANDLE SUCCESSFUL PAYMENT
    // ------------------------------------------------------------------
    if (event.event === "payment.captured") {
      const booking = await prisma.booking.findFirst({
        where: { paymentId: orderId },
        include: { passengers: true, tourPackage: true, user: true },
      });

      if (!booking) {
        return NextResponse.json({ message: "Booking not found" }, { status: 404 });
      }

      if (booking.paymentStatus === "PAID") {
        return NextResponse.json({ message: "Already processed" });
      }

      // Update Database
      await prisma.$transaction([
        prisma.booking.update({
          where: { id: booking.id },
          data: { paymentStatus: "PAID", status: "CONFIRMED" },
        }),
        prisma.tourPackage.update({
          where: { id: booking.tourPackageId },
          data: { availableSeats: { decrement: booking.passengers.length } },
        }),
      ]);

      // Send Email
      try {
        const tourDate = new Date(booking.tourPackage.startDate).toLocaleDateString("en-IN", {
          day: "numeric", month: "long", year: "numeric",
        });

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #ea580c; text-align: center;">Booking Confirmed! ✅</h2>
            <p>Dear <strong>${booking.user.name}</strong>,</p>
            <p>Thank you for booking with Maa Kali Enterprise. We are excited to have you on board!</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="margin-top: 0; color: #1f2937;">Trip Details</h3>
              <p style="margin: 5px 0;"><strong>Package:</strong> ${booking.tourPackage.title}</p>
              <p style="margin: 5px 0;"><strong>Travel Date:</strong> ${tourDate}</p>
              <p style="margin: 5px 0;"><strong>Passengers:</strong> ${booking.passengers.length}</p>
              <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₹${booking.totalAmount}</p>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking.id.split("-")[0].toUpperCase()}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
              <p>Maa Kali Enterprise</p>
            </div>
          </div>
        `;

        await sendEmail({
          to: booking.user.email,
          subject: `Booking Confirmed: ${booking.tourPackage.title}`,
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("FAILED TO SEND EMAIL:", emailError);
      }

      return NextResponse.json({ success: true });
    }

    // ------------------------------------------------------------------
    // HANDLE FAILED PAYMENT (New Code)
    // ------------------------------------------------------------------
    if (event.event === "payment.failed") {
      const reason = payment.error_description || "Payment failed";
      console.error(`❌ Payment Failed for Order ${orderId}: ${reason}`);

      // 1. Find the booking linked to this order
      const booking = await prisma.booking.findFirst({
        where: { paymentId: orderId },
      });

      if (booking) {
        // 2. Mark it as FAILED in the database
        await prisma.booking.update({
          where: { id: booking.id },
          data: { 
            status: "FAILED",
            paymentStatus: "FAILED" 
          },
        });
        console.log(`Updated Booking ${booking.id} to FAILED`);
      } else {
        console.warn(`Booking not found for failed order: ${orderId}`);
      }
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Unhandled event" });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}