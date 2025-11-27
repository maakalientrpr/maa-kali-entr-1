import prisma from "@/lib/db";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const album = await prisma.tripAlbum.findUnique({
    where: { id: (await params).albumId },
    include: { images: true },
  });

  if (!album) return notFound();

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{album.title}</h1>
      <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {album.images.map((img) => (
          <div key={img.id} className="break-inside-avoid rounded-lg overflow-hidden">
            <Image 
              src={img.imageUrl} 
              alt="Trip image" 
              width={500} 
              height={500} 
              className="w-full h-auto hover:opacity-90 transition"
            />
          </div>
        ))}
      </div>
    </div>
  );
}