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

  // ✅ Transform and Sanitize data
  const formattedTours = tours.map((tour) => {
    let minPrice = Infinity;

    const sanitizedPickupOptions = tour.pickupOptions.map((opt) => {
      const s = opt.priceSingleSharing ?? 0;
      const d = opt.priceDoubleSharing ?? 0;
      const t = opt.priceTripleSharing ?? 0;

      if (s > 0) minPrice = Math.min(minPrice, s);
      if (d > 0) minPrice = Math.min(minPrice, d);
      if (t > 0) minPrice = Math.min(minPrice, t);

      return {
        ...opt,
        priceSingleSharing: s,
        priceDoubleSharing: d,
        priceTripleSharing: t,
      };
    });

    return {
      ...tour,
      category: tour.category as TourCategory, 
      price: minPrice === Infinity ? 0 : minPrice,
      pickupOptions: sanitizedPickupOptions,
    };
  });

  return (
    <div className="py-10">
      <div className="text-center flex flex-col gap-2 mb-8">
        <h2 className="text-orange-500 font-bold text-2xl md:text-4xl">
          Featured Tours
        </h2>
        <p className="text-gray-700">
          Handpicked destinations for unforgettable experiences
        </p>
      </div>

      <TourPackages tours={formattedTours} showTabs={false} />

      <div className="w-full flex justify-center my-6">
        <Link href={"/tours"}>
          <Button className="w-fit bg-orange-600 hover:bg-orange-700">
            View all Tours
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedTorus;