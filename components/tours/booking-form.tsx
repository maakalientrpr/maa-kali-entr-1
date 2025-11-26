"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { email, z } from "zod";
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
import { toast } from "sonner";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import { LoaderIcon } from "lucide-react";

const formSchema = z
  .object({
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
  pricePerPerson,
  id,
  onClose,
}: {
  pricePerPerson: number;
  id: string;
  onClose: () => void;
}) => {
  const { data: session } = authClient.useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactNumber: "",
      panNumber: "",
      passengers: [{ name: "", age: 18, gender: "Male" }],
      totalAmount: 20000,
    },
  });

  const { isSubmitting } = form.formState;

  const { fields, append, remove } = useFieldArray({
    name: "passengers",
    control: form.control,
  });

  const passengers = form.watch("passengers");
  const totalAmount = passengers.length * pricePerPerson;

  useEffect(() => {
    form.setValue("totalAmount", totalAmount);
  }, [passengers]);

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await axios.post("/api/booking", {
        tourPackageId: id,
        contactNumber: values.contactNumber,
        panNumber: values.panNumber,
        passengers: values.passengers,
      });

      const { orderId, amount, key, bookingId } = res.data;

      const options = {
        key,
        amount,
        currency: "INR",
        name: "Maa Kali tours",
        description: "Tour Booking Payment",
        order_id: orderId,

        handler: async function (response: any) {
          // ✅ Optional: frontend verification
          try {
            await axios.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            });

            toast.success("Payment Success! Booking Confirmed");
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
          color: "#FF5722",
        },
      };

      onClose();

      setTimeout(() => {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      });
    } catch (error) {
      console.log(error);
      toast.error("Booking failed");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-h-[80vh] overflow-y-auto pr-2"
      >
        {/* Contact Number */}
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem className="mx-2">
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
            <FormItem className="mx-2">
              <FormLabel>
                PAN Number {totalAmount > 50000 ? "(Required)" : "(Optional)"}
              </FormLabel>
              <FormControl>
                <Input placeholder="ABCDE1234F" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Passengers */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Passengers</h3>

          {fields.map((item, index) => (
            <div
              key={item.id}
              className="p-3 border rounded-lg bg-gray-50 flex flex-col gap-3"
            >
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name={`passengers.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Full Name</FormLabel>
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
                    <FormItem className="w-24">
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" min="5" max="100" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`passengers.${index}.gender`}
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel>Gender</FormLabel>
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
                  className="text-red-600 self-end"
                  onClick={() => remove(index)}
                >
                  Remove Passenger
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => append({ name: "", age: 18, gender: "Male" })}
          >
            + Add Passenger
          </Button>
        </div>

        {/* ✅ Total Amount */}
        <div className="text-xl font-bold bg-orange-50 p-3 rounded-lg text-orange-700 border border-orange-200">
          Total Amount: ₹{totalAmount.toLocaleString()}
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 flex justify-center items-center gap-2 h-12 text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoaderIcon className="animate-spin" />
              Redirecting to Payment...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
