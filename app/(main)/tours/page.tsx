import AnnouncementBar from "@/components/AnnouncementBar";
import TourPackages from "@/components/tours/tour-packages";
import prisma from "@/lib/db";

const page = async () => {
  const tours = await prisma.tourPackage.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // ✅ If no tours available
  if (!tours || tours.length === 0) {
    return <p>No tours available</p>;
  }

  return (
    <div>
      <AnnouncementBar />
      <div className="mt-12 text-center flex flex-col gap-2 mb-6">
        <h1 className="text-orange-500 font-bold text-4xl md:text-4xl">
          Tours & Travel
        </h1>
        <p className="text-gray-700">
       Explore our curated tour packages designed for comfort, convenience, and unforgettable travel experiences.
        </p>
      </div>
      <TourPackages tours={tours} />
    </div>
  );
};

export default page;
