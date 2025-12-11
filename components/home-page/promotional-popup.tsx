"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getPopupSettings, PopupData } from "@/actions/popup-actions";

export default function PromotionalPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<PopupData | null>(null);

  useEffect(() => {
    const init = async () => {
      // 1. Fetch from DB
      const settings = await getPopupSettings();
      setData(settings);

      // 2. Logic: Only show if Active AND Image exists AND User hasn't seen it yet
      if (settings.isActive && settings.imageUrl) {
        const hasSeen = sessionStorage.getItem("hasSeenPromoPopup");
        if (!hasSeen) {
          setTimeout(() => {
            setIsOpen(true);
            sessionStorage.setItem("hasSeenPromoPopup", "true");
          }, 3000);
        }
      }
    };

    init();
  }, []);

  // Return null if data not ready or disabled
  if (!data || !data.isActive || !data.imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none text-white">
        <DialogHeader className="sr-only">
          <DialogTitle>{data.title}</DialogTitle>
        </DialogHeader>

        <div className="relative w-full max-w-[400px] mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
          
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative h-[450px] w-full bg-slate-100">
            <Image
              src={data.imageUrl} 
              alt={data.title}
              fill
              className="object-cover"
              priority
            />
            
            {/* Dynamic Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 pt-24 flex flex-col items-center text-center">
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                {data.title}
              </h3>
              <p className="text-gray-200 text-sm mb-5 leading-relaxed">
                {data.description}
              </p>
              
              <Link href={data.linkUrl} onClick={() => setIsOpen(false)} className="w-full">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 w-full shadow-lg transform hover:scale-105 transition-all">
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