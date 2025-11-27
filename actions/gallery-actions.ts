"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

type CreateAlbumParams = {
  title: string;
  location: string;
  year: number;
  images: string[]; // Array of Cloudinary URLs
};

export async function createTripAlbum({ title, location, year, images }: CreateAlbumParams) {
  try {
    // 1. Find or Create the Year
    // This ensures all 2025 albums go into the same "2025" container
    const yearRecord = await prisma.year.upsert({
      where: { yearNumber: year },
      update: {}, // If exists, do nothing
      create: { yearNumber: year },
    });

    // 2. Create the Album and link Images in one transaction
    await prisma.tripAlbum.create({
      data: {
        title,
        location,
        yearId: yearRecord.id,
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

export async function deleteTripAlbum(albumId: string) {
  try {
    await prisma.tripAlbum.delete({
      where: { id: albumId },
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true, message: "Album deleted successfully" };
  } catch (error) {
    return { success: false, error: "Failed to delete album" };
  }
}

type UpdateAlbumParams = {
  albumId: string;
  title: string;
  location: string;
  year: number;
  newImages: string[]; // URLs of newly uploaded images
  imageIdsToDelete: string[]; // IDs of existing images to remove
};

export async function updateTripAlbum({
  albumId,
  title,
  location,
  year,
  newImages,
  imageIdsToDelete,
}: UpdateAlbumParams) {
  try {
    // 1. Handle Year Change (Find or Create new year if needed)
    const yearRecord = await prisma.year.upsert({
      where: { yearNumber: year },
      update: {},
      create: { yearNumber: year },
    });

    // 2. Transaction to update details, add new images, remove old ones
    await prisma.$transaction([
      // Update Album Details
      prisma.tripAlbum.update({
        where: { id: albumId },
        data: {
          title,
          location,
          yearId: yearRecord.id,
        },
      }),

      // Create New Images
      prisma.image.createMany({
        data: newImages.map((url) => ({
          imageUrl: url,
          tripAlbumId: albumId,
        })),
      }),

      // Delete Removed Images
      prisma.image.deleteMany({
        where: {
          id: { in: imageIdsToDelete },
        },
      }),
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