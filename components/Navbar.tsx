"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { MailIcon, PhoneIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // scrolling down
        setIsVisible(false);
      } else {
        // scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "Tours & Travel", link: "/tours" },
    { name: "Events & Catering", link: "/events&catering" },
    { name: "Bookings & Assistance", link: "/bookings&assistance" },
    { name: "Gallery", link: "/gallery" },
    { name: "About Us", link: "/aboutus" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <nav
      className={`sticky top-0 left-0 w-full z-50 transition-transform duration-300 shadow
      ${isVisible ? "translate-y-0" : "-translate-y-full"}
     
      `}
    >
      <div className="bg-linear-to-r text-white text-sm w-full md:flex hidden justify-between items-center px-5 py-3 from-orange-500 to-orange-600">
        <div className="flex gap-2 ">
          <span className="flex items-center gap-1">
            <PhoneIcon />
            +91 98765 43210
          </span>
          <span className="flex items-center gap-1">
            <MailIcon />
            info@maakali.com
          </span>
        </div>
        <div>Owners: Krishna Jaiswal & Shweta Jaiswal</div>
      </div>
      <div className="  bg-white px-5 mx-auto py-4 flex  items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Sidebar />
          <Link href="/">
            <Image
              src="/logo.png"
              width={60}
              height={90}
              alt="Maa Kali Entr Logo"
              className="cursor-pointer md:w-[65px] lg:w-[75px] h-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="hidden lg:flex gap-1 shrink">
          {navLinks.map((nav) => {
            const isActive =
              nav.link === "/"
                ? pathname === "/" // Home should only match exact "/"
                : pathname.startsWith(nav.link); // others can use startsWith

            return (
              <Link key={nav.link} href={nav.link}>
                <Button variant={isActive ? "default" : "ghost"}>
                  {nav.name}
                </Button>
              </Link>
            );
          })}

          {session ? (
            <Link href={"/account"}>
              <Button variant={pathname === "/account" ? "default" : "ghost"}>
                Account
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  className={`rounded-full px-6 ${
                    pathname === "/login"
                      ? "bg-orange-600 text-white"
                      : "bg-white text-black border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button
                  className={`rounded-full px-6 ${
                    pathname === "/signup"
                      ? "bg-orange-600 text-white"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
                >
                  Signup
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* WhatsApp Button */}
        <Link
          href="https://wa.me/919330942690"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="bg-green-500 cursor-pointer hover:bg-green-600 flex items-center gap-1 md:gap-2 text-xs md:text-sm lg:text-lg px-2 md:px-3">
            <FaWhatsapp className="text-sm md:text-base" />
            WhatsApp Us
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
