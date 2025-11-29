"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

type CreateReviewParams = {
  userId: string;
  tourPackageId?: string; // Optional
  rating: number;
  comment: string;
};

export async function createReview({ userId, tourPackageId, rating, comment }: CreateReviewParams) {
  try {
    if (rating < 1 || rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" };
    }

    if (!comment || comment.trim().length < 10) {
      return { success: false, error: "Review must be at least 10 characters long" };
    }

    await prisma.review.create({
      data: {
        userId,
        tourPackageId, // Can be null for general reviews
        rating,
        comment,
        isPublished: true, // Set to false if you want to moderate them first
      },
    });

    revalidatePath("/reviews"); // Or wherever you display them
    revalidatePath(`/tours/${tourPackageId}`); // If displayed on tour page

    return { success: true, message: "Thank you for your review!" };
  } catch (error) {
    console.error("Review Error:", error);
    return { success: false, error: "Failed to submit review" };
  }
}

export async function getReviews(limit = 10) {
    return await prisma.review.findMany({
        where: { isPublished: true },
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { name: true, image: true }
            },
            tourPackage: {
                select: { title: true }
            }
        }
    });
}

// NEW: Get Statistics
export async function getReviewStats() {
  const stats = await prisma.review.aggregate({
    where: { isPublished: true },
    _avg: { rating: true },
    _count: true,
  });

  return {
    average: stats._avg.rating || 0,
    total: stats._count || 0,
  };
}