"use client";

import {
  ClockIcon,
  Loader2Icon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  Send,
} from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { submitContactForm } from "@/actions/contact";
import { useState } from "react";
import { toast } from "sonner";

// ------------------ ZOD SCHEMA ------------------
const formSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(5, "Message cannot be empty"),
});

type FormData = z.infer<typeof formSchema>;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // 1. Send Email (Server Action)
      const result = await submitContactForm(data);

      if (result.success) {
        toast.success("Message sent successfully! Opening WhatsApp...");

        // 2. Open WhatsApp (Client Side)
        const waMessage =
          `*New Website Inquiry*%0A%0A` +
          `*Name:* ${data.fullName}%0A` +
          `*Phone:* ${data.phone}%0A` +
          `*Email:* ${data.email}%0A` +
          `*Subject:* ${data.subject}%0A` +
          `*Message:* ${data.message}`;

        const whatsappNumber = "919330942690"; // Your Number
        window.open(
          `https://wa.me/${whatsappNumber}?text=${waMessage}`,
          "_blank"
        );

        form.reset();
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mt-12 flex flex-col gap-2 mb-12 px-4">
        <h1 className="text-orange-500 font-bold text-3xl md:text-4xl">
          Contact Us
        </h1>
        <p className="text-gray-700 max-w-xl mx-auto">
          Get in touch with us for bookings, inquiries, or any assistance.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid mx-5 grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl lg:mx-auto mb-16">
        {/* --- LEFT: INFO --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-8 col-span-1 lg:col-span-2 h-fit">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Contact Information
            </h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg h-fit">
                  <PhoneIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <p className="text-gray-600">+91 93309 42690</p>
                  <p className="text-gray-600">+91 82828 67771</p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg h-fit">
                  <MailIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600 break-all">
                    maakalientrpr@gmail.com
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg h-fit">
                  <MapPinIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Address</p>
                  <p className="text-gray-600">
                    88A/1 Bechu Chatterjee Street,
                    <br />
                    Kolkata - 700009, West Bengal
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg h-fit">
                  <ClockIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Business Hours</p>
                  <p className="text-gray-600">Mon - Sat: 9:00 AM - 9:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* WhatsApp Card (Moved inside left column for better layout) */}
          <Card className="bg-linear-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg border-0">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-white/20 p-2 rounded-full">
                <FaWhatsapp size={24} />
              </div>
              <h3 className="text-lg font-bold">Quick Chat?</h3>
            </div>
            <p className="text-white/90 text-sm mb-4">
              Get instant responses. Available 24/7 for urgent queries.
            </p>
            <Button
              onClick={() =>
                window.open("https://wa.me/919330942690", "_blank")
              }
              className="bg-white text-green-700 hover:bg-green-50 w-full font-bold"
            >
              Chat on WhatsApp
            </Button>
          </Card>
        </div>

        {/* --- RIGHT: FORM --- */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 col-span-1 lg:col-span-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Send Message
          </h2>
          <p className="text-gray-500 mb-8">
            Fill out the form below and we'll get back to you shortly via Email
            & WhatsApp.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="bg-gray-50"
                        />
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
                        <Input
                          placeholder="9876543210"
                          {...field}
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          {...field}
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Booking Inquiry..."
                          {...field}
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder="Tell us about your travel plans..."
                        className="bg-gray-50 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white min-w-[200px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <FAQSection />
    </div>
  );
};

export default ContactPage;

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
