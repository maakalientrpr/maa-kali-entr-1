"use server";

import { sendEmail } from "@/lib/send-email"; // Your email utility
import { format } from "date-fns";

export async function submitCustomizeTour(data: any) {
  try {
    const { name, email, phone, destination, dates, people, budget, details } = data;
    
    // Format dates nicely
    const fromDate = dates?.from ? format(new Date(dates.from), "dd MMM yyyy") : "N/A";
    const toDate = dates?.to ? format(new Date(dates.to), "dd MMM yyyy") : "N/A";

    const emailHtml = `
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

    // Send Email to Admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL!, 
      subject: `Custom Tour Request: ${destination} - ${name}`,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Customize Tour Error:", error);
    return { success: false, error: "Failed to send email" };
  }
}