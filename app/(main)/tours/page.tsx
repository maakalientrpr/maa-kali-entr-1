export const dynamic = 'force-dynamic'

import TourPackages from "@/components/tours/tour-packages"; // Ensure this path is correct
import prisma from "@/lib/db";
import { TourCategory } from "@/prisma/generated/enums";

const page = async () => {
  const tours = await prisma.tourPackage.findMany({
    where: {
      isPublished: true,
      startDate: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      pickupOptions: true,
    },
  });

  if (!tours || tours.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No tours available at the moment.</p>
        </div>
      </div>
    );
  }

// ✅ Transform data
const formattedTours = tours.map((tour) => {
  let minPrice = Infinity;

  // 1. Clean up pickupOptions to ensure they are never null
  const cleanedPickupOptions = tour.pickupOptions.map((opt) => {
    const single = opt.priceSingleSharing ?? 0;
    const double = opt.priceDoubleSharing ?? 0;
    const triple = opt.priceTripleSharing ?? 0;

    // Calculate minPrice for the tour while cleaning data
    if (single > 0) minPrice = Math.min(minPrice, single);
    if (double > 0) minPrice = Math.min(minPrice, double);
    if (triple > 0) minPrice = Math.min(minPrice, triple);

    return {
      ...opt,
      priceSingleSharing: single,
      priceDoubleSharing: double,
      priceTripleSharing: triple,
    };
  });

  return {
    ...tour,
    category: tour.category as TourCategory,
    price: minPrice === Infinity ? 0 : minPrice,
    pickupOptions: cleanedPickupOptions, // 2. Pass the strictly typed options
  };
});

  return (
    <div>
      <div className="mt-12 text-center flex flex-col gap-2 mb-6">
        <h1 className="text-orange-500 font-bold text-4xl md:text-4xl">
          Tours & Travel
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto px-4">
          Explore our curated tour packages designed for comfort, convenience,
          and unforgettable travel experiences.
        </p>
      </div>

      {/* Pass the formatted tours to the client component */}
      <TourPackages tours={formattedTours} />
    </div>
  );
};

export default page;
