import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { AlbumCategory } from "@/prisma/generated/client";

export const revalidate = 60; // Cache for 60 seconds

// Define categories for the tabs
const CATEGORIES = ["ALL", ...Object.values(AlbumCategory)];

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const currentCategory = category || "ALL";

  // Construct the Prisma Query based on the selected category
  const whereClause =
    currentCategory === "ALL"
      ? {} // Fetch everything
      : { category: currentCategory as AlbumCategory };

  const albums = await prisma.album.findMany({
    where: whereClause,
    include: {
      images: {
        take: 1, // Just fetch 1 image for the thumbnail cover
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50  ">
      <div className="max-w-7xl mt-12 mx-auto space-y-12 px-4">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-orange-500 font-bold text-3xl md:text-4xl">
            Our Travel Gallery
          </h1>
          <p className="text-gray-700">
            Browse through our collection of memorable moments from tours and events
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat;
            return (
              <Link
                key={cat}
                href={cat === "ALL" ? "/gallery" : `/gallery?category=${cat}`}
                scroll={false} // Prevents scrolling to top on click
                className={`
                  px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                  ${
                    isActive
                      ? "bg-orange-600 text-white border-orange-600 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                  }
                `}
              >
                {cat === "ALL"
                  ? "All"
                  : cat.charAt(0) + cat.slice(1).toLowerCase()}
              </Link>
            );
          })}
        </div>

        {/* Albums Grid */}
        {albums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <Link
                href={`/gallery/${album.id}`}
                key={album.id}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Album Cover Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  {album.images[0] ? (
                    <Image
                      src={album.images[0].imageUrl}
                      alt={album.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      No Images
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 p-5 text-white w-full">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/90 mb-2 tracking-wider">
                        {album.category}
                      </span>
                      <h3 className="text-xl font-bold leading-tight mb-1 line-clamp-1">
                        {album.title}
                      </h3>
                      {album.location && (
                        <p className="text-sm text-gray-200 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                          <MapPin size={14} className="text-orange-400" />{" "}
                          {album.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
              <Image
                src="/placeholder.svg" // Optional: You can replace with an icon
                width={48}
                height={48}
                alt="Empty"
                className="hidden"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No albums found
            </h3>
            <p className="text-gray-500">
              There are no albums in the {currentCategory} category yet.
            </p>
            {currentCategory !== "ALL" && (
              <Link
                href="/gallery"
                className="mt-4 inline-block text-orange-600 hover:underline"
              >
                View all albums
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
