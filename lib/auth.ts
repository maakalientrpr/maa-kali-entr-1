import { betterAuth } from "better-auth";
import prisma from "@/lib/db"; // Ensure this path matches your db instance
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendEmail } from "@/lib/send-email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: false, 
      },
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const emailHtml = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2 style="color: #ea580c;">Verify Your Email</h2>
                <p>Hi ${user.name}, thank you for signing up!</p>
                <p>Click the button below to verify your email address.</p>
                <a href="${url}" style="background-color: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Verify Email</a>
                <p style="color: #777; font-size: 12px;">If the button doesn't work, copy this link: ${url}</p>
            </div>
        `;
      await sendEmail({
        to: user.email,
        subject: "Verify your email - Maa Kali Enterprise",
        html: emailHtml,
      });
    },
  },

  emailAndPassword: {
    enabled: true,
    // This function triggers when authClient.forgetPassword() is called
    sendResetPassword: async ({ user, url }) => {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #ea580c; text-align: center;">Reset Your Password</h2>
          <p style="color: #333;">Hi <strong>${user.name}</strong>,</p>
          <p style="color: #555;">We received a request to reset your password for your Maa Kali Enterprise account.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>

          <p style="color: #777; font-size: 14px;">If the button above doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #555; font-size: 12px; word-break: break-all;">${url}</p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: "Reset your password - Maa Kali Enterprise",
        html: emailHtml,
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [admin()],
});
