"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Users, Clock, PhoneCallIcon } from "lucide-react";
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

type TourPackageCardProps = {
  image: string;
  title: string;
  days: number;
  people: number;
  slug: string;
  id: string;
  price: number;
};

const TourPackageCard = ({
  image,
  title,
  days,
  people,
  slug,
  price,
  id,
}: TourPackageCardProps) => {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  return (
    <Card className="overflow-hidden rounded-xl shadow-md p-0 hover:shadow-xl transition-all cursor-pointer group">
      {/* Clickable Section */}
      <Link href={`/tours/${slug}`} className="block">
        {/* Image */}
        <div className="relative w-full h-52">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-300"
          />
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          <h2 className="text-lg font-semibold">{title}</h2>

          {/* Info */}
          <div className="flex items-center justify-between text-gray-600 text-sm">
            <p className="flex items-center gap-1">
              <Clock size={16} /> {days} Days
            </p>

            <p className="flex items-center gap-1">
              <Users size={16} /> {people} People
            </p>
          </div>

          {/* Price */}
          <p className="text-xl font-bold text-orange-600">
            ₹{price}{" "}
            <span className="text-gray-600 font-light text-base">/person</span>
          </p>
        </CardContent>
      </Link>

      {/* Footer */}
      <CardFooter className="p-4 flex justify-between items-center gap-2">
        {/* Enquire Button */}
        <Button
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-white hover:bg-gray-100 text-black border border-black"
        >
          <>
            <Link className="flex items-center gap-2" href="tel:+919330942690">
              <PhoneCallIcon />
              Enquire
            </Link>
          </>
        </Button>

        {/* If user NOT logged in */}
        {!session && (
          <Button
            className="flex-1 bg-orange-600 hover:bg-orange-700"
            onClick={(e) => {
              e.stopPropagation();
              router.push("/login"); 
            }}
          >
            Book Now
          </Button>
        )}

        {/* If user is logged in */}
        {session && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                Book Now
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Book <span className="text-orange-500">{title}</span> tour
                </DialogTitle>
                <DialogDescription>
                  Fill up the form to book this tour package
                </DialogDescription>
              </DialogHeader>

              <BookingForm
                pricePerPerson={price}
                id={id}
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
