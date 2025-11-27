import { MailIcon, MapPin, PhoneIcon, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-linear-to-br from-gray-900 to-gray-800 text-gray-300 py-14 px-6 md:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Logo + About */}
        <div className="space-y-4 col-span-2 lg:col-span-2">
          <div className="flex gap-3 items-center">
            <Image
              src="/logo.png"
              width={60}
              height={90}
              alt="Maa Kali Entr Logo"
              className="cursor-pointer w-[60px] md:w-[70px] lg:w-20"
            />
            <div>
              <h4 className="text-xl font-bold text-white tracking-wide">MAA KALI</h4>
              <span className="text-gray-400 text-sm">Enterprise</span>
            </div>
          </div>

          <p className="text-sm leading-relaxed">
            Your trusted partner for unforgettable tours, beautiful events, and
            premium catering services.
          </p>

          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4 text-orange-400" /> +91 98765 43210
            </p>
            <p className="flex items-center gap-2">
              <MailIcon className="w-4 h-4 text-orange-400" /> info@maakali.com
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              123 Park Street, Kolkata, West Bengal - 700016
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Home", link: "/" },
              { name: "Tours & Travel", link: "/tours&travel" },
              { name: "Events & Catering", link: "/events&catering" },
              { name: "Bookings", link: "/bookings&assistance" },
              { name: "Gallery", link: "/gallery" },
              { name: "About", link: "/aboutus" },
              { name: "Contact", link: "/contact" },
            ].map((item) => (
              <li key={item.link}>
                <Link
                  href={item.link}
                  className="hover:text-orange-400 transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Our Services</h4>
          <ul className="space-y-2 text-sm">
            <li>Domestic & International Tours</li>
            <li>Destination Weddings</li>
            <li>Event Management</li>
            <li>Premium Catering</li>
            <li>Travel Bookings</li>
            <li>Visa & Passport Assistance</li>
            <li>LIC & Mediclaim Advisory</li>
          </ul>
        </div>

        {/* Business Info */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Business Info</h4>

          <ul className="space-y-4 text-sm">

            <li className="flex items-start gap-2">
              <User className="w-4 h-4 text-orange-400 mt-1" />
              <div>
                <p className="text-white font-medium">Owners</p>
                <p>Krishna Jaiswal & Shweta Jaiswal</p>
              </div>
            </li>

            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-orange-400 mt-1" />
              <div>
                <p className="text-white font-medium">Business Hours</p>
                <p>Mon - Sat: 9:00 AM – 8:00 PM</p>
                <p>Sunday: 10:00 AM – 6:00 PM</p>
              </div>
            </li>

          </ul>

          <p className="text-sm mt-4 text-gray-400">
            We are available 7 days a week for all bookings and assistance.
          </p>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Maa Kali Enterprise. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
