"use server";

import { sendEmail } from "@/lib/send-email";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData) {
  try {
    const { fullName, email, phone, subject, message } = data;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #ea580c;">New Contact Inquiry</h2>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <div style="background: #f9f9f9; padding: 15px; margin-top: 10px;">
          <strong>Message:</strong><br/>
          ${message}
        </div>
      </div>
    `;

    // Send Email to Admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL!, // Admin Email
      subject: `Inquiry: ${subject} - ${fullName}`,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Contact Form Error:", error);
    return { success: false, error: "Failed to send email" };
  }
}