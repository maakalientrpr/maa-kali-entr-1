import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import EditGalleryForm from "@/components/admin/gallery/EditGalleryForm";

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const album = await prisma.album.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!album) return notFound();

  return <EditGalleryForm album={album} />;
}