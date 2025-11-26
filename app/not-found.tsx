"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 4000);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-4 text-center">
      <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-6">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Link
        href="/"
        className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
