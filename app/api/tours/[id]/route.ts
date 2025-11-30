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

    const {
      itinerary,
      pickupOptions,
      category,
      title,
      slug,
      destination,
      description,
      startDate,
      totalSeats,
      durationNights,
      durationDays,
      inclusions,
      exclusions,
      images,
    } = body;

    // 1. Separate Pickup Options into "New" (no ID) and "Existing" (has ID)
    const optionsToCreate = pickupOptions.filter((opt: any) => !opt.id);
    const optionsToUpdate = pickupOptions.filter((opt: any) => opt.id);

    const updatedTour = await prisma.tourPackage.update({
      where: { id },
      data: {
        title,
        slug,
        destination,
        description,
        category,
        startDate: new Date(startDate),
        totalSeats,
        durationNights,
        durationDays,
        inclusions,
        exclusions,
        images,

        // ---------------------------------------------------------
        // FIX: Handle Relations Safely (Preserve Bookings)
        // ---------------------------------------------------------
        pickupOptions: {
          // 1. Create NEW options added in the UI
          create: optionsToCreate.map((opt: any) => ({
            title: opt.title,
            priceSingleSharing: Number(opt.priceSingleSharing),
            priceDoubleSharing: Number(opt.priceDoubleSharing),
            priceTripleSharing: Number(opt.priceTripleSharing),
          })),

          // 2. Update EXISTING options (Preserves IDs for Bookings)
          update: optionsToUpdate.map((opt: any) => ({
            where: { id: opt.id },
            data: {
              title: opt.title,
              priceSingleSharing: Number(opt.priceSingleSharing),
              priceDoubleSharing: Number(opt.priceDoubleSharing),
              priceTripleSharing: Number(opt.priceTripleSharing),
            },
          })),
        },

        // Itineraries: Safe to delete/recreate as they usually don't have foreign keys
        itineraries: {
          deleteMany: {},
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
    return NextResponse.json(
      { error: "Update failed. Check server logs." },
      { status: 500 }
    );
  }
}