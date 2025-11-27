import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeleteAlbumButton } from "@/components/admin/gallery/DeleteAlbumButton";

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const albums = await prisma.tripAlbum.findMany({
    include: {
      year: true,
      images: {
        take: 1, // Get cover image
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <Link href="/admin/gallery/create">
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="mr-2 h-4 w-4" /> Create New Album
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.map((album) => (
          <Card key={album.id} className="overflow-hidden flex flex-col py-0">
            <div className="relative h-48 w-full bg-gray-100">
              {album.images[0] ? (
                <Image
                  src={album.images[0].imageUrl}
                  alt={album.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="font-bold">
                  {album.year.yearNumber}
                </Badge>
              </div>
            </div>

            <CardContent className="flex-1 p-4">
              <h3 className="font-bold text-lg truncate">{album.title}</h3>
              {album.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin size={14} /> {album.location}
                </p>
              )}
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2">
              <Link href={`/admin/gallery/${album.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <Edit size={16} className="mr-2" /> Edit
                </Button>
              </Link>
              <DeleteAlbumButton albumId={album.id} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}