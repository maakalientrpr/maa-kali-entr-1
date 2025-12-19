import Image from "next/image";
import {
  Clock,
  MapPin,
  PhoneIcon,
  Users,
  IndianRupee,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Share2,
  ImageIcon,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/db";
import ShareButton from "@/components/ShareButton";
import TourBookingButton from "@/components/TourBookingButton";
import Link from "next/link";
import { requireAuth } from "@/lib/auth-utils";

const TourPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  await requireAuth();
  const { slug } = await params;

  const tour = await prisma.tourPackage.findUnique({
    where: { slug },
    include: {
      itineraries: {
        orderBy: { day: "asc" },
      },
      pickupOptions: true,
    },
  });

  if (!tour || !tour.isPublished) return notFound();

  // Price Calculation Logic
  let minPrice = Infinity;
  if (tour.pickupOptions && tour.pickupOptions.length > 0) {
    tour.pickupOptions.forEach((opt) => {
      if (opt.priceSingleSharing && opt.priceSingleSharing > 0)
        minPrice = Math.min(minPrice, opt.priceSingleSharing);
      if (opt.priceDoubleSharing && opt.priceDoubleSharing > 0)
        minPrice = Math.min(minPrice, opt.priceDoubleSharing);
      if (opt.priceTripleSharing && opt.priceTripleSharing > 0)
        minPrice = Math.min(minPrice, opt.priceTripleSharing);
    });
  }
  const displayPrice = minPrice === Infinity ? 0 : minPrice;

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-10">
      {/* ---------------- 1. CLEAN IMAGE SLIDER (No Text) ---------------- */}
      <div className="relative w-full h-[40vh] md:h-[55vh] lg:h-[65vh] bg-gray-100 group">
        {/* Horizontal Scroll Container */}
        <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth">
          {tour.images.map((img, index) => (
            <div
              key={index}
              className="min-w-full w-full h-full relative snap-center shrink-0"
            >
              <Image
                src={img}
                alt={`${tour.title} image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Photo Count Badge (Floating Top Right) */}
        <div className="absolute top-4 right-4 md:top-6 md:right-8 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium border border-white/10 z-10">
          <ImageIcon size={14} />
          <span>{tour.images.length} Photos</span>
        </div>
      </div>

      {/* ---------------- 2. TITLE & HEADER SECTION (Below Image) ---------------- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-10">
        <div className="flex flex-col gap-3 md:gap-4 border-b border-gray-100 pb-8">
          <div className="flex items-center justify-between">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none px-3 py-1 text-xs font-bold uppercase tracking-wide">
              {tour.category}
            </Badge>
            {/* Desktop Share Button */}
            <div className="hidden md:block">
              <ShareButton />
            </div>
          </div>

          <h1 className="text-gray-900 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
            {tour.title}
          </h1>

          <div className="flex flex-col  items-start gap-y-2 gap-x-6 text-gray-600 text-sm md:text-base font-medium">
            <p className="flex items-center gap-2">
              <MapPin size={18} className="text-orange-500" />
              <p className="max-w-[100vw]">
                {tour.destination.length > 50
                  ? tour.destination.slice(0, 50) + "..."
                  : tour.destination}
              </p>
            </p>
            <p className="flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              {tour.durationDays} Days / {tour.durationNights} Nights
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- 3. MAIN CONTENT GRID ---------------- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* LEFT COLUMN (Details) */}
          <div className="lg:col-span-2 space-y-8 md:space-y-10">
            {/* Mobile Stats & Share (Visible only on small screens) */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col items-center justify-center text-center">
                <CalendarDays size={18} className="text-blue-600 mb-1" />
                <span className="text-xs text-gray-500">Start Date</span>
                <span className="text-sm font-bold text-gray-900">
                  {new Date(tour.startDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col items-center justify-center text-center">
                <Users size={18} className="text-green-600 mb-1" />
                <span className="text-xs text-gray-500">Seats</span>
                <span className="text-sm font-bold text-gray-900">
                  {tour.availableSeats} Left
                </span>
              </div>
            </div>

            {/* Overview */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                About this Trip
              </h2>
              <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
                {tour.description}
              </p>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100">
                <h3 className="font-bold text-lg mb-4 text-green-800 flex items-center gap-2">
                  <CheckCircle2
                    size={20}
                    className="fill-green-600 text-white"
                  />{" "}
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {tour.inclusions.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm text-gray-700"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {tour.exclusions?.length > 0 && (
                <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
                  <h3 className="font-bold text-lg mb-4 text-red-800 flex items-center gap-2">
                    <XCircle size={20} className="fill-red-500 text-white" />{" "}
                    What's Excluded
                  </h3>
                  <ul className="space-y-3">
                    {tour.exclusions.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-gray-700"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Itinerary */}
            {tour.itineraries.length > 0 && (
              <div className="pt-4">
                <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">
                  Detailed Itinerary
                </h2>
                <div className="space-y-0">
                  {tour.itineraries.map((item, index) => (
                    <div
                      key={item.id}
                      className="relative pl-8 md:pl-10 pb-12 last:pb-0 border-l-[2px] border-gray-200 last:border-0 ml-3"
                    >
                      <div className="absolute -left-[9px] top-0 bg-white py-1">
                        <div className="w-4 h-4 rounded-full bg-orange-500 ring-4 ring-white shadow-sm" />
                      </div>
                      <div className="flex flex-col gap-2 mb-2">
                        <span className="w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                          Day {item.day}
                        </span>
                        <h3 className="font-bold text-lg text-gray-900">
                          {item.title}
                        </h3>
                      </div>
                      {item.description.length > 0 && (
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (Desktop Sidebar) */}
          <div className="hidden lg:block space-y-6">
            <div className="sticky top-24">
              <Card className="shadow-xl border-orange-100 overflow-hidden rounded-2xl">
                <div className="bg-gray-900 p-4 text-white text-center">
                  <p className="font-semibold text-lg">Book This Package</p>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Starting from</p>
                    <div className="flex items-center justify-center gap-1 text-gray-900">
                      <IndianRupee size={28} strokeWidth={2.5} />
                      <span className="text-4xl font-bold">
                        {displayPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">per person</p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <CalendarDays size={16} /> Start Date
                      </span>
                      <span className="font-semibold text-gray-900">
                        {new Date(tour.startDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Users size={16} /> Availability
                      </span>
                      <span className="font-semibold text-green-600">
                        {tour.availableSeats} Seats Left
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing Details */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                    <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                      Option Wise Pricing
                    </p>
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                      {tour.pickupOptions.map((opt) => (
                        <div
                          key={opt.id}
                          className="text-sm border-b border-gray-200 last:border-0 pb-2 last:pb-0"
                        >
                          <p className="font-bold text-gray-800 flex items-center gap-1 mb-1 text-xs">
                            <MapPin size={10} className="text-orange-500" />{" "}
                            {opt.title}
                          </p>
                          <div className="space-y-1 pl-3 text-gray-600 text-xs">
                            {opt.priceDoubleSharing && (
                              <div className="flex justify-between">
                                <span>Double Sharing</span>{" "}
                                <span className="font-medium text-gray-900">
                                  ₹{opt.priceDoubleSharing.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {opt.priceTripleSharing && (
                              <div className="flex justify-between">
                                <span>Triple Sharing</span>{" "}
                                <span className="font-medium text-gray-900">
                                  ₹{opt.priceTripleSharing.toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <TourBookingButton
                      title={tour.title}
                      tourId={tour.id}
                      pickupOptions={tour.pickupOptions}
                    />
                    <Link href="tel:+919330942690" className="block w-full">
                      <Button
                        variant="outline"
                        className="w-full h-12 border-gray-300 text-gray-700 hover:text-orange-600 hover:border-orange-200"
                      >
                        <PhoneIcon className="mr-2 h-4 w-4" /> Talk to Expert
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="flex justify-around items-center pt-4 opacity-80">
                <div className="flex flex-col items-center gap-1">
                  <CheckCircle2 size={20} className="text-green-600" />
                  <span className="text-[10px] font-medium text-gray-500">
                    Verified
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Users size={20} className="text-blue-600" />
                  <span className="text-[10px] font-medium text-gray-500">
                    Support
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <IndianRupee size={20} className="text-orange-600" />
                  <span className="text-[10px] font-medium text-gray-500">
                    Best Price
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- MOBILE STICKY FOOTER ---------------- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 lg:hidden safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <div className="flex-1">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
              Starting from
            </p>
            <div className="flex items-center gap-0.5 text-gray-900">
              <IndianRupee size={16} strokeWidth={3} />
              <span className="text-xl font-extrabold">
                {displayPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <div className="flex-[1.5]">
            <TourBookingButton
              title={tour.title}
              tourId={tour.id}
              pickupOptions={tour.pickupOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPage;
