import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/send-email"; // Ensure you have this utility created

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
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // 3. Parse Event
    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      // 4. Find Booking
      // UPDATED: We include 'tourPackage' & 'user' to get details for the email
      const booking = await prisma.booking.findFirst({
        where: {
          paymentId: orderId,
        },
        include: {
          passengers: true,
          tourPackage: true, 
          user: true, 
        },
      });

      if (!booking) {
        return NextResponse.json({ message: "Booking not found" }, { status: 404 });
      }

      // Idempotency check: If already paid, stop here
      if (booking.paymentStatus === "PAID") {
        return NextResponse.json({ message: "Already processed" });
      }

      // 5. Update Database Transaction
      await prisma.$transaction([
        // A. Mark Booking as Paid
        prisma.booking.update({
          where: { id: booking.id },
          data: { 
            paymentStatus: "PAID", 
            status: "CONFIRMED" 
          },
        }),
        
        // B. Decrement Available Seats
        prisma.tourPackage.update({
          where: { id: booking.tourPackageId },
          data: {
            availableSeats: {
              decrement: booking.passengers.length,
            },
          },
        }),
      ]);

      // ---------------------------------------------------------
      // 6. SEND CONFIRMATION EMAIL
      // ---------------------------------------------------------
      try {
        const tourDate = new Date(booking.tourPackage.startDate).toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric"
        });

        // Email HTML Template
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
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking.id.split('-')[0].toUpperCase()}</p>
            </div>

            <h3 style="color: #1f2937;">Passenger List:</h3>
            <ul style="padding-left: 20px;">
              ${booking.passengers.map(p => `<li>${p.name} (${p.age}, ${p.gender})</li>`).join("")}
            </ul>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
              <p>Please carry a valid ID proof during the journey.</p>
              <p>Maa Kali Enterprise & Event Management</p>
            </div>
          </div>
        `;

        // Send Email
        await sendEmail({
          to: booking.user.email,
          subject: `Booking Confirmed: ${booking.tourPackage.title}`,
          html: emailHtml,
        });

        console.log(`Confirmation email sent to ${booking.user.email}`);
      } catch (emailError) {
        // Log error but don't fail the webhook response because DB is already updated
        console.error("FAILED TO SEND EMAIL:", emailError);
      }

      return NextResponse.json({ success: true });
    }

    // Handle other events or ignore
    return NextResponse.json({ message: "Unhandled event" });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}