"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils"; // Assuming you have this helper

export async function updateAvailableSeats(formData: FormData) {
  // 1. Auth Check
  await requireAdmin();

  const id = formData.get("id") as string;
  const seats = Number(formData.get("availableSeats"));

  if (!id || isNaN(seats)) {
    return { success: false, error: "Invalid data" };
  }

  try {
    // 2. Fetch current total seats to ensure available doesn't exceed total
    const currentPkg = await prisma.tourPackage.findUnique({
        where: { id },
        select: { totalSeats: true }
    });

    if (!currentPkg) return { success: false, error: "Package not found" };

    if (seats > currentPkg.totalSeats) {
        return { success: false, error: `Cannot exceed total seats (${currentPkg.totalSeats})` };
    }

    if (seats < 0) {
        return { success: false, error: "Seats cannot be negative" };
    }

    // 3. Update DB
    await prisma.tourPackage.update({
      where: { id },
      data: { availableSeats: seats },
    });

    revalidatePath("/admin/tour-package");
    return { success: true, message: "Seats updated successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Database error" };
  }
}

export async function deletePackage(id: string) { // Changed signature to take ID directly
  await requireAdmin();

  await prisma.tourPackage.delete({
    where: { id },
  });

  revalidatePath("/admin/tour-package");
  return { success: true };
}