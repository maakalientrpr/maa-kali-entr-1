import EditTourForm from "@/components/admin/tour/EditTourForm";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditTourPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tourData = await prisma.tourPackage.findUnique({
    where: { id },
    include: {
      itineraries: { orderBy: { day: "asc" } },
      pickupOptions: true,
    },
  });

  if (!tourData) return notFound();

  // ✅ Strictly format the data to match TourDBType
  const formattedTour = {
    ...tourData,
    // 1. Fix Pickup Options (Nulls and extra fields)
    pickupOptions: tourData.pickupOptions.map((opt) => ({
      id: opt.id,
      title: opt.title,
      priceSingleSharing: opt.priceSingleSharing ?? 0,
      priceDoubleSharing: opt.priceDoubleSharing,
      priceTripleSharing: opt.priceTripleSharing,
    })),
    // 2. Fix Itineraries (Null description and extra fields)
    itineraries: tourData.itineraries.map((it) => ({
      id: it.id,
      day: it.day,
      title: it.title,
      description: it.description ?? "", // Convert null to empty string
    })),
  };

  // Now 'formattedTour' perfectly matches 'TourDBType'
  return <EditTourForm tour={formattedTour} />;
}