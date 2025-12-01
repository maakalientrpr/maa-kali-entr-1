import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { IndianRupee, Users, Edit2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SeatUpdateForm } from "@/components/admin/seat-update-form";
import { DeletePackageButton } from "@/components/admin/delete-package-button";

export const revalidate = 0;

const page = async () => {
  const packages = await prisma.tourPackage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      pickupOptions: true,
    },
  });

  const getStartingPrice = (pkg: (typeof packages)[number]) => {
    if (!pkg.pickupOptions || pkg.pickupOptions.length === 0) return null;
    let minPrice = Infinity;
    pkg.pickupOptions.forEach((opt) => {
      if (opt.priceSingleSharing)
        minPrice = Math.min(minPrice, opt.priceSingleSharing);
      if (opt.priceDoubleSharing)
        minPrice = Math.min(minPrice, opt.priceDoubleSharing);
      if (opt.priceTripleSharing)
        minPrice = Math.min(minPrice, opt.priceTripleSharing);
    });
    return minPrice === Infinity ? null : minPrice;
  };

  async function togglePublish(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const pkg = await prisma.tourPackage.findUnique({
      where: { id },
      select: { isPublished: true },
    });
    if (!pkg) return;
    await prisma.tourPackage.update({
      where: { id },
      data: { isPublished: !pkg.isPublished },
    });
    revalidatePath("/admin/tour-package");
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tour Packages</h1>
          <p className="text-gray-500">Manage your listings and availability</p>
        </div>
        <Link href="/admin/tour-package/create">
          <Button className="bg-orange-600 hover:bg-orange-700 shadow-md">
            + Create Package
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const startPrice = getStartingPrice(pkg);

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* IMAGE SECTION */}
              <div className="relative w-full h-56 overflow-hidden">
                {pkg.images?.length > 0 ? (
                  <Image
                    src={pkg.images[0]}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge className="bg-white/90 text-black backdrop-blur-sm shadow-sm border-0 hover:bg-white">
                    {pkg.category}
                  </Badge>
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-2">
                  <h2
                    className="text-xl font-bold text-gray-900 line-clamp-1"
                    title={pkg.title}
                  >
                    {pkg.title}
                  </h2>
                  {pkg.isPublished ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 shrink-0"
                    >
                      Live
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 border-yellow-200 shrink-0"
                    >
                      Draft
                    </Badge>
                  )}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <span className="truncate">{pkg.destination}</span>
                </div>

                {/* --- SEAT MANAGEMENT SECTION (NEW) --- */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span>
                      <span className="font-bold">{pkg.availableSeats}</span> /{" "}
                      {pkg.totalSeats} Seats Left
                    </span>
                  </div>

                  {/* Popover to Edit Seats */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-white rounded-full"
                      >
                        <Edit2 className="w-3 h-3 text-slate-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-64 p-4 shadow-xl border-slate-100 bg-muted text-black"
                      align="end"
                    >
                      <SeatUpdateForm
                        id={pkg.id}
                        currentSeats={pkg.availableSeats}
                        totalSeats={pkg.totalSeats}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                      Starting From
                    </span>
                    <div className="flex items-center text-orange-600 font-bold text-lg">
                      <IndianRupee className="w-4 h-4" />
                      {startPrice ? startPrice.toLocaleString("en-IN") : "N/A"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/admin/tour-package/${pkg.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-slate-300"
                      >
                        Edit
                      </Button>
                    </Link>

                    <form action={togglePublish}>
                      <input type="hidden" name="id" value={pkg.id} />
                      <Button
                        size="sm"
                        type="submit"
                        className={`h-8 text-xs ${
                          pkg.isPublished
                            ? "bg-slate-800 hover:bg-slate-900"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {pkg.isPublished ? "Unpublish" : "Publish"}
                      </Button>
                    </form>

                    <DeletePackageButton id={pkg.id} title={pkg.title} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
