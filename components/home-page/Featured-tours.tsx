import prisma from "@/lib/db";
import TourPackages from "../tours/tour-packages";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { TourCategory } from "@/prisma/generated/enums";

const FeaturedTorus = async () => {
  const tours = await prisma.tourPackage.findMany({
    where: {
      isPublished: true,
      // ✅ NEW: Only load tours where Start Date is in the future (Greater Than Now)
      startDate: {
        gt: new Date(),
      },
    },
    orderBy: {
      startDate: "asc", 
    },
    take: 3,
    include: {
      pickupOptions: true,
    },
  });

  if (!tours || tours.length === 0) {
    return null;
  }

  // ✅ Transform data
  const formattedTours = tours.map((tour) => {
    let minPrice = Infinity;

    if (tour.pickupOptions && tour.pickupOptions.length > 0) {
      tour.pickupOptions.forEach((opt) => {
        // Use optional chaining or checks to ensure values exist
        if (opt.priceSingleSharing) minPrice = Math.min(minPrice, opt.priceSingleSharing);
        if (opt.priceDoubleSharing) minPrice = Math.min(minPrice, opt.priceDoubleSharing);
        if (opt.priceTripleSharing) minPrice = Math.min(minPrice, opt.priceTripleSharing);
      });
    }

    return {
      ...tour,
      category: tour.category as TourCategory, 
      price: minPrice === Infinity ? 0 : minPrice,
    };
  });

  return (
    <div>
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-orange-500 font-bold text-2xl md:text-4xl">
          Featured Tours
        </h2>
        <p className="text-gray-700">
          Handpicked destinations for unforgettable experiences
        </p>
      </div>

      <TourPackages tours={formattedTours} showTabs={false} />

      <div className="w-full flex justify-center my-3">
        <Link href={"/tours"}>
          <Button className="w-fit bg-orange-600">
            View all Tours
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedTorus;