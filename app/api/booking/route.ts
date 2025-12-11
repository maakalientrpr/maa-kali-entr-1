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
      pickupOptionId, 
      sharingType,    
      contactNumber, 
      panNumber, 
      passengers,
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

    // 3. Determine Price Per Person
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

    // 4. Calculate Total Amount
    // Note: Storing Rupees in DB is usually safer for analytics, but sticking to your logic:
    const totalAmountRupees = pricePerPerson * passengers.length;
    const amountPaise = Math.round(totalAmountRupees * 100);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // ------------------------------------------------------------------
    // 4.5 CLEANUP JUNK: Cancel previous UNPAID bookings for this Tour
    // ------------------------------------------------------------------
    // This prevents a user from having 10 "Pending" bookings if they clicked 
    // "Pay Now" multiple times without finishing payment.
    await prisma.booking.updateMany({
      where: {
        userId: userId,
        tourPackageId: pkg.id, // Only for THIS tour
        paymentStatus: "UNPAID",
      },
      data: {
        status: "CANCELLED",      // Mark as Cancelled
        paymentStatus: "FAILED",  // Mark payment as Failed/Aborted
      },
    });

    // 5. Create booking (UNPAID)
    const booking = await prisma.booking.create({
      data: {
        userId,
        tourPackageId: pkg.id,
        pickupOptionId: pickupOption.id,
        sharingType: sharingType,
        contactNumber,
        panNumber: panNumber || null,
        totalAmount: amountPaise, // Storing in Paise as per your code
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
      // Use 'true' if it works for you, or '1 as any' strictly. Both are fine now.
      payment_capture: true, 
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