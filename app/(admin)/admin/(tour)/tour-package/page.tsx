import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { IndianRupee } from "lucide-react";

export const revalidate = 0;

const page = async () => {
  // 1. Updated Query: Include pickupOptions to get the pricing
  const packages = await prisma.tourPackage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      pickupOptions: true,
    },
  });

  // Helper to calculate "Starting From" price
  const getStartingPrice = (pkg: typeof packages[number]) => {
    if (!pkg.pickupOptions || pkg.pickupOptions.length === 0) return null;

    // Find the absolute lowest price across all options and sharing types
    let minPrice = Infinity;

    pkg.pickupOptions.forEach((opt) => {
      // Check Single
      if (opt.priceSingleSharing) minPrice = Math.min(minPrice, opt.priceSingleSharing);
      
      // Check Double (Handle potential null since you made it optional)
      if (opt.priceDoubleSharing) minPrice = Math.min(minPrice, opt.priceDoubleSharing);
      
      // Check Triple (Handle potential null)
      if (opt.priceTripleSharing) minPrice = Math.min(minPrice, opt.priceTripleSharing);
    });

    return minPrice === Infinity ? null : minPrice;
  };

  // ✅ SERVER ACTION: Publish / Unpublish
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

  // ✅ SERVER ACTION: Delete
  async function deletePackage(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;

    await prisma.tourPackage.delete({
      where: { id },
    });

    revalidatePath("/admin/tour-package");
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold ">Tour Packages</h1>

        <Link href="/admin/tour-package/create">
          <Button className="bg-orange-600 hover:bg-orange-700">
            + Create Package
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const startPrice = getStartingPrice(pkg);

          return (
            <div
              key={pkg.id}
              className="bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-lg transition flex flex-col h-full"
            >
              {/* IMAGE SECTION */}
              <div className="relative w-full h-52">
                {pkg.images?.length > 0 ? (
                  <Image
                    src={pkg.images[0]}
                    alt={pkg.title}
                    fill
                    quality={100}
                    className="object-cover group-hover:scale-105 transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                
                {/* CATEGORY BADGE */}
                <div className="absolute top-2 right-2">
                   <Badge className="bg-white/90 text-black hover:bg-white border-0 shadow-sm">
                     {pkg.category}
                   </Badge>
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-bold truncate pr-2 flex-1">
                    {pkg.title}
                  </h2>
                  {pkg.isPublished ? (
                    <Badge className="bg-green-600 hover:bg-green-700 shrink-0">
                      Published
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-orange-600 text-orange-600 shrink-0"
                    >
                      Draft
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-1">
                  {pkg.destination}
                </p>

                <div className="mt-auto">
                  <div className="flex items-baseline gap-1 text-orange-600">
                    <span className="text-xs text-gray-500 font-medium uppercase">
                      Starts at
                    </span>
                    <h3 className="text-xl font-bold flex items-center">
                      <IndianRupee size={18} />
                      {startPrice ? startPrice.toLocaleString("en-IN") : "N/A"}
                    </h3>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-between mt-4 pt-4 border-t gap-2">
                    <Link href={`/admin/tour-package/${pkg.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        Edit
                      </Button>
                    </Link>

                    {/* Publish Toggle */}
                    <form action={togglePublish}>
                      <input type="hidden" name="id" value={pkg.id} />
                      <Button
                        size="sm"
                        type="submit"
                        className={
                          pkg.isPublished
                            ? "bg-slate-500 hover:bg-slate-600"
                            : "bg-green-600 hover:bg-green-700"
                        }
                      >
                        {pkg.isPublished ? "Unpublish" : "Publish"}
                      </Button>
                    </form>

                    {/* Delete */}
                    <form action={deletePackage}>
                      <input type="hidden" name="id" value={pkg.id} />
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </form>
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