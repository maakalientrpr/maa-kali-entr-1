"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function PromotionalPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem("hasSeenPromoPopup");

    if (!hasSeenPopup) {
      // 2. Set timer to show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        // 3. Mark as seen so it doesn't show again until tab is closed/reopened
        sessionStorage.setItem("hasSeenPromoPopup", "true");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none text-white">
        {/* Invisible Header for Accessibility */}
        <DialogHeader className="sr-only">
          <DialogTitle>Special Offer</DialogTitle>
        </DialogHeader>

        <div className="relative w-full max-w-[400px] mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
          
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image */}
          <div className="relative h-[450px] w-full">
            <Image
              src="/poster.jpg" 
              alt="Special Offer"
              fill
              className="object-cover"
              priority
            />
            
            {/* Optional Overlay Content (Remove if your image has text) */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-12 flex flex-col items-center text-center">
              <h3 className="text-2xl font-bold text-white mb-1">
                Plan Your Next Yatra?
              </h3>
              <p className="text-gray-200 text-sm mb-4">
                Get exclusive discounts on Chardham bookings this month!
              </p>
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}