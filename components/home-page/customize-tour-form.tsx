"use client";

import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  CalendarIcon,
  IndianRupeeIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
  Loader2,
  Send,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

// -------------------- Zod Schema --------------------
const TourSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[\d\s+()-]+$/, "Invalid phone format"),
  email: z.string().email("Invalid email address"),
  destination: z.string().min(2, "Enter a destination"),
  dates: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .refine((d) => d.from <= (d.to ?? d.from), {
      message: "End date cannot be before start date",
    }),
  people: z.number().min(1).max(50),
  budget: z.string().optional(),
  details: z.string().optional(),
});

type FormData = z.infer<typeof TourSchema>;

// -------------------- Form Component --------------------
const CustomizeTourForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(TourSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      destination: "",
      dates: { from: new Date(), to: undefined },
      people: 2,
      budget: "",
      details: "",
    },
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);

    const message = `*New Tour Inquiry*%0A%0A` +
      `*Name:* ${data.name}%0A` +
      `*Phone:* ${data.phone}%0A` +
      `*Email:* ${data.email}%0A` +
      `*Destination:* ${data.destination}%0A` +
      `*Travel Dates:* ${format(data.dates.from, "dd MMM yyyy")} → ${data.dates.to ? format(data.dates.to, "dd MMM yyyy") : "N/A"}%0A` +
      `*No. of Travelers:* ${data.people}%0A` +
      `*Budget:* ${data.budget || "Not specified"}%0A` +
      `*Additional Info:* ${data.details || "None"}`;

    const waUrl = `https://wa.me/919073344540?text=${message}`;
    window.open(waUrl, "_blank");

    setTimeout(() => {
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="py-12 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="text-center flex flex-col gap-2 mb-6">
        <h2 className="text-orange-500 font-bold text-2xl md:text-4xl">
          Customize Your Dream Tour
        </h2>
        <p className="text-gray-700">
          Tell us your preferences and we'll create the perfect itinerary for you
        </p>
      </div>

      <div className="p-6 md:p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rounded-lg border border-l-gray-500 border-y-3 shadow-lg shadow-orange-500 border-orange-600 p-5 w-full md:max-w-[80vw] mx-auto lg:max-w-[70vw]">
            <h3 className="text-2xl font-bold">Tour Customization Request</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <FormField<FormData, "name">
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField<FormData, "phone">
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4" /> Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+91 98765 43210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField<FormData, "email">
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Destination */}
              <FormField<FormData, "destination">
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />Preferred Destination
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Bali, Switzerland, Dubai..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Range */}
              <FormField<FormData, "dates">
                control={form.control}
                name="dates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" /> Preferred Dates
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {field.value.from
                              ? field.value.to
                                ? `${format(field.value.from, "dd MMM yyyy")} → ${format(field.value.to, "dd MMM yyyy")}`
                                : format(field.value.from, "dd MMM yyyy")
                              : "Pick a date range"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="bg-white text-gray-900">
                        <Calendar
                          mode="range"
                          selected={field.value}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                        />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* People */}
              <FormField<FormData, "people">
                control={form.control}
                name="people"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UsersIcon className="w-4 h-4" /> Number of Travelers
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={50} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Budget */}
              <FormField<FormData, "budget">
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IndianRupeeIcon className="w-4 h-4" /> Budget Range (per person)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="₹10,000 - ₹15,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Details */}
            <FormField<FormData, "details">
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details /Special Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your preferences, special occasions, accessibility needs, etc."
                      className="resize-none h-28"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6">
              <Button
                type="submit"
                size="lg"
                className="bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Get Free Quote
                  </>
                )}
              </Button>
            </div>
            <div>
                <p className="text-sm text-gray-600 text-center">We'll send you a customize itenary within 24 hours via email or WhatsApp</p>
            </div>
          </form>

        </Form>
      </div>
    </div>
  );
};

export default CustomizeTourForm;
