"use client";

import { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import { LoaderIcon, MapPin, Users, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Types
type PickupOption = {
  id: string;
  title: string;
  priceSingleSharing: number;
  priceDoubleSharing: number | null;
  priceTripleSharing: number | null;
};

const formSchema = z
  .object({
    pickupOptionId: z.string().min(1, "Please select a pickup point"),

    // Safest option: just use simple enum validation
    sharingType: z.enum(["SINGLE", "DOUBLE", "TRIPLE"]),

    contactNumber: z
      .string()
      .min(10, "Enter valid contact number")
      .max(10, "Number must be 10 digits"),
    panNumber: z.string().optional(),
    totalAmount: z.number(),
    passengers: z
      .array(
        z.object({
          name: z.string().min(1, "Name is required"),
          age: z.number().min(1).max(120),
          gender: z.enum(["Male", "Female", "Other"]),
        })
      )
      .min(1, "At least 1 passenger required"),
  })
  .refine(
    (data) =>
      data.totalAmount <= 50000 ||
      (data.panNumber && data.panNumber.trim() !== ""),
    {
      message: "PAN is required for bookings above ₹50,000",
      path: ["panNumber"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

const BookingForm = ({
  pickupOptions,
  tourId,
  onClose,
}: {
  pickupOptions: PickupOption[];
  tourId: string;
  onClose: () => void;
}) => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupOptionId: "",
      sharingType: "DOUBLE",
      contactNumber: "",
      panNumber: "",
      passengers: [{ name: "", age: 18, gender: "Male" }],
      totalAmount: 0,
    },
  });

  const { isSubmitting } = form.formState;
  const { fields, append, remove } = useFieldArray({
    name: "passengers",
    control: form.control,
  });

  // Watch values to calculate price
  const selectedPickupId = form.watch("pickupOptionId");
  const selectedSharing = form.watch("sharingType");
  const passengers = form.watch("passengers");

  // Find the selected option object
  const selectedOption = useMemo(
    () => pickupOptions.find((p) => p.id === selectedPickupId),
    [selectedPickupId, pickupOptions]
  );

  // Calculate Price Per Person
  const pricePerPerson = useMemo(() => {
    if (!selectedOption) return 0;
    switch (selectedSharing) {
      case "SINGLE":
        return selectedOption.priceSingleSharing;
      case "DOUBLE":
        return selectedOption.priceDoubleSharing ?? 0;
      case "TRIPLE":
        return selectedOption.priceTripleSharing ?? 0;
      default:
        return 0;
    }
  }, [selectedOption, selectedSharing]);

  // ✅ Auto-select a valid option when Pickup changes
  // This ensures we default to a visible option, not a hidden one
  useEffect(() => {
    if (selectedOption) {
      if ((selectedOption.priceDoubleSharing ?? 0) > 0) {
        form.setValue("sharingType", "DOUBLE");
      } else if ((selectedOption.priceTripleSharing ?? 0) > 0) {
        form.setValue("sharingType", "TRIPLE");
      } else if ((selectedOption.priceSingleSharing ?? 0) > 0) {
        form.setValue("sharingType", "SINGLE");
      }
    }
  }, [selectedOption, form]);

  // Update Total Amount
  useEffect(() => {
    const total = passengers.length * pricePerPerson;
    form.setValue("totalAmount", total);
  }, [passengers.length, pricePerPerson, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await axios.post("/api/booking", {
        tourPackageId: tourId,
        pickupOptionId: values.pickupOptionId,
        sharingType: values.sharingType,
        contactNumber: values.contactNumber,
        panNumber: values.panNumber,
        passengers: values.passengers,
        totalAmount: values.totalAmount,
      });

      const { orderId, amount, key, bookingId } = res.data;

      const options = {
        key,
        amount,
        currency: "INR",
        name: "Maa Kali Tours",
        description: "Tour Booking Payment",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await axios.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            });
            toast.success("Payment Success! Booking Confirmed");
            router.push(
              `/booking/success?orderId=${response.razorpay_order_id}`
            );
            onClose();
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          contact: values.contactNumber,
          name: session?.user.name,
          email: session?.user.email,
        },
        theme: {
          color: "#ea580c",
        },
      };

      onClose();

      setTimeout(() => {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }, 0);
    } catch (error) {
      console.error(error);
      toast.error("Booking failed. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 1. Pickup Point Selection */}
        <FormField
          control={form.control}
          name="pickupOptionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-base">
                <MapPin size={18} className="text-orange-600" /> Pickup Point
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select where you want to start" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pickupOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. Sharing Type Selection (Conditional on Pickup) */}
        {selectedOption && (
          <FormField
            control={form.control}
            name="sharingType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="flex items-center gap-2 text-base">
                  <Users size={18} className="text-orange-600" /> Select
                  Occupancy
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    // We removed "defaultValue" here because useEffect handles the switching now
                    value={field.value}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    {/* ✅ CONDITIONAL RENDERING: Only show if price > 0 */}

                    {/* Double Sharing */}
                    {(selectedOption.priceDoubleSharing ?? 0) > 0 && (
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="DOUBLE"
                            id="r-double"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="r-double"
                          className={cn(
                            "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-orange-600 peer-data-[state=checked]:bg-orange-50 [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                          )}
                        >
                          <span className="text-sm font-medium">Double</span>
                          <span className="text-lg font-bold mt-1 flex items-center">
                            <IndianRupee size={14} />
                            {selectedOption.priceDoubleSharing?.toLocaleString() ??
                              "N/A"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            /person
                          </span>
                        </FormLabel>
                      </FormItem>
                    )}

                    {/* Triple Sharing */}
                    {(selectedOption.priceTripleSharing ?? 0) > 0 && (
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="TRIPLE"
                            id="r-triple"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="r-triple"
                          className={cn(
                            "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-orange-600 peer-data-[state=checked]:bg-orange-50 [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                          )}
                        >
                          <span className="text-sm font-medium">Triple</span>
                          <span className="text-lg font-bold mt-1 flex items-center">
                            <IndianRupee size={14} />
                            {selectedOption.priceTripleSharing?.toLocaleString() ??
                              "N/A"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            /person
                          </span>
                        </FormLabel>
                      </FormItem>
                    )}

                    {/* Single Sharing */}
                    {(selectedOption.priceSingleSharing ?? 0) > 0 && (
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="SINGLE"
                            id="r-single"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="r-single"
                          className={cn(
                            "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-orange-600 peer-data-[state=checked]:bg-orange-50 [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                          )}
                        >
                          <span className="text-sm font-medium">Single</span>
                          <span className="text-lg font-bold mt-1 flex items-center">
                            <IndianRupee size={14} />
                            {selectedOption.priceSingleSharing?.toLocaleString() ??
                              "N/A"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            /person
                          </span>
                        </FormLabel>
                      </FormItem>
                    )}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {/* Contact Number */}
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number *</FormLabel>
                <FormControl>
                  <Input placeholder="9876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PAN Number */}
          <FormField
            control={form.control}
            name="panNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  PAN Number{" "}
                  {form.watch("totalAmount") > 50000 && (
                    <span className="text-red-500">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input placeholder="ABCDE1234F" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Passengers */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Passengers</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", age: 18, gender: "Male" })}
            >
              + Add Passenger
            </Button>
          </div>

          {fields.map((item, index) => (
            <div
              key={item.id}
              className="p-3 border rounded-lg bg-gray-50 flex flex-col gap-3 relative group"
            >
              <div className="flex gap-3 flex-col sm:flex-row">
                <FormField
                  control={form.control}
                  name={`passengers.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-2">
                      <FormLabel className="text-xs">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`passengers.${index}.age`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="5"
                          max="100"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`passengers.${index}.gender`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 self-end h-6 text-xs"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Total & Submit */}
        <div className="sticky bottom-0 bg-white pt-4 border-t mt-4">
          <div className="flex justify-between items-center mb-4 bg-orange-50 p-3 rounded-lg border border-orange-100">
            <span className="text-sm font-medium text-orange-800">
              Total Payable
            </span>
            <span className="text-xl font-bold text-orange-700 flex items-center">
              <IndianRupee size={18} />{" "}
              {form.watch("totalAmount").toLocaleString("en-IN")}
            </span>
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 flex justify-center items-center gap-2 h-12 text-lg"
            disabled={isSubmitting || pricePerPerson === 0}
          >
            {isSubmitting ? (
              <>
                <LoaderIcon className="animate-spin" /> Processing...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookingForm;