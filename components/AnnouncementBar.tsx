"use client";
import { motion } from "framer-motion";
import { BellIcon } from "lucide-react";

interface AnnouncementBarProps {
  message: string;
}

const AnnouncementBar = ({ message }: AnnouncementBarProps) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      className="w-full bg-linear-to-r from-orange-600 via-orange-600 to-pink-500 text-white py-2 px-4 flex items-center gap-4 overflow-hidden relative"
    >
      <span className="text-white sm:flex items-center gap-2 text-xs hidden sm:text-sm font-semibold z-10">
        <BellIcon className="size-4" />
        Latest Update:
      </span>

      <div className="overflow-hidden flex-1 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <motion.div
          className="whitespace-nowrap"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {message}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnnouncementBar;