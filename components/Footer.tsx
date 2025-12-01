import {
  MailIcon,
  MapPin,
  PhoneIcon,
  Clock,
  User,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 py-14 px-6 md:px-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* 1. Logo + About (Spans 2 columns) */}
        <div className="space-y-4 col-span-2 lg:col-span-2">
          <div className="flex gap-3 items-center">
            <div className="relative w-[60px] h-[60px]">
              <Image
                src="/logo.png"
                fill
                alt="Maa Kali Entr Logo"
                className="object-contain"
              />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white tracking-wide">
                MAA KALI
              </h4>
              <span className="text-orange-500 text-sm font-medium">
                Enterprise
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
            Your trusted partner for unforgettable tours, beautiful events, and
            premium catering services across India and Nepal.
          </p>

          <div className="space-y-3 text-sm pt-2">
            <p className="flex items-center gap-3">
              <PhoneIcon className="w-4 h-4 text-orange-500" />
              <span className="text-white">+91 9330942690</span>
            </p>
            <p className="flex items-center gap-3">
              <MailIcon className="w-4 h-4 text-orange-500" />
              <span className="text-white">maakalienterprise@gmail.com</span>
            </p>
            <p className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
              <span className="text-white">
                123 Spiritual Road, Kolkata, West Bengal - 700001
              </span>
            </p>
          </div>
        </div>

        {/* 2. Quick Links */}
        <div>
          <h4 className="text-lg font-bold text-white mb-6 border-b-2 border-orange-500 inline-block pb-1">
            Quick Links
          </h4>
          <ul className="space-y-3 text-sm">
            {[
              { name: "Home", link: "/" },
              { name: "Tours & Travel", link: "/#packages" },
              { name: "Events & Catering", link: "/events" },
              { name: "About Us", link: "/about" },
              { name: "Contact", link: "/#contact" },
            ].map((item) => (
              <li key={item.link}>
                <Link
                  href={item.link}
                  className="hover:text-orange-400 transition-colors hover:translate-x-1 inline-block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Legal & Policies (CRITICAL FOR RAZORPAY) */}
        <div>
          <h4 className="text-lg font-bold text-white mb-6 border-b-2 border-orange-500 inline-block pb-1">
            Policies
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/terms-conditions"
                className="hover:text-orange-400 transition-colors flex items-center gap-2"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-orange-400 transition-colors flex items-center gap-2"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/refund-policy"
                className="hover:text-orange-400 transition-colors flex items-center gap-2"
              >
                Refund Policy
              </Link>
            </li>
            <li>
              <Link
                href="/shipping-policy"
                className="hover:text-orange-400 transition-colors flex items-center gap-2"
              >
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-orange-400 transition-colors flex items-center gap-2"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/aboutus"
                className="hover:text-orange-400 transition-colors flex items-center gap-2"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* 4. Business Hours / Info */}
        <div>
          <h4 className="text-lg font-bold text-white mb-6 border-b-2 border-orange-500 inline-block pb-1">
            Business Info
          </h4>

          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <User className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-white font-medium">Owners</p>
                <p className="text-gray-400 text-xs">
                  Krishna & Shweta Jaiswal
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-white font-medium">Opening Hours</p>
                <p className="text-gray-400 text-xs">
                  Mon - Sat: 9:00 AM – 8:00 PM
                </p>
                <p className="text-gray-400 text-xs">
                  Sunday: 10:00 AM – 6:00 PM
                </p>
              </div>
            </li>
          </ul>

          <div className="mt-6 flex items-center gap-2 text-xs text-green-400 bg-green-400/10 p-2 rounded-lg border border-green-400/20">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Secure Payments</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 mt-14 pt-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 max-w-7xl mx-auto">
        {/* Copyright Text */}
        <p>
          © {new Date().getFullYear()} Maa Kali Enterprise. All Rights Reserved.
        </p>

        {/* Developer Credit */}
        <div className="flex items-center gap-1">
          <span className="opacity-80">
            Made with <span className="text-red-500 animate-pulse">❤</span> by
          </span>
          <Link
            href="https://rishav-portfolio-rishav2099s-projects.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-orange-500 font-medium transition-colors duration-300 hover:underline decoration-orange-500/50 underline-offset-4"
          >
            Wevzy Studio
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
