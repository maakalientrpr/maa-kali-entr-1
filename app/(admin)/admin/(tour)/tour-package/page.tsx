import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { revalidatePath } from "next/cache"; // 1. Import this
import Image from "next/image";

export const revalidate = 0;

const page = async () => {
  const packages = await prisma.tourPackage.findMany({
    orderBy: { createdAt: "desc" },
  });

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

    // 2. Refetch the page data
    revalidatePath("/admin/tour-package");
  }

  // ✅ SERVER ACTION: Delete
  async function deletePackage(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;

    await prisma.tourPackage.delete({
      where: { id },
    });

    // 2. Refetch the page data
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

      <div className="grid grid-cols-1  lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-lg transition"
          >
            {pkg.images?.length > 0 ? (
              <div className="relative w-full h-52">
                <Image
                  src={pkg.images[0]}
                  alt={pkg.title}
                  fill
                  quality={100}
                  className="object-cover group-hover:scale-105 transition-all duration-300"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <div className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold truncate pr-2">{pkg.title}</h2>

                {pkg.isPublished ? (
                  <Badge className="bg-green-600 hover:bg-green-700">
                    Published
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-orange-600 text-orange-600"
                  >
                    Draft
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-1">{pkg.destination}</p>

              <p className="mt-2 font-semibold text-orange-600 text-xl">
                ₹{pkg.priceDoubleSharing}
              </p>

              <div className="flex justify-between mt-4 pt-4 border-t">
                <Link href={`/admin/tour-package/${pkg.id}`}>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </Link>

                <div className="flex gap-2">
                  {/* ✅ Publish / Unpublish */}
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

                  {/* ✅ Delete */}
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
        ))}
      </div>
    </div>
  );
};

export default page;
