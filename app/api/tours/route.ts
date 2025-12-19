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
      category, // New Field
      startDate,
      totalSeats,
      availableSeats,
      durationNights,
      durationDays,
      pickupOptions, // Array of objects
      inclusions,
      exclusions,
      images,
      itinerary = [],
    } = body;

    // ✅ Basic Validation
    if (!title || !slug || !destination || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!pickupOptions || !Array.isArray(pickupOptions) || pickupOptions.length === 0) {
      return NextResponse.json(
        { error: "At least one pickup option is required" },
        { status: 400 }
      );
    }

    // Create tour
    const tour = await prisma.tourPackage.create({
      data: {
        title,
        slug,
        destination,
        description,
        category, // DOMESTIC, INTERNATIONAL, WEEKEND
        startDate: new Date(startDate),
        totalSeats,
        availableSeats,
        durationNights,
        durationDays,
        
        // Nested write for PickupOptions
        pickupOptions: {
          create: pickupOptions.map((opt: any) => ({
            title: opt.title,
            priceSingleSharing: Number(opt.priceSingleSharing),
            priceDoubleSharing: Number(opt.priceDoubleSharing),
            priceTripleSharing: Number(opt.priceTripleSharing),
          }))
        },

        inclusions, // string[]
        exclusions, // string[]
        images,     // string[]
        
        // Nested write for Itinerary
        itineraries: {
          create: (itinerary || []).map((day: any) => ({
            day: day.day,
            title: day.title,
            description: day.description,
          })),
        },
      },
      include: {
        pickupOptions: true,
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