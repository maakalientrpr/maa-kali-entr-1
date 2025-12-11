"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils"; 

const POPUP_KEY = "main_popup";

// 1. Keep the interface using 'string' (so inputs don't break)
export interface PopupData {
  isActive: boolean;
  imageUrl: string;
  linkUrl: string;
  title: string;
  description: string;
}

// 2. Fetch Popup (Public)
export async function getPopupSettings(): Promise<PopupData> {
  const popup = await prisma.promotionalPopup.findUnique({
    where: { key: POPUP_KEY },
  });
  
  // If no record exists, return defaults
  if (!popup) {
    return { 
      isActive: false, 
      imageUrl: "", 
      linkUrl: "/contact",
      title: "Plan Your Next Yatra?",
      description: "Get exclusive discounts on Chardham bookings this month!"
    };
  }

  // ✅ THE FIX: Convert database 'null' values to empty strings
  return {
    isActive: popup.isActive,
    imageUrl: popup.imageUrl || "",      // If null, return ""
    linkUrl: popup.linkUrl || "",        // If null, return ""
    title: popup.title || "",            // If null, return ""
    description: popup.description || "", // If null, return ""
  };
}

// 3. Update Popup (Admin Only)
export async function updatePopupSettings(data: PopupData) {
  await requireAdmin(); 

  await prisma.promotionalPopup.upsert({
    where: { key: POPUP_KEY },
    update: {
      isActive: data.isActive,
      imageUrl: data.imageUrl,
      linkUrl: data.linkUrl,
      title: data.title,
      description: data.description,
    },
    create: {
      key: POPUP_KEY,
      isActive: data.isActive,
      imageUrl: data.imageUrl,
      linkUrl: data.linkUrl,
      title: data.title,
      description: data.description,
    },
  });

  revalidatePath("/"); 
  return { success: true };
}