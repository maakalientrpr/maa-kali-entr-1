import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 🔥 FIX: await params
    const { id } = await context.params;

    const body = await req.json();

    const { itinerary, ...tourData } = body;

    const updated = await prisma.tourPackage.update({
      where: { id },
      data: {
        title: tourData.title,
        slug: tourData.slug,
        destination: tourData.destination,
        description: tourData.description,
        startDate: tourData.startDate,
        totalSeats: tourData.totalSeats,
        durationNights: tourData.durationNights,
        durationDays: tourData.durationDays,
        pickupPoints: tourData.pickupPoints,
        priceDoubleSharing: tourData.priceDoubleSharing,
        priceTripleSharing: tourData.priceTripleSharing,
        inclusions: tourData.inclusions,
        exclusions: tourData.exclusions,
        images: tourData.images,

        // FIXED RELATION HANDLING
        itineraries: {
          deleteMany: {
            tourPackageId: id,
          },
          create: itinerary.map(
            (item: { day: Date; title: string; description: string }) => ({
              day: item.day,
              title: item.title,
              description: item.description,
            })
          ),
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
