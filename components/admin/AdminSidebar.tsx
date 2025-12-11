"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  BookOpen,
  Users,
  ImageIcon,
  VoteIcon,
  SparkleIcon,
  ThumbsUpIcon,
  MegaphoneIcon,
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Create Tour",
    href: "/admin/tour-package/create",
    icon: PlusCircle,
  },
  {
    label: "Manage Tours",
    href: "/admin/tour-package",
    icon: Package,
  },
  {
    label: "Pilgrimages",
    href: "/admin/pilgrimages",
    icon: SparkleIcon,
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: BookOpen,
  },
  {
    label: "Popup",
    href: "/admin/popup",
    icon: MegaphoneIcon,
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: ImageIcon,
  },
  {
    label: "Vote",
    href: "/admin/vote",
    icon: VoteIcon,
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: ThumbsUpIcon,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-md  fixed left-0 top-0 h-screen">
      {/* Logo */}
      <div className="p-5 border-b">
        <h2 className="text-xl font-bold text-orange-600">
          Maa Kali Enter
        </h2>
        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>
      

      {/* Links */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          const isActive =
            pathname === link.href 

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium",
                isActive
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-700 hover:bg-orange-100"
              )}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-xs text-gray-500">
        © {new Date().getFullYear()} Maa Kali Travels
      </div>
    </aside>
  );
}
