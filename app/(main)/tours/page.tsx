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
    include: {
      pickupOptions: true
    }
  });

  // ✅ If no tours available
  if (!tours || tours.length === 0) {
    return <p>No tours available</p>;
  }

   // ✅ Transform data to calculate "Starting From" price
  const formattedTours = tours.map((tour) => {
    let minPrice = Infinity;

    if (tour.pickupOptions && tour.pickupOptions.length > 0) {
      tour.pickupOptions.forEach((opt) => {
        if (opt.priceSingleSharing) minPrice = Math.min(minPrice, opt.priceSingleSharing);
        if (opt.priceDoubleSharing) minPrice = Math.min(minPrice, opt.priceDoubleSharing);
        if (opt.priceTripleSharing) minPrice = Math.min(minPrice, opt.priceTripleSharing);
      });
    }

    return {
      ...tour,
      // If no price found (infinity), default to 0
      price: minPrice === Infinity ? 0 : minPrice,
    };
  });

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
      <TourPackages tours={formattedTours} />
    </div>
  );
};

export default page;
