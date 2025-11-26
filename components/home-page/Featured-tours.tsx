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
    take: 3, // ✅ fetch max 3
  });

  // ✅ If no tours available
  if (!tours || tours.length === 0) {
    return null; // or return <p>No tours available</p>
  }

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
      <TourPackages tours={tours} />

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
