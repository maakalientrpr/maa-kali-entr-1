import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

export const revalidate = 60; // Cache for 60 seconds

export default async function GalleryPage() {
  // Fetch Years with Albums, sorted by newest year first
  const years = await prisma.year.findMany({
    include: {
      albums: {
        include: {
          images: {
            take: 1, // Just fetch 1 image for the thumbnail cover
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: {
      yearNumber: "desc", // 2025, then 2024...
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Our Travel Gallery</h1>
          <p className="text-gray-600">Memories from around the world, year by year.</p>
        </div>

        {years.map((yearGroup) => (
          <div key={yearGroup.id} className="relative">
            {/* Year Header */}
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-orange-600">{yearGroup.yearNumber}</h2>
              <div className="h-0.5 flex-1 bg-orange-100"></div>
            </div>

            {/* Albums Grid */}
            {yearGroup.albums.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {yearGroup.albums.map((album) => (
                  <Link 
                    href={`/gallery/${album.id}`} 
                    key={album.id}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Album Cover Image */}
                    <div className="relative h-64 w-full overflow-hidden">
                      {album.images[0] ? (
                        <Image
                          src={album.images[0].imageUrl}
                          alt={album.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                          No Images
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-1">{album.title}</h3>
                        {album.location && (
                          <p className="text-sm text-gray-200 flex items-center gap-1">
                            <MapPin size={14} /> {album.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No trips added for this year yet.</p>
            )}
          </div>
        ))}

        {years.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">Gallery is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}