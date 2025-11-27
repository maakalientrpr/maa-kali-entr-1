"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BookingForm from "./tours/booking-form";

// Define the shape based on your Prisma model
type PickupOption = {
  id: string;
  title: string;
  priceSingleSharing: number;
  priceDoubleSharing: number | null;
  priceTripleSharing: number | null;
};

type TourBookingButtonProps = {
  title: string;
  tourId: string;
  pickupOptions: PickupOption[];
};

export default function TourBookingButton({
  title,
  tourId,
  pickupOptions,
}: TourBookingButtonProps) {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  // If user NOT logged in → redirect
  if (!session) {
    return (
      <Button
        className="bg-orange-600 hover:bg-orange-700 w-full"
        onClick={() => router.push("/login")}
      >
        Book Now
      </Button>
    );
  }

  // If logged in → open dialog with booking form
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700 w-full">
          Book Now
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Book <span className="text-orange-500">{title}</span> tour
          </DialogTitle>
          <DialogDescription>
            Select your pickup location and sharing preference.
          </DialogDescription>
        </DialogHeader>

        <BookingForm
          pickupOptions={pickupOptions}
          tourId={tourId}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}