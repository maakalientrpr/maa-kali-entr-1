"use server";

import { sendEmail } from "@/lib/send-email"; 
import { z } from "zod";

const baseSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email().optional().or(z.literal("")),
  packageName: z.string(),
});

export const sendQuoteRequest = async (formData: FormData) => {
  const rawData: Record<string, any> = {};

  // @ts-ignore
  for (const [key, value] of formData.entries()) {
    if (rawData[key]) {
      if (Array.isArray(rawData[key])) {
        rawData[key].push(value);
      } else {
        rawData[key] = [rawData[key], value];
      }
    } else {
      rawData[key] = value;
    }
  }

  const validation = baseSchema.safeParse(rawData);

  if (!validation.success) {
    return { success: false, error: "Invalid contact information" };
  }

  const { name, phone, email, packageName } = validation.data;

  // --- 1. GENERATE ADMIN EMAIL HTML ---
  let detailsHtml = "";
  const skipKeys = ["name", "phone", "email", "packageName", "message", "customRequests"];

  for (const [key, value] of Object.entries(rawData)) {
    if (skipKeys.includes(key)) continue;
    const readableKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    const displayValue = Array.isArray(value) ? value.join(", ") : value;

    if(displayValue && displayValue.toString().trim() !== "") {
        detailsHtml += `<div style="margin-bottom: 8px;"><span style="font-weight: bold; color: #555;">${readableKey}:</span> <span>${displayValue}</span></div>`;
    }
  }

  const adminEmailHtml = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #ea580c;">New Lead: ${packageName}</h2>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
      </div>
      <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
        <h3 style="margin-top: 0;">Requirements</h3>
        ${detailsHtml}
        <p><strong>Message:</strong> ${rawData.message || rawData.customRequests || "None"}</p>
      </div>
    </div>
  `;

  // --- 2. GENERATE USER CONFIRMATION EMAIL HTML ---
  const userEmailHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #ea580c; text-align: center;">Thank You for Contacting Us! 🙏</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>We have received your inquiry for <strong>${packageName}</strong>.</p>
      <p>Our team is reviewing your requirements and will get back to you with a customized quote within <strong>24 hours</strong>.</p>
      
      <div style="background-color: #fff7ed; padding: 15px; border-left: 4px solid #ea580c; margin: 20px 0;">
        <p style="margin: 0;"><strong>Next Steps:</strong> You can also chat with us directly on WhatsApp for faster response.</p>
      </div>

      <p style="font-size: 14px; color: #666;">Best Regards,<br/><strong>Maa Kali Enterprise</strong><br/>+91 9330942690</p>
    </div>
  `;

  try {
    // A. Send to Admin
    const adminMail = sendEmail({
      to: process.env.ADMIN_EMAIL!, 
      subject: `New Lead: ${packageName} - ${name}`,
      html: adminEmailHtml,
    });

    // B. Send to User (Only if email is provided)
    let userMail = Promise.resolve();
    if (email) {
        userMail = sendEmail({
            to: email,
            subject: `We Received Your Inquiry - Maa Kali Enterprise`,
            html: userEmailHtml,
        });
    }

    await Promise.all([adminMail, userMail]);

    return { success: true, message: "Quote request sent successfully!" };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error: "Failed to send email" };
  }
};