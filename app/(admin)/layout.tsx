import { requireAdmin } from "@/lib/auth-utils";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:ml-64 ">
        {/* Top Bar */}
        <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <AdminMobileNav />
            <h1 className="text-lg font-bold text-orange-600">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button size="sm" variant="outline">
                Visit Website
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
