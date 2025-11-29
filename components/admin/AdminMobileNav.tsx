"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const navLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Create Tour", href: "/admin/tour-package/create" },
  { label: "Manage Tours", href: "/admin/tour-package" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Gallery", href: "/admin/gallery" },
  {
    label: "Vote",
    href: "/admin/vote",
  },
  { label: "Users", href: "/admin/users" },
];

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded hover:bg-gray-100"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 shadow-lg",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-orange-600">Admin Panel</h2>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="p-4 space-y-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "block px-3 py-2 rounded-md font-medium md:hidden",
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-orange-100"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
