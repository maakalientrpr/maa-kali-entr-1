"use server";

import { requireAdmin } from "@/lib/auth-utils"; // Assuming you have this helper
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// Define a strict return type (Same pattern as Polls)
type PilgrimageActionResponse =
  | { success: true; message: string; error?: undefined }
  | { success: false; error: string; message?: undefined };

// --- ADMIN: Create Pilgrimage ---
export async function createPilgrimage(
  formData: FormData
): Promise<PilgrimageActionResponse> {
  // 1. Security Check
  await requireAdmin();

  // 2. Extract Data
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;

  // 3. Simple Validation
  if (!title || !description || !image) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    // 4. Database Operation
    await prisma.pilgrimage.create({
      data: {
        title,
        description,
        image,
      },
    });

    // 5. Revalidate Cache
    revalidatePath("/pilgrimages"); 
    revalidatePath("/admin/pilgrimages");
    return { success: true, message: "Pilgrimage created successfully" };
  } catch (error) {
    console.error("Create Pilgrimage Error:", error);
    return { success: false, error: "Failed to create pilgrimage" };
  }
}

// --- ADMIN: Update Pilgrimage ---
// Note: For updates, passing a raw object is often easier than FormData 
// when using React Hook Form, but we keep the response type consistent.
export async function updatePilgrimage(
  id: string,
  data: { title: string; description: string; image: string }
): Promise<PilgrimageActionResponse> {
  await requireAdmin();

  if (!id) return { success: false, error: "Missing ID" };

  try {
    await prisma.pilgrimage.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
      },
    });

    revalidatePath("/pilgrimages");
    revalidatePath("/admin/pilgrimages");
    return { success: true, message: "Pilgrimage updated successfully" };
  } catch (error) {
    console.error("Update Pilgrimage Error:", error);
    return { success: false, error: "Failed to update pilgrimage" };
  }
}

// --- ADMIN: Delete Pilgrimage ---
export async function deletePilgrimage(id: string): Promise<PilgrimageActionResponse> {
  await requireAdmin();

  if (!id) return { success: false, error: "Missing ID" };

  try {
    await prisma.pilgrimage.delete({
      where: { id },
    });

    revalidatePath("/pilgrimages");
    revalidatePath("/admin/pilgrimages");
    return { success: true, message: "Pilgrimage deleted successfully" };
  } catch (error) {
    console.error("Delete Pilgrimage Error:", error);
    return { success: false, error: "Failed to delete pilgrimage" };
  }
}

// --- FETCHING (Public) ---
export async function getPilgrimages() {
  // No auth check required for viewing (usually)
  try {
    const pilgrimages = await prisma.pilgrimage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return pilgrimages;
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}