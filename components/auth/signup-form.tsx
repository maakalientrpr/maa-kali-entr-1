"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(1, "Phone Number is required")
    .max(10, "Enter a valid phone number"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, "Minimum 8 characters"),
});

export default function SignupPage() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setMessage("");

    const { error } = await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        phoneNumber: values.phone,
      } as any,
      {
        onSuccess: () => router.push("/"),
      }
    );

    if (error) {
      setMessage(error.message || "Something went wrong");
      return;
    }

    setMessage("Signed up successfully!");
    toast.success("You are signed in");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-pink-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your full name"
                      {...field}
                      disabled={form.formState.isSubmitting}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      {...field}
                      disabled={form.formState.isSubmitting}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234567890"
                      {...field}
                      disabled={form.formState.isSubmitting}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      {...field}
                      disabled={form.formState.isSubmitting}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full text-white font-semibold py-2 rounded-lg transition-all"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>

            {/* Message */}
            {message && (
              <p className="text-center text-sm text-green-600 mt-2">{message}</p>
            )}

            {/* Login Link */}
            <p className="text-center text-gray-500 mt-3 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-orange-600 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
