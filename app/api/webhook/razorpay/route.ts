import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

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

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const booking = await prisma.booking.findFirst({
        where: {
          paymentId: payment.order_id, // ✅ correct lookup
        },
        include: {
          passengers: true,
        },
      });

      if (!booking) {
        return NextResponse.json({ message: "Booking not found" });
      }

      if (booking.paymentStatus === "PAID") {
        return NextResponse.json({ message: "Already processed" });
      }

      // ✅ Update DB
      await prisma.$transaction([
        prisma.booking.update({
          where: { id: booking.id },
          data: { paymentStatus: "PAID", status: "CONFIRMED" },
        }),
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

    return NextResponse.json({ message: "Unhandled event" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
