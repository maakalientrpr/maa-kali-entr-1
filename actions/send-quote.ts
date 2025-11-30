"use server";

import { sendEmail } from "@/lib/send-email"; // Ensure this path is correct based on your file structure
import { z } from "zod";

// Base Schema: Validates only the core contact info required for ALL forms
const baseSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email().optional().or(z.literal("")),
  packageName: z.string(),
});

export const sendQuoteRequest = async (formData: FormData) => {
  // 1. Convert FormData to a JavaScript Object (handling arrays for checkboxes)
  const rawData: Record<string, any> = {};

  // Iterate over all entries to capture multiple values (e.g. services=[Decor, Catering])
  // @ts-ignore - Iterator needs to be handled carefully in some TS configs
  for (const [key, value] of formData.entries()) {
    if (rawData[key]) {
      // If key exists, convert to array or push to existing array
      if (Array.isArray(rawData[key])) {
        rawData[key].push(value);
      } else {
        rawData[key] = [rawData[key], value];
      }
    } else {
      rawData[key] = value;
    }
  }

  // 2. Validate Core Fields
  const validation = baseSchema.safeParse(rawData);

  if (!validation.success) {
    return { success: false, error: "Invalid contact information" };
  }

  const { name, phone, email, packageName } = validation.data;

  // 3. Generate Dynamic HTML for the Email Body
  // We loop through the rawData to print every field submitted
  let detailsHtml = "";
  
  // List of keys we already displayed in the header, so we skip them in the loop
  const skipKeys = ["name", "phone", "email", "packageName", "message"];

  for (const [key, value] of Object.entries(rawData)) {
    if (skipKeys.includes(key)) continue;

    // Format Key: "eventDate" -> "Event Date"
    const readableKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    
    // Format Value: Join arrays with commas, or show text
    const displayValue = Array.isArray(value) ? value.join(", ") : value;

    if(displayValue && displayValue.toString().trim() !== "") {
        detailsHtml += `
            <div style="margin-bottom: 8px;">
                <span style="font-weight: bold; color: #555;">${readableKey}:</span> 
                <span>${displayValue}</span>
            </div>
        `;
    }
  }

  // 4. Construct Final Email HTML
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #ea580c;">New Quote Request</h2>
      <p style="font-size: 16px;"><strong>Package:</strong> ${packageName}</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
      </div>

      <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #333;">Event Requirements</h3>
        ${detailsHtml}
        
        ${rawData.message || rawData.customRequests ? `
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ccc;">
                <strong>Additional Message:</strong><br/>
                <em>${rawData.message || rawData.customRequests}</em>
            </div>
        ` : ''}
      </div>
    </div>
  `;

  try {
    await sendEmail({
      to: "pinkyjaiswal7008@gmail.com", 
      subject: `New Lead: ${packageName} - ${name}`,
      html: emailHtml,
    });

    return { success: true, message: "Quote request sent successfully!" };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error: "Failed to send email" };
  }
};