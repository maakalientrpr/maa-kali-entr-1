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

type TourBookingButtonProps = {
  title: string;
  tourId: string;
  price: number;
};

export default function TourBookingButton({
  title,
  tourId,
  price,
}: TourBookingButtonProps) {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  // If user NOT logged in → redirect
  if (!session) {
    return (
      <Button
        className="bg-orange-600 hover:bg-orange-700 w-full"
        onClick={() => router.push("/")}
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
          id={tourId}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
