import EditTourForm from "@/components/admin/tour/EditTourForm";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditTourPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch tour with all relations needed for the form
  const tour = await prisma.tourPackage.findUnique({
    where: { id },
    include: {
      itineraries: {
        orderBy: { day: "asc" }, // Ensure days are in order
      },
      pickupOptions: true, // Fetch the nested pickup options
    },
  });

  if (!tour) {
    return notFound();
  }

  return <EditTourForm tour={tour} />;
}