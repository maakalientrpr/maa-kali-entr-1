"use client";

import { motion } from "framer-motion";
import { BellIcon } from "lucide-react";

const AnnouncementBar = () => {
  return (
    <motion.div
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="
          w-full bg-linear-to-r from-orange-600 via-orange-600 to-pink-500
          text-white py-2 px-4 flex items-center gap-4 overflow-hidden relative
        "
    >
      {/* 🔥 Latest Update Badge */}
      <span className="text-white  py-1 sm:flex items-center gap-2 text-xs hidden sm:text-sm font-semibold z-10">
        <BellIcon />
        Latest Update:
      </span>

      {/* 🔥 Fading Mask Container */}
      <div
        className="
            overflow-hidden flex-1
mask-[linear-gradient(to_right,transparent,black_20%,black_100%)]
          "
      >
        <motion.div
          className="whitespace-nowrap"
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          🎉 Special Offer: Book Your Tours & Events Now & Get Exclusive
          Discounts! 🎉 ✈️ Travel Packages Updated! 📸 New Gallery Photos Added!
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnnouncementBar;
