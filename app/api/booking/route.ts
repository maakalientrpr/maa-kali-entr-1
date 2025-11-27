import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import Razorpay from "razorpay";
import { requireAuth } from "@/lib/auth-utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    await requireAuth();
    
    const { 
      tourPackageId, 
      pickupOptionId, // ✅ New Field
      sharingType,    // ✅ New Field
      contactNumber, 
      panNumber, 
      passengers,
      totalAmount // Optional: we recalculate on server for security
    } = await req.json();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch the specific Pickup Option along with the Tour
    const pickupOption = await prisma.pickupOption.findUnique({
      where: { id: pickupOptionId },
      include: {
        tourPackage: true,
      },
    });

    if (!pickupOption) {
      return NextResponse.json({ error: "Pickup option not found" }, { status: 404 });
    }

    const pkg = pickupOption.tourPackage;

    // 2. Validate Seats
    if (pkg.availableSeats < passengers.length) {
      return NextResponse.json(
        { error: "Not enough seats available" },
        { status: 400 }
      );
    }

    // 3. Determine Price Per Person based on Sharing Type
    let pricePerPerson = 0;

    switch (sharingType) {
      case "SINGLE":
        pricePerPerson = pickupOption.priceSingleSharing;
        break;
      case "DOUBLE":
        pricePerPerson = pickupOption.priceDoubleSharing ?? 0;
        break;
      case "TRIPLE":
        pricePerPerson = pickupOption.priceTripleSharing ?? 0;
        break;
      default:
        return NextResponse.json({ error: "Invalid sharing type" }, { status: 400 });
    }

    if (pricePerPerson <= 0) {
      return NextResponse.json(
        { error: "Selected sharing type is not available for this location" },
        { status: 400 }
      );
    }

    // 4. Calculate Total Amount (Server-side Calculation for Security)
    // Amount in Paise (INR * 100)
    const amountPaise = Math.round(pricePerPerson * passengers.length * 100);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // 5. Create booking (UNPAID)
    const booking = await prisma.booking.create({
      data: {
        userId,
        tourPackageId: pkg.id,
        pickupOptionId: pickupOption.id, // ✅ Save Pickup Option
        sharingType: sharingType,        // ✅ Save Sharing Type
        contactNumber,
        panNumber: panNumber || null,
        totalAmount: amountPaise, // Store in Paise strictly or convert to Rupees if your DB expects float
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

    // 6. Create Razorpay order
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
      return NextResponse.json({ error: "Payment creation failed" }, { status: 500 });
    }

    // 7. Save orderId to DB
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
    console.error("BOOKING ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}