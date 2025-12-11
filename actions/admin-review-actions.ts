"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";

export async function deleteReview(reviewId: string) {
  // 1. Security Check
  await requireAdmin();

  try {
    // 2. Delete
    await prisma.review.delete({
      where: { id: reviewId },
    });

    // 3. Refresh UI
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete" };
  }
}

export async function getAllReviewsForAdmin(page = 1, limit = 10) {
    await requireAdmin();

    const skip = (page - 1) * limit;

    const [reviews, totalCount] = await prisma.$transaction([
        prisma.review.findMany({
            skip: skip,
            take: limit,
            orderBy: {createdAt: 'desc'},
            include: {
                user: {select: {name: true, email: true}},
                tourPackage: {select: {title: true}},
            }
        }),
        prisma.review.count(),
    ])

    const totalPages = Math.ceil(totalCount / limit)

  return {
    reviews,
    totalPages,
    totalCount,
    currentPage: page
  }
}
