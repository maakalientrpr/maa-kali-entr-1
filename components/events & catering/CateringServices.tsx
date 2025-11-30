"use client";

import { useState } from "react";
import Image from "next/image";
import { UtensilsIcon, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import Dialog & Form Components
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

import { sendQuoteRequest } from "@/actions/send-quote"; // Ensure this path is correct

const CateringServices = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vegItems = [
    "Paneer Butter Masala",
    "Veg Biryani",
    "Mixed Veg Curry",
    "Tandoori Roti",
    "Gulab Jamun",
  ];

  const nonVegItems = [
    "Chicken Biryani",
    "Mutton Curry",
    "Chicken Tandoori",
    "Egg Curry",
    "Fish Fry",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("packageName", "Custom Catering Service"); // Hardcoded name for this section

    const result = await sendQuoteRequest(formData);

    if (result.success) {
      toast.success("Catering quote requested! We will call you soon.");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Something went wrong.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="mt-5 bg-white mx-5 py-10 rounded-2xl shadow-sm">
      <div className="flex flex-col items-center justify-center gap-3">
        <UtensilsIcon className="text-orange-500 size-14" />
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
          Premium Catering Services
        </h2>
        <p className="text-gray-500 text-sm md:text-base text-center max-w-lg">
          Authentic flavours prepared by expert chefs with hygiene as our top
          priority.
        </p>
      </div>

      {/* Tabs Section */}
      <div className="mt-8 w-full flex justify-center mx-auto">
        <Tabs defaultValue="veg" className="w-full flex justify-center">
          <div className="w-full max-w-4xl mx-auto px-4">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-orange-100 rounded-xl p-1 mb-6">
              <TabsTrigger
                value="veg"
                className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all font-medium"
              >
                Veg Menu
              </TabsTrigger>
              <TabsTrigger
                value="nonveg"
                className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all font-medium"
              >
                Non-Veg Menu
              </TabsTrigger>
            </TabsList>

            {/* VEG MENU CONTENT */}
            <TabsContent value="veg" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-md">
                  <Image
                    src="/Catering-service.jpg"
                    fill
                    alt="Veg Catering"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange-600 border-b border-orange-200 pb-2">
                    Sample Veg Highlights
                  </h3>
                  <ul className="space-y-3">
                    {vegItems.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-gray-700 font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500 pt-2 italic">
                    * Full menu customizable upon request
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* NON-VEG MENU CONTENT */}
            <TabsContent value="nonveg" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-md">
                  <Image
                    src="/Catering-service.jpg"
                    fill
                    alt="Non-Veg Catering"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange-600 border-b border-orange-200 pb-2">
                    Sample Non-Veg Highlights
                  </h3>
                  <ul className="space-y-3">
                    {nonVegItems.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-gray-700 font-medium">
                        <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500 pt-2 italic">
                    * Full menu customizable upon request
                  </p>
                </div>
              </div>
            </TabsContent>

            <div className="text-center mt-6">
                <span className="inline-block bg-orange-100 text-orange-800 text-sm font-bold px-4 py-1.5 rounded-full">
                    Starting at just ₹750 per plate
                </span>
            </div>
          </div>
        </Tabs>
      </div>

      {/* FOOTER CTA & DIALOG */}
      <div className="flex flex-col gap-4 justify-center items-center mt-10">
        <p className="text-gray-500 text-sm text-center max-w-sm">
          Menus can be fully customized based on your specific taste, dietary preferences, and event requirements.
        </p>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-full shadow-lg transition-transform hover:-translate-y-1">
              Get Custom Quote <UtensilsIcon className="ml-2 w-5 h-5" />
            </Button>
          </DialogTrigger>

          {/* --- CATERING FORM MODAL --- */}
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-orange-600">Plan Your Menu</DialogTitle>
              <DialogDescription>
                Tell us about your event catering needs and we will design the perfect menu for you.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
              
              {/* Personal Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" required placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" required placeholder="10-digit Mobile" type="tel" />
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date of Event</Label>
                  <Input type="date" name="eventDate" required />
                </div>
                <div className="space-y-2">
                  <Label>Guest Count</Label>
                  <Input type="number" name="guestCount" placeholder="Approx." required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Event Location / Venue</Label>
                <Input name="location" placeholder="Full Address of the venue" required />
              </div>

              {/* Catering Specifics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meal Type</Label>
                  <Select name="mealType">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Dinner">Dinner</SelectItem>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="High Tea">High Tea / Snacks</SelectItem>
                      <SelectItem value="Full Day">Full Day Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Budget (Per Plate)</Label>
                  <Input name="budget" placeholder="e.g. ₹800 - ₹1200" />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Cuisine Preferences</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    "North Indian", "South Indian", "Bengali", 
                    "Chinese", "Continental", "Indian Veg", 
                    "Indian Non-Veg", "Jain Food", "Live Counters"
                  ].map((cuisine) => (
                    <div key={cuisine} className="flex items-center space-x-2 border p-2 rounded-md hover:bg-orange-50 transition-colors">
                      <Checkbox id={cuisine} name="cuisines" value={cuisine} />
                      <label htmlFor={cuisine} className="text-sm font-medium leading-none cursor-pointer w-full">{cuisine}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Specific Menu Requests / Dishes</Label>
                <Textarea 
                  name="menuDetails" 
                  placeholder="E.g. We definitely need Mutton Rogan Josh and Paneer Tikka..." 
                  rows={3} 
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 sticky bottom-0 bg-white pb-1">
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-lg font-bold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting Request...
                    </>
                  ) : (
                    "Get My Catering Quote"
                  )}
                </Button>
              </div>

            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CateringServices;