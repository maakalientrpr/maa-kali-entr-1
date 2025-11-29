"use client";

import { useState } from "react";
import { Star, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReviewForm from "./ReviewForm";
import { toast } from "sonner";
import { redirect } from "next/navigation";

type StatsProps = {
  average: number;
  total: number;
  userId?: string;
};

export default function ReviewsHeader({ average, total, userId }: StatsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    if (!userId) {
      toast.error("Login to write review");
      redirect("/login");
    }
    setIsOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Statistics Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: The Big Number */}
        <div className="text-center md:text-left">
          <div className="flex items-baseline gap-2 justify-center md:justify-start">
            <h2 className="text-6xl font-bold text-gray-900">
              {average.toFixed(1)}
            </h2>
            <span className="text-gray-400 text-lg">/ 5</span>
          </div>
          <div className="flex items-center gap-1 justify-center md:justify-start my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={
                  star <= Math.round(average)
                    ? "fill-orange-400 text-orange-400"
                    : "fill-gray-100 text-gray-200"
                }
              />
            ))}
          </div>
          <p className="text-gray-500 font-medium">{total} verified reviews</p>
        </div>

        {/* Right: Call to Action */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <p className="text-gray-600 text-sm max-w-xs text-center md:text-right">
            Shared your journey with us recently? We'd love to hear about your
            experience.
          </p>

          <Button
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 shadow-md hover:shadow-lg transition-all"
            onClick={handleOpenModal}
          >
            <PenLine className="mr-2 h-4 w-4" /> Write a Review
          </Button>
        </div>
      </div>

      {/* Pop-out Modal (Dialog) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share your experience</DialogTitle>
            <DialogDescription>
              Your feedback helps us improve and helps others choose their next
              adventure.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            {/* Pass a callback to close the modal upon success if desired */}
            {userId && (
              <ReviewForm userId={userId} onSuccess={() => setIsOpen(false)} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
