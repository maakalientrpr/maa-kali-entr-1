import EditTourForm from "@/components/admin/tour/EditTourForm";
import prisma from "@/lib/db";

export default async function EditTourPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const tour = await prisma.tourPackage.findUnique({
    where: { id: (await params).id },
    include: {
      itineraries: true,
    },
  });

  if (!tour) {
    return <div className="p-6 text-red-500">Tour package not found.</div>;
  }

  return <EditTourForm tour={tour} />;
}
