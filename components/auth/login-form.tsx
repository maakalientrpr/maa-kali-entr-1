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
import { requireUnauth } from "@/lib/auth-utils";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, "Minimum 8 characters"),
});

export default  function LoginPage() {

  const [message, setMessage] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setMessage("");

    const { error } = await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => router.push("/"),
      }
    );

    if (error) {
      setMessage(error.message || "Something went wrong");
      return;
    }

    setMessage("Signin successfully");
    toast.success("You are signed in");
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to Maa Kali
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
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

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
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
              className="w-full py-2 rounded-lg font-semibold transition-all hover:brightness-105"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Login"}
            </Button>

            {/* Message */}
            {message && (
              <p className="text-center text-sm text-green-600 mt-2">
                {message}
              </p>
            )}

            <p className="text-center text-gray-500 mt-3 text-sm">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-orange-600 font-medium hover:underline"
              >
                Signup
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
