import Image from "next/image";
import { Clock, MapPin, PhoneIcon, Users, IndianRupee } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/db";
import ShareButton from "@/components/ShareButton";
import TourBookingButton from "@/components/TourBookingButton";
import Link from "next/link";

const TourPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const tour = await prisma.tourPackage.findUnique({
    where: { slug },
    include: {
      itineraries: {
        orderBy: { day: "asc" },
      },
      pickupOptions: true, // ✅ Fetch pickup options
    },
  });

  if (!tour || !tour.isPublished) return notFound();

  // ✅ Calculate Lowest Starting Price
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
    <div className="min-h-screen bg-gray-50">
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="relative w-full h-[60vh]">
        <Image
          src={tour.images[0]}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 md:p-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div>
                <Badge className="mb-3 bg-orange-600 hover:bg-orange-700 text-white">
                  {tour.category}
                </Badge>
                <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight">
                  {tour.title}
                </h1>
                <p className="text-gray-200 flex items-center gap-2 mt-2 text-lg">
                  <MapPin size={20} className="text-orange-500" />
                  {tour.destination}
                </p>
              </div>

              {/* Price Tag on Hero (Mobile/Desktop) */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white min-w-[160px]">
                <p className="text-xs uppercase tracking-wider opacity-80">
                  Starts from
                </p>
                <p className="text-3xl font-bold flex items-center">
                  <IndianRupee size={24} strokeWidth={2.5} />
                  {displayPrice.toLocaleString("en-IN")}
                </p>
                <p className="text-xs opacity-80">per person</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tour Info */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {tour.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Duration
                  </p>
                  <p className="font-semibold text-orange-700 flex items-center justify-center gap-1">
                    <Clock size={16} /> {tour.durationDays}D /{" "}
                    {tour.durationNights}N
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Availability
                  </p>
                  <p className="font-semibold text-blue-700 flex items-center justify-center gap-1">
                    <Users size={16} /> {tour.availableSeats} Seats
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Start Date
                  </p>
                  <p className="font-semibold text-green-700">
                    {new Date(tour.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itinerary */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Detailed Itinerary
              </h2>

              <div className="space-y-8">
                {tour.itineraries.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative pl-8 border-l-2 border-orange-200 last:border-0"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 ring-4 ring-white" />
                    <div className="mb-1 flex items-center gap-3">
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">
                        Day {item.day}
                      </span>
                      <h3 className="font-bold text-lg text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inclusions & Exclusions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-green-700 flex items-center gap-2">
                  ✅ Inclusions
                </h3>
                <ul className="space-y-2">
                  {tour.inclusions.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="mt-1 block min-w-[6px] h-[6px] rounded-full bg-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-red-700 flex items-center gap-2">
                  ❌ Exclusions
                </h3>
                <ul className="space-y-2">
                  {tour.exclusions.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="mt-1 block min-w-[6px] h-[6px] rounded-full bg-red-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT SIDE (Sticky Booking) */}
        <div className="space-y-6 sticky top-24 h-fit">
          <Card className="shadow-lg border-orange-100 overflow-hidden">
            <div className="bg-orange-50 p-4 border-b border-orange-100">
              <p className="text-sm text-center text-orange-800 font-medium">
                Limited Seats Available!
              </p>
            </div>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-500">Starting from</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                    <IndianRupee size={28} strokeWidth={2.5} />
                    {displayPrice.toLocaleString("en-IN")}
                  </h3>
                  <span className="text-gray-500 mb-1.5">/ person</span>
                </div>
              </div>

              {/* 🔥 NEW: Detailed Pricing Breakdown */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-3 border border-slate-100">
                <p className="text-sm font-semibold text-gray-700 border-b border-slate-200 pb-2">
                  Pricing Details (per person)
                </p>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {tour.pickupOptions.map((opt) => (
                    <div key={opt.id} className="text-sm">
                      <p className="font-medium text-orange-600 mb-1 flex items-center gap-1">
                        <MapPin size={12} /> {opt.title}
                      </p>
                      <div className="grid gap-1.5 pl-2 border-l-2 border-orange-100">
                        {(opt.priceDoubleSharing ?? 0) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-xs">Double Sharing</span>
                            <span className="font-semibold">
                              ₹
                              {(opt.priceDoubleSharing ?? 0).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>
                        )}
                        {(opt.priceTripleSharing ?? 0) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-xs">Triple Sharing</span>
                            <span className="font-semibold">
                              ₹
                              {(opt.priceTripleSharing ?? 0).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>
                        )}
                        {(opt.priceSingleSharing ?? 0) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-xs">Single Sharing</span>
                            <span className="font-semibold">
                              ₹
                              {(opt.priceSingleSharing ?? 0).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <TourBookingButton
                  title={tour.title}
                  tourId={tour.id}
                  pickupOptions={tour.pickupOptions} // Pass base price, form handles specific logic
                />

                <Link href="tel:+919330942690" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-gray-300 hover:bg-gray-50 hover:text-orange-600"
                  >
                    <div className="flex items-center gap-2">
                      <PhoneIcon size={18} />
                      Talk to an Expert
                    </div>
                  </Button>
                </Link>

                <div className="pt-2">
                  <ShareButton />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ---------------- IMAGE GALLERY ---------------- */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Tour Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tour.images.map((img, index) => (
            <div
              key={index}
              className={`relative rounded-xl overflow-hidden group ${
                index === 0 ? "col-span-2 row-span-2 h-96" : "h-48"
              }`}
            >
              <Image
                src={img}
                alt={`${tour.title} image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourPage;