import { requireAdmin } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();

    const {
      title,
      slug,
      destination,
      description,
      startDate,
      totalSeats,
      availableSeats,
      durationNights,
      durationDays,
      pickupPoints,
      priceDoubleSharing,
      priceTripleSharing,
      inclusions,
      exclusions,
      images,
      itinerary,
    } = body;

    // ✅ Basic Validation
    if (!title || !slug || !destination || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    //Create tour
    const tour = await prisma.tourPackage.create({
      data: {
        title,
        slug,
        destination,
        description,
        startDate: new Date(startDate),
        totalSeats,
        availableSeats,
        durationNights,
        durationDays,
        pickupPoints, // string[]
        priceDoubleSharing,
        priceTripleSharing,
        inclusions, // string[]
        exclusions, // string[]
        images, // string[]
        itineraries: {
          create: itinerary.map((day: any) => ({
            day: day.day,
            title: day.title,
            description: day.description,
          })),
        },
      },
      include: {
        itineraries: true,
      },
    });

    return NextResponse.json(
      { message: "Tour package created", tour },
      { status: 201 }
    );
  } catch (error) {
    console.log("CREATE TOUR ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create tour" },
      { status: 500 }
    );
  }
}
