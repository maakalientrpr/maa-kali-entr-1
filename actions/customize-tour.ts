"use server";

import { sendEmail } from "@/lib/send-email"; 
import { format } from "date-fns";

export async function submitCustomizeTour(data: any) {
  try {
    const { name, email, phone, destination, dates, people, budget, details } = data;
    
    // Format dates nicely
    const fromDate = dates?.from ? format(new Date(dates.from), "dd MMM yyyy") : "N/A";
    const toDate = dates?.to ? format(new Date(dates.to), "dd MMM yyyy") : "N/A";

    // --- 1. ADMIN EMAIL TEMPLATE ---
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">
          New Custom Tour Inquiry
        </h2>
        
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Trip Preferences</h3>
          <p><strong>Destination:</strong> ${destination}</p>
          <p><strong>Dates:</strong> ${fromDate} to ${toDate}</p>
          <p><strong>Travelers:</strong> ${people}</p>
          <p><strong>Budget:</strong> ${budget || "Not specified"}</p>
        </div>

        <p><strong>Additional Details:</strong></p>
        <p style="white-space: pre-wrap;">${details || "None"}</p>
      </div>
    `;

    // --- 2. USER CONFIRMATION EMAIL TEMPLATE ---
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
        <h2 style="color: #ea580c; text-align: center;">Thank You! Request Received ✅</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for choosing Maa Kali Enterprise for your upcoming trip to <strong>${destination}</strong>.</p>
        <p>We have received your customization preferences. Our travel experts are currently reviewing your requirements and will craft a personalized itinerary for you within the next <strong>24 hours</strong>.</p>
        
        <div style="background-color: #fff7ed; padding: 15px; border-left: 4px solid #ea580c; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Your Request Summary:</strong><br/>
          Travel Dates: ${fromDate} - ${toDate}<br/>
          Travelers: ${people}</p>
        </div>

        <p>If you have any urgent requirements, feel free to reply to this email or contact us on WhatsApp.</p>
        <br/>
        <p style="font-size: 12px; color: #666;">Best Regards,<br/><strong>Maa Kali Enterprise Team</strong></p>
      </div>
    `;

    // --- 3. SEND EMAILS (Parallel) ---
    const adminMailPromise = sendEmail({
      to: process.env.ADMIN_EMAIL!, 
      subject: `Custom Tour Request: ${destination} - ${name}`,
      html: adminEmailHtml,
    });

    const userMailPromise = sendEmail({
      to: email, 
      subject: `We Received Your Request: ${destination} Trip`,
      html: userEmailHtml,
    });

    await Promise.all([adminMailPromise, userMailPromise]);

    return { success: true };
  } catch (error) {
    console.error("Customize Tour Error:", error);
    return { success: false, error: "Failed to send email" };
  }
}