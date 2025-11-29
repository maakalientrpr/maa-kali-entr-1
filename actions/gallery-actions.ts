"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { AlbumCategory } from "@/prisma/generated/client";

// Define input types
type CreateAlbumParams = {
  title: string;
  location?: string;
  category: AlbumCategory;
  images: string[]; // Array of Cloudinary URLs
};

type UpdateAlbumParams = {
  albumId: string;
  title: string;
  location?: string;
  category: AlbumCategory;
  newImages: string[];
  imageIdsToDelete: string[];
};

/**
 * Create a new Album
 */
export async function createAlbum({ title, location, category, images }: CreateAlbumParams) {
  try {
    // Create the Album and link Images in one transaction
    await prisma.album.create({
      data: {
        title,
        location,
        category,
        images: {
          create: images.map((url) => ({
            imageUrl: url,
          })),
        },
      },
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    
    return { success: true, message: "Album created successfully" };
  } catch (error) {
    console.error("Gallery Upload Error:", error);
    return { success: false, error: "Failed to create album" };
  }
}

/**
 * Delete an Album
 */
export async function deleteAlbum(albumId: string) {
  try {
    await prisma.album.delete({
      where: { id: albumId },
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true, message: "Album deleted successfully" };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: "Failed to delete album" };
  }
}

/**
 * Update an existing Album
 */
export async function updateAlbum({
  albumId,
  title,
  location,
  category,
  newImages,
  imageIdsToDelete,
}: UpdateAlbumParams) {
  try {
    await prisma.$transaction([
      // 1. Update Album Details
      prisma.album.update({
        where: { id: albumId },
        data: {
          title,
          location,
          category,
        },
      }),

      // 2. Create New Images (if any)
      ...(newImages.length > 0
        ? [
            prisma.image.createMany({
              data: newImages.map((url) => ({
                imageUrl: url,
                albumId: albumId, // Note: field is albumId, not tripAlbumId
              })),
            }),
          ]
        : []),

      // 3. Delete Removed Images (if any)
      ...(imageIdsToDelete.length > 0
        ? [
            prisma.image.deleteMany({
              where: {
                id: { in: imageIdsToDelete },
              },
            }),
          ]
        : []),
    ]);

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    revalidatePath(`/gallery/${albumId}`);

    return { success: true, message: "Album updated successfully" };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "Failed to update album" };
  }
}