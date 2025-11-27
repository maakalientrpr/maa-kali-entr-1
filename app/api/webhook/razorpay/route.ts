import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";

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
      // Razorpay sends order_id in the payload
      const orderId = payment.order_id;

      // 4. Find the Booking associated with this Order ID
      // We stored orderId in the 'paymentId' field during creation
      const booking = await prisma.booking.findFirst({
        where: {
          paymentId: orderId,
        },
        include: {
          passengers: true,
        },
      });

      if (!booking) {
        return NextResponse.json({ message: "Booking not found" }, { status: 404 });
      }

      // Idempotency check: If already paid, ignore
      if (booking.paymentStatus === "PAID") {
        return NextResponse.json({ message: "Already processed" });
      }

      // 5. Update Database Transaction
      await prisma.$transaction([
        // A. Mark Booking as Paid & Confirmed
        prisma.booking.update({
          where: { id: booking.id },
          data: { 
            paymentStatus: "PAID", 
            status: "CONFIRMED" 
          },
        }),
        
        // B. Decrement Available Seats in Tour Package
        prisma.tourPackage.update({
          where: { id: booking.tourPackageId },
          data: {
            availableSeats: {
              decrement: booking.passengers.length,
            },
          },
        }),
      ]);

      return NextResponse.json({ success: true });
    }

    // Handle other events or ignore
    return NextResponse.json({ message: "Unhandled event" });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}