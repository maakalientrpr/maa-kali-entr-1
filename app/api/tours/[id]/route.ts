import { requireAdmin } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    
    const { id } = await context.params;
    const body = await req.json();

    // 1. Destructure relations and scalar fields
    const {
      itinerary,
      pickupOptions,
      category,
      // Extract fields that need simple updates
      title,
      slug,
      destination,
      description,
      startDate,
      totalSeats,
      availableSeats,
      durationNights,
      durationDays,
      inclusions,
      exclusions,
      images,
    } = body;

    // 2. Perform the update using a transaction or nested writes
    // We delete existing relations and re-create them to ensure the DB matches the form state.
    const updatedTour = await prisma.tourPackage.update({
      where: { id },
      data: {
        // Scalars
        title,
        slug,
        destination,
        description,
        category, // New Enum Field
        startDate: new Date(startDate),
        totalSeats,
        // availableSeats: availableSeats, // Usually you don't reset available seats on edit unless logic dictates
        durationNights,
        durationDays,
        inclusions,
        exclusions,
        images,

        // Relations: Pickup Options
        pickupOptions: {
          deleteMany: {}, // Remove old options
          create: pickupOptions.map((opt: any) => ({
            title: opt.title,
            priceSingleSharing: Number(opt.priceSingleSharing),
            priceDoubleSharing: Number(opt.priceDoubleSharing),
            priceTripleSharing: Number(opt.priceTripleSharing),
          })),
        },

        // Relations: Itineraries
        itineraries: {
          deleteMany: {}, // Remove old itinerary days
          create: itinerary.map((item: any) => ({
            day: Number(item.day),
            title: item.title,
            description: item.description,
          })),
        },
      },
      include: {
        pickupOptions: true,
        itineraries: true,
      },
    });

    return NextResponse.json(updatedTour);
  } catch (error) {
    console.error("UPDATE TOUR ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}