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
import { Separator } from "@/components/ui/separator";
import { SparklesIcon, ArrowRight, Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, "Minimum 8 characters"),
});

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isPending = form.formState.isSubmitting;

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
      toast.error(error.message || "Invalid credentials");
      return;
    }

    toast.success("Welcome back!");
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
            src="/puri-image.jpg" // Ensure this image exists in public folder
            alt="Pilgrimage Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-orange-900/90 via-slate-900/50 to-slate-900/30" />

        {/* Content */}
        <div className="relative z-10 max-w-lg text-center px-12 space-y-6">
       
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
            Begin Your Spiritual Journey
          </h1>
          <p className="text-lg text-slate-200 leading-relaxed">
            "Every step taken in devotion brings you closer to inner peace. Log in to manage your bookings and explore sacred destinations."
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
          
          {/* Form Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Welcome Back
            </h2>
            <p className="text-slate-500">
              Enter your details to access your account
            </p>
          </div>

          {/* Google Button */}
          <Button
            variant="outline"
            className="w-full h-12 text-base font-medium border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-3"
            onClick={onGoogle}
            type="button"
            disabled={isPending}
          >
            <Image 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              width={24} 
              height={24} 
              alt="Google" 
            />
            Continue with Google
          </Button>

          <div className="relative flex items-center py-2">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink-0 mx-4 text-slate-400 text-xs uppercase font-medium tracking-wider">
              Or continue with email
            </span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {/* Main Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                        disabled={isPending}
                        className="h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-slate-50/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
                        <Link 
                          href="/forgot-password" 
                          className="text-xs text-orange-600 hover:text-orange-700 font-medium hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                          disabled={isPending}
                          className="h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-slate-50/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 w-5 h-5" />
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
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}