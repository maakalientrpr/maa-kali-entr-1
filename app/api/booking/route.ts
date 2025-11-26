import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import Razorpay from "razorpay";
import { requireAuth } from "@/lib/auth-utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    await requireAuth();
    const { tourPackageId, contactNumber, panNumber, passengers } =
      await req.json();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pkg = await prisma.tourPackage.findUnique({
      where: { id: tourPackageId },
    });

    if (!pkg)
      return NextResponse.json({ error: "Package not found" }, { status: 404 });

    if (pkg.availableSeats < passengers.length) {
      return NextResponse.json(
        { error: "Not enough seats available" },
        { status: 400 }
      );
    }

    const amountPaise = pkg.priceDoubleSharing * 100 * passengers.length;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // ✅ Create booking (UNPAID)
    const booking = await prisma.booking.create({
      data: {
        userId,
        tourPackageId,
        contactNumber,
        panNumber: panNumber || null,
        totalAmount: amountPaise,
        paymentStatus: "UNPAID",
        status: "PENDING",
        passengers: {
          create: passengers.map(
            (p: { name: string; age: number; gender: string }) => ({
              name: p.name,
              age: p.age,
              gender: p.gender,
            })
          ),
        },
      },
    });

    // ✅ Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `recept-${Date.now()}`,
      notes: {
        tourPackage: pkg.title,
        bookingId: booking.id.toString(),
      },
    });

    if (!order) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "FAILED" },
      });
    }

    // ✅ Save orderId to DB
    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentId: order.id },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: amountPaise,
      bookingId: booking.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
