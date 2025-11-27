import prisma from "@/lib/db";
import TourPackages from "../tours/tour-packages";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const FeaturedTorus = async () => {
  const tours = await prisma.tourPackage.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    include: {
      pickupOptions: true, // ✅ Fetch pickup options to calculate price
    },
  });

  // ✅ If no tours available
  if (!tours || tours.length === 0) {
    return null;
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
      <div className="text-center flex flex-col gap-2">
        <h2 className=" text-orange-500 font-bold text-2xl md:text-4xl">
          Featured Tours
        </h2>
        <p className="text-gray-700">
          Handpicked destinations for unforgettable experiences
        </p>
      </div>
      
      {/* Pass the transformed tours with 'price' */}
      <TourPackages tours={formattedTours} />

      <div className="w-full flex justify-center my-3">
        <Link href={"/tours"}>
          <Button className="w-fit bg-orange-600">
            View all Tours
            <ArrowRight />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedTorus;