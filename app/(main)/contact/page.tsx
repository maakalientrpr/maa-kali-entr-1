"use client";

import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Shadcn Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnnouncementBar from "@/components/AnnouncementBar";

// ------------------ ZOD SCHEMA ------------------
const formSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(5, "Message cannot be empty"),
});

const Page = () => {
  // ----------- React Hook Form Setup -----------
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  // ------------------ ON SUBMIT ------------------
  const onSubmit = (data: any) => {
    const text = `New Inquiry from Website:
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Subject: ${data.subject}
Message: ${data.message}`;

    const encoded = encodeURIComponent(text);
    const whatsappNumber = "919876543210";

    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
  };

  return (
    <div>
      <AnnouncementBar />
      {/* Heading */}
      <div className="text-center mt-12 flex flex-col gap-2 mb-12">
        <h1 className="text-orange-500 font-bold text-3xl md:text-4xl">
          Contact Us
        </h1>
        <p className="text-gray-700 max-w-xl mx-auto">
          Get in touch with us for bookings, inquiries, or any assistance.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid mx-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className="bg-white rounded-xl shadow p-6 space-y-5 col-span-1 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800">Get In Touch</h2>

          <ul className="space-y-5">
            <li className="flex gap-3">
              <PhoneIcon className="text-orange-600" />
              <div>
                <p className="font-semibold">Phone</p>
                <p>+91 98765 43210</p>
              </div>
            </li>

            <li className="flex gap-3">
              <MailIcon className="text-orange-600" />
              <div>
                <p className="font-semibold">Email</p>
                <p>info@gmail.com</p>
              </div>
            </li>

            <li className="flex gap-3">
              <MapPinIcon className="text-orange-600" />
              <div>
                <p className="font-semibold">Address</p>
                <p>123 Park Street Kolkata, West Bengal 700016</p>
              </div>
            </li>

            <li className="flex gap-3">
              <ClockIcon className="text-orange-600" />
              <div>
                <p className="font-semibold">Business Hours</p>
                <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                <p>Sunday: 10:00 AM - 6:00 PM</p>
              </div>
            </li>
          </ul>
        </div>

        {/* ---------------- RIGHT SECTION ---------------- */}
        <div className="bg-white rounded-xl shadow p-6 col-span-1 md:col-span-1 lg:col-span-3">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Send Us a Message
          </h2>

          <p className="text-gray-600 mb-6">
            Fill out the form below and we'll get back to you as soon as
            possible.
          </p>

          {/* ---------------- FORM START ---------------- */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Booking / Inquiry / Question"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Describe your query..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Send /> Send to WhatsApp
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Whatsapp Card */}
      <div className="px-5">
        <Card className="bg-linear-to-br from-green-500 to-green-700 p-6 rounded-2xl my-10  w-[50vw] text-white shadow-lg max-w-[500px] flex flex-col justify-between h-full">
          {/* ICON + HEADING */}
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white text-green-600 p-3 rounded-full shadow-md">
              <FaWhatsapp size={28} />
            </div>
            <h3 className="text-xl font-semibold">WhatsApp Support</h3>
          </div>

          {/* DESCRIPTION */}
          <p className="text-white/90 text-sm mb-6 leading-relaxed">
            Get instant responses on WhatsApp. Available 24/7 for bookings,
            inquiries, and support.
          </p>

          {/* BUTTON */}
          <Button
            onClick={() => {
              const message = "Hello! I need assistance.";
              const encoded = encodeURIComponent(message);
              window.open(
                `https://wa.me/919876543210?text=${encoded}`,
                "_blank"
              );
            }}
            className="bg-white text-green-700 hover:bg-gray-100 w-full  font-semibold py-2 rounded-lg"
          >
            Chat on WhatsApp
          </Button>
        </Card>
      </div>

      <FAQSection />
    </div>
  );
};

export default Page;

const FAQSection = () => {
  return (
    <div className="bg-white px-5 py-12 rounded-xl shadow-sm my-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {/* FAQ 1 */}
        <AccordionItem value="faq-1">
          <AccordionTrigger className="text-lg font-medium">
            How do I book a tour?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            You can book through our website, call us directly, or WhatsApp us.
            We’ll guide you through the entire process.
          </AccordionContent>
        </AccordionItem>

        {/* FAQ 2 */}
        <AccordionItem value="faq-2">
          <AccordionTrigger className="text-lg font-medium">
            Can I customize my tour package?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            Absolutely! We specialize in creating customized packages based on
            your preferences and budget.
          </AccordionContent>
        </AccordionItem>

        {/* FAQ 3 */}
        <AccordionItem value="faq-3">
          <AccordionTrigger className="text-lg font-medium">
            What payment methods do you accept?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            We accept bank transfer, UPI, cash, and all major credit/debit
            cards.
          </AccordionContent>
        </AccordionItem>

        {/* FAQ 4 */}
        <AccordionItem value="faq-4">
          <AccordionTrigger className="text-lg font-medium">
            What is your cancellation policy?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            Cancellation policies vary by package. Contact us for specific
            details about your booking.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
