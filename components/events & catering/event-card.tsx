"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react"; // Added CheckCircle

// ... (Keep all existing imports)
import {
  Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
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
  const [isOpen, setIsOpen] = useState(false); // Form Dialog
  const [showSuccess, setShowSuccess] = useState(false); // Success Dialog
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState(""); // To show in success msg

  // ... (getModalTitle & renderDynamicFields functions remain UNCHANGED) ...
  const getModalTitle = () => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("birthday") || lowerName.includes("party")) {
      return "Birthday, Anniversary & Other Event Celebration";
    }
    return `Get a Quote: ${name}`;
  };

  // Re-adding renderDynamicFields for completeness in copy-paste
  const renderDynamicFields = () => {
     const packageName = name.toLowerCase();
     const renderCheckboxGroup = (servicesList: string[], groupName: string) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
        {servicesList.map((service) => (
          <div key={service} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 shadow-sm bg-gray-50/50 hover:bg-gray-100 transition-colors">
            <Checkbox id={service} name={groupName} value={service} />
            <div className="space-y-1 leading-none">
              <label htmlFor={service} className="text-sm font-medium leading-none cursor-pointer">{service}</label>
            </div>
          </div>
        ))}
      </div>
    );

    if (packageName.includes("house") || packageName.includes("griha")) {
       return ( /* ... Copy existing House logic ... */ 
         <div className="space-y-4 border-t pt-4 mt-2">
           <h4 className="font-semibold text-orange-600 text-sm bg-orange-50 p-2 rounded-md">Event Details</h4>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2"><Label>Event Date</Label><Input type="date" name="eventDate" required /></div>
             <div className="space-y-2"><Label>Guest Count</Label><Input type="number" name="guestCount" required /></div>
           </div>
           <div className="space-y-2"><Label>Venue Location</Label><Input name="location" required /></div>
           <div className="space-y-3"><Label>Required Services</Label>{renderCheckboxGroup(["Pandit Ji", "Vedi / Samagri", "Decoration", "Mandap Setup", "Sound System", "Catering", "Seating Arrangements", "Photography & Video"], "services")}</div>
         </div>
       );
    }
    if (packageName.includes("wedding") || packageName.includes("marriage")) {
       return ( /* ... Copy existing Wedding logic ... */ 
        <div className="space-y-4 border-t pt-4 mt-2">
           <h4 className="font-semibold text-orange-600 text-sm bg-orange-50 p-2 rounded-md">Wedding Details</h4>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2"><Label>Wedding Date</Label><Input type="date" name="eventDate" required /></div>
             <div className="space-y-2"><Label>Type</Label><Select name="weddingType"><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="Traditional">Traditional</SelectItem><SelectItem value="Destination">Destination</SelectItem><SelectItem value="Registry">Registry</SelectItem></SelectContent></Select></div>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2"><Label>Guest Count</Label><Input type="number" name="guestCount" required /></div>
             <div className="space-y-2"><Label>Location</Label><Input name="location" /></div>
           </div>
           <div className="space-y-3"><Label>Services Needed</Label>{renderCheckboxGroup(["Venue Booking", "Decoration", "Catering", "Photo/Video", "Makeup", "Cards", "DJ", "Transport", "Rooms"], "services")}</div>
        </div>
       );
    }
    if (packageName.includes("birthday") || packageName.includes("party")) {
        return ( /* ... Copy existing Birthday logic ... */ 
         <div className="space-y-4 border-t pt-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2"><Label>Date</Label><Input type="date" name="eventDate" required /></div>
             <div className="space-y-2"><Label>Guest Count</Label><Input type="number" name="guestCount" required /></div>
           </div>
           <div className="space-y-2"><Label>Venue</Label><Input name="location" required /></div>
           <div className="space-y-3"><Label>Services</Label>{renderCheckboxGroup(["Venue Booking", "Decoration", "Catering", "Cake", "Photo/Video", "Anchor", "DJ", "Magic Show", "Cruise", "Transport"], "services")}</div>
         </div>
        );
    }
    if (packageName.includes("catering") || packageName.includes("food")) {
        return ( /* ... Copy existing Catering logic ... */ 
          <div className="space-y-4 border-t pt-4 mt-2">
            <h4 className="font-semibold text-orange-600 text-sm bg-orange-50 p-2 rounded-md">Catering Requirements</h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date</Label><Input type="date" name="eventDate" required /></div>
                <div className="space-y-2"><Label>Guests</Label><Input type="number" name="guestCount" required /></div>
            </div>
            <div className="space-y-2"><Label>Location</Label><Input name="location" required /></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Meal</Label><Select name="mealType"><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="Lunch">Lunch</SelectItem><SelectItem value="Dinner">Dinner</SelectItem><SelectItem value="Breakfast">Breakfast</SelectItem><SelectItem value="High Tea">High Tea</SelectItem><SelectItem value="Full Day">Full Day</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Budget</Label><Input name="budget" placeholder="₹500-800" /></div>
            </div>
            <div className="space-y-3"><Label>Cuisine</Label>{renderCheckboxGroup(["Indian Veg", "Indian Non-Veg", "Bengali", "North Indian", "South Indian", "Chinese", "Continental", "Jain Food"], "cuisines")}</div>
            <div className="space-y-2"><Label>Menu Details</Label><Textarea name="menuDetails" rows={2} /></div>
          </div>
        );
    }
    return <div className="space-y-2 border-t pt-4 mt-2"><Label>Message</Label><Textarea name="customRequests" rows={3} /></div>;
  };
  // ---------------------------------------------------------

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("packageName", name);
    
    const cName = formData.get("name") as string;
    setCustomerName(cName);

    try {
      const result = await sendQuoteRequest(formData);

      if (result.success) {
        // 1. Close Form Modal
        setIsOpen(false);
        
        // 2. Open Success Modal
        setShowSuccess(true);

        // 3. Construct WhatsApp Message & Open It
        // (This logic remains from previous step to maintain chat functionality)
        let waMessage = `*New Quote Request: ${name}*\n\n*Name:* ${cName}\n*Phone:* ${formData.get("phone")}\n`;
        // ... (add other fields logic here like before if needed) ...
        const adminNumber = "919330942690";
        window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(waMessage)}`, "_blank");

      } else {
        toast.error(result.error || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Failed to submit form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="group p-0 bg-white overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full">
      {/* ... Image, Header, Content Sections (Same as before) ... */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image src={src} alt={name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-orange-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">{price}</div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{name}</CardTitle>
        {description && <CardDescription className="text-sm text-gray-500 line-clamp-2">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grow">
        {services && services.length > 0 && (
          <ul className="space-y-1 mt-2">
            {services.map((service, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                {service}
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-6 flex justify-center">
        
        {/* --- SUCCESS DIALOG --- */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="sm:max-w-md text-center p-8">
             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
             </div>
             <DialogHeader>
                <DialogTitle className="text-center text-2xl text-gray-900">Request Received!</DialogTitle>
                <DialogDescription className="text-center pt-2 text-gray-600 text-base">
                    Thank you for contacting <strong>Maa Kali Enterprise</strong> for <strong>{name}</strong>.
                    <br/><br/>
                    Our team will review your requirements and share the quotation within <strong>24 hours</strong>.
                    <br/><br/>
                    <span className="text-sm text-gray-500">A confirmation email has been sent to your inbox.</span>
                </DialogDescription>
             </DialogHeader>
             <Button className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setShowSuccess(false)}>
                Close
             </Button>
          </DialogContent>
        </Dialog>

        {/* --- FORM DIALOG --- */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-white text-orange-600 border border-orange-500 hover:bg-orange-50 hover:text-orange-700 font-semibold rounded-full transition-all">
              Get Quote
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-orange-600 leading-tight">
                {getModalTitle()}
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
                  <Input id="name" name="name" required placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" name="phone" required placeholder="10-digit Mobile" type="tel" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" name="email" type="email" placeholder="email@domain.com" />
              </div>

              {/* Dynamic Fields */}
              {renderDynamicFields()}

              {/* Final Custom Request */}
              <div className="space-y-2">
                <Label>Additional Custom Requests</Label>
                <Textarea name="customRequests" placeholder="Any other specific needs?" rows={2} />
              </div>

              <div className="pt-2 sticky bottom-0 bg-white pb-2">
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-lg" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Submit & Chat on WhatsApp"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}