"use client";

import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

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
    <Sheet>
      {/* MOBILE TRIGGER BUTTON */}
      <SheetTrigger className="lg:hidden" asChild>
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer rounded-lg border-gray-400"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>

      {/* SIDEBAR */}
      <SheetContent
        side="left"
        className="w-[260px] px-6 py-6 flex flex-col gap-6 bg-white"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold tracking-wide text-orange-600">
            Maa Kali Tours
          </SheetTitle>
        </SheetHeader>

        {/* NAV LINKS */}
        <div className="flex flex-col gap-2">
          {navLinks.map((nav) => (
            <SheetClose asChild key={nav.link}>
              <Link
                href={nav.link}
                className={`text-[17px] font-medium py-2 px-3 rounded-md transition-all
                  ${
                    pathname === nav.link
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-gray-700 hover:bg-orange-100"
                  }
                `}
              >
                {nav.name}
              </Link>
            </SheetClose>
          ))}
        </div>

        {/* LOGIN / SIGNUP OR ACCOUNT */}
        <div className="mt-4 flex flex-col gap-3">
          {session ? (
            <Link href="/account">
              <SheetClose asChild>
                <Button
                  className={`w-full text-lg rounded-md py-2 ${
                    pathname === "/account"
                      ? "bg-orange-600 text-white"
                      : "bg-orange-50 text-orange-700 hover:scale-105 transition hover:bg-orange-200"
                  }`}
                >
                  Account
                </Button>
              </SheetClose>
            </Link>
          ) : (
            <>
              <SheetClose asChild>
                <Link href="/login">
                  <Button
                    className={`w-full rounded-full py-2 text-[16px] ${
                      pathname === "/login"
                        ? "bg-orange-600 text-white"
                        : "bg-white text-black border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    Login
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="/signup">
                  <Button
                    className={`w-full rounded-full py-2 text-[16px] ${
                      pathname === "/signup"
                        ? "bg-orange-600 text-white"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    }`}
                  >
                    Signup
                  </Button>
                </Link>
              </SheetClose>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
