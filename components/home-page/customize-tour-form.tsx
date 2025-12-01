"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  CalendarIcon, IndianRupeeIcon, MapPinIcon, PhoneIcon, UsersIcon, Loader2, Send, CheckCircle
} from "lucide-react";

// UI Components
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Server Action
import { submitCustomizeTour } from "@/actions/customize-tour"; 

// -------------------- Zod Schema --------------------
const TourSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email address"),
  destination: z.string().min(2, "Enter a destination"),
  dates: z.object({
    from: z.date({ error: "Start date is required" }),
    to: z.date().optional(),
  }),
  people: z.number().min(1).max(50),
  budget: z.string().optional(),
  details: z.string().optional(),
});

type TourFormValues = z.infer<typeof TourSchema>;

const CustomizeTourForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false); // NEW STATE
  const [submittedData, setSubmittedData] = useState<TourFormValues | null>(null); // To show name in popup

  const form = useForm<TourFormValues>({
    resolver: zodResolver(TourSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      destination: "",
      dates: {
        from: undefined, 
        to: undefined
      },
      people: 2,
      budget: "",
      details: "",
    },
  });

  const onSubmit = async (data: TourFormValues) => {
    setIsSubmitting(true);

    try {
      const result = await submitCustomizeTour(data);

      if (result.success) {
        // 1. Store data for popup message
        setSubmittedData(data);
        
        // 2. Open WhatsApp (Client Side)
        const dateStr = `${format(data.dates.from, "dd MMM yyyy")} - ${data.dates.to ? format(data.dates.to, "dd MMM yyyy") : "N/A"}`;
        
        const message = `*New Tour Customization Request*%0A%0A` +
          `*Name:* ${data.name}%0A` +
          `*Phone:* ${data.phone}%0A` +
          `*Email:* ${data.email}%0A` +
          `*Destination:* ${data.destination}%0A` +
          `*Dates:* ${dateStr}%0A` +
          `*Travelers:* ${data.people}%0A` +
          `*Budget:* ${data.budget || "N/A"}%0A` +
          `*Note:* ${data.details || "None"}`;

        const waUrl = `https://wa.me/919330942690?text=${message}`; 
        window.open(waUrl, "_blank");

        // 3. Show Success Dialog & Reset Form
        setShowSuccessDialog(true);
        form.reset();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" id="customize-tour">
      
      {/* --- SUCCESS POPUP --- */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md text-center p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center text-gray-900">
              Thank You, {submittedData?.name}!
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-gray-600">
              Thank you for contacting <strong>Maa Kali Enterprise</strong> for your trip to <span className="font-semibold text-orange-600">{submittedData?.destination}</span>.
              <br/><br/>
              Your request has been received. Our team will share the quotation within <strong>24 hours</strong>.
              <br/><br/>
              A confirmation email has been sent to your inbox.
            </DialogDescription>
          </DialogHeader>
          <Button 
            className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => setShowSuccessDialog(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <div className="text-center flex flex-col gap-2 mb-6 px-4">
        <h2 className="text-orange-500 font-bold text-2xl md:text-4xl">
          Customize Your Dream Tour
        </h2>
        <p className="text-gray-700 max-w-lg mx-auto">
          Tell us your preferences and we'll create the perfect itinerary for you.
        </p>
      </div>

      <div className="p-6 md:p-10">
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-6 rounded-xl border border-l-4 border-l-gray-300 border-t-4 border-t-orange-500 shadow-lg p-6 md:p-8 w-full md:max-w-4xl mx-auto bg-gray-50/50"
          >
            {/* ... (Rest of your form fields remain exactly the same) ... */}
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Trip Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                control={form.control} 
                name="name" 
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField 
                control={form.control} 
                name="phone" 
                render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><PhoneIcon className="w-4 h-4"/> Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 98765 43210" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField 
                control={form.control} 
                name="email" 
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField 
                control={form.control} 
                name="destination" 
                render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><MapPinIcon className="w-4 h-4"/> Destination</FormLabel>
                  <FormControl>
                    <Input placeholder="Bali, Kashmir, Dubai..." {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField 
                control={form.control} 
                name="dates" 
                render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><CalendarIcon className="w-4 h-4"/> Travel Dates</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={`w-full justify-start text-left font-normal ${!field.value?.from && "text-muted-foreground"}`}>
                          {field.value?.from ? (
                            field.value.to ? (
                              `${format(field.value.from, "PPP")} - ${format(field.value.to, "PPP")}`
                            ) : (
                              format(field.value.from, "PPP")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white text-black" align="start">
                      <Calendar
                        mode="range"
                        // @ts-ignore
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField 
                  control={form.control} 
                  name="people" 
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><UsersIcon className="w-4 h-4"/> Travelers</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        value={field.value ?? ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField 
                  control={form.control} 
                  name="budget" 
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><IndianRupeeIcon className="w-4 h-4"/> Budget</FormLabel>
                    <FormControl>
                      <Input placeholder="₹ Per Person" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <FormField 
              control={form.control} 
              name="details" 
              render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Requirements</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Specific hotels, dietary needs, special occasions..." 
                    className="resize-none h-24" 
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex flex-col items-end gap-2 pt-4">
              <Button 
                type="submit" 
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white shadow-lg w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing... </>
                ) : (
                  <> <Send className="mr-2 h-4 w-4" /> Get Free Quote </>
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center md:text-right">
                We'll send you a customized itinerary within 24 hours.
              </p>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
};

export default CustomizeTourForm;