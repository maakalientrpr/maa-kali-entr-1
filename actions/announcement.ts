"use server";

import { requireAdmin } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// Fetch the latest announcement
export async function getAnnouncement() {
  return await prisma.announcement.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });
}

// Update the announcement
export async function updateAnnouncement(prevState: any,formData: FormData) {
  try {
    await requireAdmin();
    const text = formData.get("text") as string;

    await prisma.announcement.upsert({
      where: { id: "current-active" }, // Use a fixed ID for a single global bar
      update: { text },
      create: { id: "current-active", text },
    });

    revalidatePath("/"); // Clears the cache to show the new message immediately
    return { success: true, message: "Announcement updated successfully!" };
  } catch (error) {
    console.log(error);
    
    return { success: false, message: "Failed to update announcement." };
  }
}
