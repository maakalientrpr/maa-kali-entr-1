import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight, PhoneCallIcon } from "lucide-react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <Image
        src="/hero.jpg"
        alt="hero"
        fill
        className="object-cover"
        quality={100}
        priority
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent" />

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col gap-4 md:gap-6 justify-center items-start px-4 sm:px-6 md:px-12">
        {/* Title */}
        <h1 className="text-white drop-shadow-xl leading-tight space-y-1">
          <p className="text-3xl sm:text-4xl md:text-6xl font-semibold">
            Explore India & Beyond
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl text-orange-500 font-semibold">
            with Maa Kali
          </p>
          <p className="text-orange-300 text-sm sm:text-base md:text-lg">
            भरोसा, आराम, यादें |
          </p>
        </h1>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link href={"/tours"}>
            <Button className="text-xs sm:text-sm md:text-base px-3 bg-orange-600 sm:px-4 py-2">
              Book Now
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>

          <Link href="tel:+919330942690">
            <Button className="bg-gray-400/40 backdrop-blur-md border text-xs sm:text-sm md:text-base px-3 sm:px-4 py-2 hover:bg-gray-400/60">
              Enquire
              <PhoneCallIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>

          <Link
            href="https://wa.me/919330942690"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-green-500 hover:bg-green-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base px-3 sm:px-4 py-2">
              <FaWhatsapp className="text-sm sm:text-base" />
              WhatsApp Us
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 sm:gap-10 text-white mt-2">
          <div className="flex flex-col">
            <p className="font-bold text-xl sm:text-2xl">500+</p>
            <p className="text-sm sm:text-base opacity-90">Happy Travelers</p>
          </div>

          <div className="flex flex-col">
            <p className="font-bold text-xl sm:text-2xl">50+</p>
            <p className="text-sm sm:text-base opacity-90">Destinations</p>
          </div>

          <div className="flex flex-col">
            <p className="font-bold text-xl sm:text-2xl">100+</p>
            <p className="text-sm sm:text-base opacity-90">Events Organised</p>
          </div>
        </div>
      </div>

      {/* 🔥 WAVE CUT AT BOTTOM */}
      {/* Bottom Wave Separator */}
      <div className="absolute -bottom-px left-0 w-full">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-20"
          preserveAspectRatio="none"
        >
          <path
            fill="#f5f5f5"
            d="M0,64L60,74.7C120,85,240,107,360,96C480,85,600,43,720,58.7C840,75,960,149,1080,170.7C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
