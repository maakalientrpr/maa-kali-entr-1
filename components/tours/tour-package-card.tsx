"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Users, Clock, PhoneCallIcon, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import BookingForm from "./booking-form";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define the shape of PickupOption
type PickupOption = {
  id: string;
  title: string;
  priceSingleSharing: number;
  priceDoubleSharing: number | null;
  priceTripleSharing: number | null;
};

type TourPackageCardProps = {
  image: string;
  title: string;
  days: number;
  people: number;
  slug: string;
  id: string;
  price: number; // This is the starting price
  pickupOptions: PickupOption[]; // ✅ Added pickupOptions
};

const TourPackageCard = ({
  image,
  title,
  days,
  people,
  slug,
  price,
  id,
  pickupOptions = [],
}: TourPackageCardProps) => {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  // Helper to find min price for a specific sharing type across all pickup options
  const getMinSharingPrice = (type: "priceDoubleSharing" | "priceTripleSharing") => {
    if (!pickupOptions || pickupOptions.length === 0) return null;
    let min = Infinity;
    pickupOptions.forEach((opt) => {
      const val = opt[type];
      if (val && val > 0) {
        min = Math.min(min, val);
      }
    });
    return min === Infinity ? null : min;
  };

  const minDouble = getMinSharingPrice("priceDoubleSharing");
  const minTriple = getMinSharingPrice("priceTripleSharing");

  return (
    <Card className="overflow-hidden rounded-xl shadow-md p-0 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full">
      {/* Clickable Section */}
      <Link href={`/tours/${slug}`} className="block flex-1">
        {/* Image */}
        <div className="relative w-full h-52 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-300"
          />
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          <h2 className="text-lg font-semibold line-clamp-1">{title}</h2>

          {/* Info */}
          <div className="flex items-center justify-between text-gray-600 text-sm">
            <p className="flex items-center gap-1">
              <Clock size={16} /> {days} Days
            </p>

            <p className="flex items-center gap-1">
              <Users size={16} /> {people} Seats
            </p>
          </div>

          {/* Price Section */}
          <div className="pt-1 space-y-1">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Starts at</p>
              <p className="text-xl font-bold text-orange-600 flex items-center">
                <IndianRupee size={18} strokeWidth={3} />
                {price.toLocaleString("en-IN")}
                <span className="text-gray-600 font-light text-base ml-1">/person</span>
              </p>
            </div>

            {/* ✅ Additional Price Info (Double/Triple) */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
              {minDouble && (
                <span className="flex items-center">
                  Dbl: <IndianRupee size={10} className="ml-0.5" />
                  {minDouble.toLocaleString("en-IN")}
                </span>
              )}
              {minTriple && (
                <span className="flex items-center">
                  Tpl: <IndianRupee size={10} className="ml-0.5" />
                  {minTriple.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Link>

      {/* Footer */}
      <CardFooter className="p-4 pt-0 flex justify-between items-center gap-2 mt-auto">
        {/* Enquire Button */}
        <Button
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-white hover:bg-gray-100 text-black border border-black"
          asChild
        >
          <Link className="flex items-center gap-2" href="tel:+919330942690">
            <PhoneCallIcon size={16} />
            Enquire
          </Link>
        </Button>

        {/* Booking Action */}
        {!session ? (
          <Button
            className="flex-1 bg-orange-600 hover:bg-orange-700"
            onClick={(e) => {
              e.stopPropagation();
              router.push("/login");
            }}
          >
            Book Now
          </Button>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                Book Now
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Book <span className="text-orange-500">{title}</span> tour
                </DialogTitle>
                <DialogDescription>
                  Fill up the form to book this tour package.
                </DialogDescription>
              </DialogHeader>

              <BookingForm
                pickupOptions={pickupOptions} // ✅ Passing updated options
                tourId={id}
                onClose={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default TourPackageCard;