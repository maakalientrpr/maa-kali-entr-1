"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { sendQuoteRequest } from "@/actions/send-quote";

interface EventsCateringCardProps {
  src: string;
  name: string;
  price: string;
  description?: string;
  services?: string[];
  icon?: any;
}

export default function EventsCateringCard({
  src,
  name,
  price,
  description,
  services,
}: EventsCateringCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("packageName", name);

    const result = await sendQuoteRequest(formData);

    if (result.success) {
      toast.success("Quote request sent! We will contact you soon.");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Something went wrong.");
    }

    setIsSubmitting(false);
  };

  // --- Dynamic Form Rendering Logic ---
  const renderDynamicFields = () => {
    const packageName = name.toLowerCase();

    // Helper to render checkbox group cleanly
    const renderCheckboxGroup = (servicesList: string[], groupName: string) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
        {servicesList.map((service) => (
          <div
            key={service}
            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 shadow-sm bg-gray-50/50 hover:bg-gray-100 transition-colors"
          >
            <Checkbox id={service} name={groupName} value={service} />
            <div className="space-y-1 leading-none">
              <label
                htmlFor={service}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {service}
              </label>
            </div>
          </div>
        ))}
      </div>
    );

    // 1. HOUSE INAUGURATION / GRIHA PRAVESH
    if (packageName.includes("house") || packageName.includes("griha")) {
      return (
        <div className="space-y-4 border-t pt-4 mt-2">
          <h4 className="font-semibold text-orange-600 text-sm bg-orange-50 p-2 rounded-md">
            Event Details
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Date</Label>
              <Input type="date" name="eventDate" required />
            </div>
            <div className="space-y-2">
              <Label>Guest Count</Label>
              <Input
                type="number"
                name="guestCount"
                placeholder="Approx."
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Venue Location</Label>
            <Input name="location" placeholder="Address/Area" required />
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700 font-semibold">
              Required Services
            </Label>
            {renderCheckboxGroup(
              [
                "Pandit Ji",
                "Vedi / Samagri",
                "Decoration",
                "Mandap Setup",
                "Sound System",
                "Catering",
                "Seating Arrangements",
                "Photography & Video",
              ],
              "services"
            )}
          </div>
        </div>
      );
    }

    // 2. WEDDING PACKAGES
    if (packageName.includes("wedding") || packageName.includes("marriage")) {
      return (
        <div className="space-y-4 border-t pt-4 mt-2">
          <h4 className="font-semibold text-orange-600 text-sm bg-orange-50 p-2 rounded-md">
            Wedding Details
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Wedding Date</Label>
              <Input type="date" name="eventDate" required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select name="weddingType">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Traditional">Traditional</SelectItem>
                  <SelectItem value="Destination">Destination</SelectItem>
                  <SelectItem value="Court/Registry">
                    Registry + Reception
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Guest Count</Label>
              <Input
                type="number"
                name="guestCount"
                placeholder="Approx."
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred Location</Label>
              <Input name="location" placeholder="City/Venue" />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700 font-semibold">
              Services Needed
            </Label>
            {renderCheckboxGroup(
              [
                "Venue Booking",
                "Decoration & Theme",
                "Catering",
                "Photo & Video",
                "Bridal Makeup",
                "Wedding Cards",
                "DJ & Sound",
                "Transport & Guests",
                "Hotel/Resort Rooms",
              ],
              "services"
            )}
          </div>
        </div>
      );
    }

    // 3. BIRTHDAY CELEBRATIONS
    if (packageName.includes("birthday") || packageName.includes("party")) {
      return (
        <div className="space-y-4 border-t pt-4 mt-2">
          <h4 className="font-semibold text-orange-600 text-sm bg-orange-50 p-2 rounded-md">
            Party Details
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" name="eventDate" required />
            </div>
            <div className="space-y-2">
              <Label>Guest Count</Label>
              <Input
                type="number"
                name="guestCount"
                placeholder="Approx."
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Venue / Location</Label>
            <Input
              name="location"
              placeholder="Home or Outside Venue?"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700 font-semibold">
              Required Services
            </Label>
            {renderCheckboxGroup(
              [
                "Venue Booking",
                "Theme Decoration",
                "Catering",
                "Cake & Setup",
                "Photo & Video",
                "Anchor / Games",
                "DJ & Sound",
                "Magic / Kids Show",
                "Cruise Booking",
                "Transportation",
              ],
              "services"
            )}
          </div>
        </div>
      );
    }

    // 4. CATERING SERVICES
    if (packageName.includes("catering") || packageName.includes("food")) {
      return (
        <div className="space-y-4 border-t pt-4 mt-2">
          <h4 className="font-semibold text-orange-600 text-sm bg-orange-50 p-2 rounded-md">
            Catering Requirements
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" name="eventDate" required />
            </div>
            <div className="space-y-2">
              <Label>Guest Count</Label>
              <Input type="number" name="guestCount" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input name="location" placeholder="Service Address" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Meal Type</Label>
              <Select name="mealType">
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="High Tea">High Tea / Snacks</SelectItem>
                  <SelectItem value="Dinner">Dinner</SelectItem>
                  <SelectItem value="Full Day">Full Day Package</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Budget (Per Plate)</Label>
              <Input name="budget" placeholder="e.g. 500-800" />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700 font-semibold">
              Cuisine Preference
            </Label>
            {renderCheckboxGroup(
              [
                "Indian Veg",
                "Indian Non-Veg",
                "Bengali",
                "North Indian",
                "South Indian",
                "Chinese",
                "Continental",
                "Jain Food",
              ],
              "cuisines"
            )}
          </div>

          <div className="space-y-2">
            <Label>Menu Details / Specific Dishes</Label>
            <Textarea
              name="menuDetails"
              placeholder="List any specific dishes you want..."
              rows={2}
            />
          </div>
        </div>
      );
    }

    // Default Fallback
    return (
      <div className="space-y-2 border-t pt-4 mt-2">
        <Label>Message / Requirements</Label>
        <Textarea
          name="customRequests"
          placeholder="Tell us what you need..."
          rows={3}
        />
      </div>
    );
  };

  return (
    <Card className="group p-0 bg-white overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full">
      {/* IMAGE SECTION */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-orange-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {price}
        </div>
      </div>

      {/* TEXT CONTENT */}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
          {name}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm text-gray-500 line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      {/* SERVICES LIST */}
      <CardContent className="grow">
        {services && services.length > 0 && (
          <ul className="space-y-1 mt-2">
            {services.map((service, i) => (
              <li
                key={i}
                className="text-xs text-gray-600 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                {service}
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      {/* FOOTER ACTION */}
      <CardFooter className="pt-0 pb-6 flex justify-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-white text-orange-600 border border-orange-500 hover:bg-orange-50 hover:text-orange-700 font-semibold rounded-full transition-all">
              Get Quote
            </Button>
          </DialogTrigger>

          {/* --- MODAL CONTENT --- */}
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-orange-600">
                Get a Quote: {name}
              </DialogTitle>
              <DialogDescription>
                Fill out the details below for a customized package.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-4 py-2">
              {/* Common Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    required
                    placeholder="10-digit Mobile"
                    type="tel"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@domain.com"
                />
              </div>

              {/* Dynamic Fields based on Package Name */}
              {renderDynamicFields()}

              {/* Final Custom Request Box */}
              <div className="space-y-2">
                <Label>Additional Custom Requests</Label>
                <Textarea
                  name="customRequests"
                  placeholder="Any other specific needs?"
                  rows={2}
                />
              </div>

              <div className="pt-2 sticky bottom-0 bg-white pb-2">
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Sending...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}