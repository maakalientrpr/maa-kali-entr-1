import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maa Kali Tours & Travels",
  description:
    "Discover affordable and premium tour packages with Maa Kali Tours & Travels. Enjoy smooth bookings, comfortable stays, and memorable journeys.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          strategy="lazyOnload"
          src="https://checkout.razorpay.com/v1/checkout.js"
        ></Script>

        {children}
        <Toaster />
      </body>
    </html>
  );
}
