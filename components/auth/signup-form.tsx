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
import Image from "next/image";
import { 
  SparklesIcon, 
  ArrowRight, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Lock 
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
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

  const isPending = form.formState.isSubmitting;

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
      toast.error(error.message || "Signup failed");
      return;
    }

    setMessage("Account created successfully!");
    toast.success("Welcome to Maa Kali Enterprise!");
  };

  const onGoogle = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onSuccess: () => router.push("/"),
        onError: () => {
          toast.error("Google sign-in failed");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex w-full bg-white">
      
      {/* --- LEFT SIDE: BRANDING & IMAGE --- */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-60">
          <Image
            src="/puri-image.jpg" // Using the same consistent image, or switch to another pilgrimage image
            alt="Pilgrimage Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-orange-900/80 via-slate-900/60 to-slate-900/90" />

        {/* Content */}
        <div className="relative z-10 max-w-lg text-center px-12 space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
            <SparklesIcon className="w-8 h-8 text-orange-300" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
            Join Our Community
          </h1>
          <p className="text-lg text-slate-200 leading-relaxed">
            "Create an account to book your next divine journey seamlessly. Get exclusive offers and manage your pilgrimages in one place."
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: SIGNUP FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50/50">
        <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
          
          {/* Form Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Create Account
            </h2>
            <p className="text-slate-500">
              Start your travel journey with us
            </p>
          </div>

          {/* Google Button */}
          <Button
            variant="outline"
            className="w-full h-11 text-base font-medium border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-3 rounded-xl"
            onClick={onGoogle}
            type="button"
            disabled={isPending}
          >
            <Image 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              width={20} 
              height={20} 
              alt="Google" 
            />
            Sign up with Google
          </Button>

          <div className="relative flex items-center py-2">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink-0 mx-4 text-slate-400 text-xs uppercase font-medium tracking-wider">
              Or register with email
            </span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold text-sm">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="John Doe"
                          {...field}
                          disabled={isPending}
                          className="pl-10 h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-slate-50/50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold text-sm">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          {...field}
                          disabled={isPending}
                          className="pl-10 h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-slate-50/50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold text-sm">Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="9876543210"
                          type="tel"
                          {...field}
                          disabled={isPending}
                          className="pl-10 h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-slate-50/50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold text-sm">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                          disabled={isPending}
                          className="pl-10 h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-slate-50/50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Account...
                  </>
                ) : (
                  <>
                    Sign Up <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              {message && (
                <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm text-center font-medium border border-green-200">
                  {message}
                </div>
              )}
            </form>
          </Form>

          {/* Footer */}
          <p className="text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}