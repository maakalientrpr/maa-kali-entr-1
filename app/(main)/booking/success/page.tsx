import Link from "next/link";
import {
  CheckCircle,
  Calendar,
  Users,
  CreditCard,
  MessageSquare,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

// 1. Mark component as async
export default async function BookingSuccessPage({
  searchParams,
}: {
  // 2. Define searchParams as a Promise
  searchParams: Promise<{ orderId: string }>;
}) {
  // 3. Await the params
  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    return redirect("/");
  }

  // 4. Fetch Booking Details from DB
  const booking = await prisma.booking.findFirst({
    where: {
      paymentId: orderId,
    },
    include: {
      tourPackage: true,
      passengers: true,
    },
  });

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p>Booking processed. Please check your email for updates.</p>
      </div>
    );
  }

  const tourDate = new Date(booking.tourPackage.startDate).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-green-50 p-8 text-center border-b border-green-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Received!
          </h1>
          <p className="text-green-700 text-sm mt-1">
            We have received your payment for{" "}
            <span className="font-semibold">{booking.tourPackage.title}</span>.
          </p>
        </div>

        {/* Booking Details */}
        <div className="p-6 space-y-6">
          {/* Trip Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date
              </span>
              <span className="font-medium text-gray-900">{tourDate}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 flex items-center gap-1">
                <Users className="w-3 h-3" /> Travelers
              </span>
              <span className="font-medium text-gray-900">
                {booking.passengers.length} Person(s)
              </span>
            </div>
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* ✅ NEW SECTION: WHAT HAPPENS NEXT */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <h3 className="font-bold text-orange-800 text-sm mb-2 flex items-center gap-2">
              What Happens Next?
            </h3>
            <p className="text-xs text-orange-700 mb-3 leading-relaxed">
              Your booking is confirmed. Our team will verify details and send
              your official tickets & itinerary shortly.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="p-1.5 bg-white rounded-full text-green-600 shadow-sm">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span>
                  We will contact you on <strong>WhatsApp</strong>
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="p-1.5 bg-white rounded-full text-blue-600 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <span>
                  Ticket details sent to <strong>Email</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Total Paid</span>
            </div>
            <span className="font-bold text-lg text-gray-900">
              ₹{(booking.totalAmount / 100).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-3">
          <Link href="/account" className="w-full block">
            <Button className="w-full bg-orange-600 hover:bg-orange-700 font-semibold shadow-sm">
              View Booking Status
            </Button>
          </Link>
          <Link href="/" className="w-full block">
            <Button variant="outline" className="w-full hover:bg-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
