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
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
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
  const [isSuccess, setIsSuccess] = useState(false); // Track if signup was successful
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
      phoneNumber: values.phone,
      callbackURL: "/login", // Redirect here after verification click
    } as any);

    if (error) {
      toast.error(error.message || "Signup failed");
      return;
    }

    // Show verification pending UI
    setIsSuccess(true);
    toast.success("Account created! Please check your email.");
  };

  const onGoogle = async () => {
    await authClient.signIn.social(
      { provider: "google" },
      {
        onSuccess: () => router.push("/"),
        onError: () => {
          toast.error("Google sign-in failed");
        },
      }
    );
  };

  // --- 3. VERIFICATION PENDING UI ---
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in zoom-in duration-300">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <Mail className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            Check Your Email
          </h2>
          <p className="text-slate-600 text-lg">
            We've sent a verification link to <br />
            <span className="font-semibold text-orange-600">
              {form.getValues("email")}
            </span>
            .
          </p>
          <p className="text-sm text-slate-500">
            Click the link in the email to verify your account and sign in.
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-4">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* ... (Left Side - Branding - UNCHANGED) ... */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-60">
          <Image
            src="/puri-image.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/80 via-slate-900/60 to-slate-900/90" />
        <div className="relative z-10 max-w-lg text-center px-12 space-y-6">
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
            Join Our Community
          </h1>
          <p className="text-lg text-slate-200 leading-relaxed">
            "Create an account to book your next divine journey seamlessly."
          </p>
        </div>
      </div>

      {/* ... (Right Side - Form) ... */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50/50">
        <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Create Account
            </h2>
            <p className="text-slate-500">Start your travel journey with us</p>
          </div>

          <Button
            variant="outline"
            className="w-full h-11 text-base font-medium border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-3 rounded-xl"
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
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold text-sm">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="John Doe"
                          {...field}
                          disabled={isPending}
                          className="pl-10 h-11 border-slate-200 rounded-xl bg-slate-50/50"
                        />
                      </div>
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
                    <FormLabel className="text-slate-700 font-semibold text-sm">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          {...field}
                          disabled={isPending}
                          className="pl-10 h-11 border-slate-200 rounded-xl bg-slate-50/50"
                        />
                      </div>
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
                    <FormLabel className="text-slate-700 font-semibold text-sm">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="9876543210"
                          type="tel"
                          {...field}
                          disabled={isPending}
                          className="pl-10 h-11 border-slate-200 rounded-xl bg-slate-50/50"
                        />
                      </div>
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
                    <FormLabel className="text-slate-700 font-semibold text-sm">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                          disabled={isPending}
                          className="pl-10 h-11 border-slate-200 rounded-xl bg-slate-50/50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all hover:scale-[1.02]"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending
                    Link...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" /> Sign Up
                  </>
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-orange-600 font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
