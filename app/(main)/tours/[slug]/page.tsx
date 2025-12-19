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
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-10">
      {/* ---------------- SCROLLABLE HERO SECTION ---------------- */}
      <div className="relative w-full h-[55vh] lg:h-[70vh] group overflow-hidden bg-gray-900">
        
        {/* Horizontal Scroll Container (CSS Snap) */}
        <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth">
          {tour.images.map((img, index) => (
            <div key={index} className="min-w-full w-full h-full relative snap-center shrink-0">
              <Image
                src={img}
                alt={`${tour.title} image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
               {/* Subtle Dark Overlay for badge readability */}
               <div className="absolute inset-0 bg-black/10" />
            </div>
          ))}
        </div>

        {/* Photo Count Badge (Top Right) */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs md:text-sm border border-white/20 z-10">
          <ImageIcon size={14} />
          <span>{tour.images.length} Photos</span>
        </div>

        {/* Gradient Text Overlay (Only Category Badge remains here) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end pointer-events-none">
          <div className="w-full max-w-7xl mx-auto p-4 md:p-8 lg:px-8 pb-8">
            <Badge className="w-fit bg-orange-600/90 backdrop-blur-sm text-white border-none px-3 py-1 text-sm pointer-events-auto">
              {tour.category}
            </Badge>
          </div>
        </div>
      </div>

      {/* ---------------- NEW HEADER SECTION (Title & Desc after image) ---------------- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-4">
        <h1 className="text-gray-900 text-3xl md:text-5xl font-bold leading-tight mb-3">
            {tour.title}
        </h1>
        <p className="text-gray-600 flex items-center gap-2 text-lg font-medium">
            <MapPin size={20} className="text-orange-500" />
            {tour.destination}
        </p>
      </div>


      {/* ---------------- MAIN CONTENT GRID (Unchanged layout) ---------------- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN (Details) */}
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2">
                <div className="p-2 bg-orange-50 rounded-full text-orange-600">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Duration</p>
                  <p className="font-bold text-gray-900">{tour.durationDays}D / {tour.durationNights}N</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2">
                <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Start Date</p>
                  <p className="font-bold text-gray-900">
                    {new Date(tour.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2">
                <div className="p-2 bg-green-50 rounded-full text-green-600">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Seats</p>
                  <p className="font-bold text-gray-900">{tour.availableSeats} Left</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2">
                 <div className="p-2 bg-purple-50 rounded-full text-purple-600">
                  <Share2 size={20} />
                </div>
                 <div className="w-full">
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Share</p>
                  <ShareButton />
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Experience the Journey</h2>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg whitespace-pre-line">
                {tour.description}
              </p>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="fill-green-100" /> What's Included
                </h3>
                <ul className="space-y-3">
                  {tour.inclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm md:text-base text-gray-700">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {tour.exclusions?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-red-700 flex items-center gap-2">
                    <XCircle className="fill-red-100" /> What's Excluded
                  </h3>
                  <ul className="space-y-3">
                    {tour.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm md:text-base text-gray-700">
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
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold mb-8 text-gray-900">Detailed Itinerary</h2>
              <div className="relative space-y-0">
                {tour.itineraries.map((item, index) => (
                  <div key={item.id} className="relative pl-8 md:pl-10 pb-10 last:pb-0 border-l-2 border-dashed border-gray-200 last:border-0">
                    <div className="absolute -left-[11px] top-0 bg-white p-1">
                      <div className="w-4 h-4 rounded-full bg-orange-500 ring-4 ring-orange-100" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <span className="w-fit px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide">
                        Day {item.day}
                      </span>
                      <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
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

            {/* Gallery Section REMOVED (Images are now in Hero) */}
          </div>

          {/* RIGHT COLUMN (Desktop Sidebar) */}
          <div className="hidden lg:block space-y-6">
            <div className="sticky top-24">
              <Card className="shadow-xl border-orange-100 overflow-hidden rounded-2xl pt-0">
                <div className="bg-linear-to-r from-orange-500 to-orange-600 p-4 text-white text-center">
                  <p className="font-semibold text-lg">Book This Package</p>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Starting from</p>
                    <div className="flex items-center justify-center gap-1 text-gray-900">
                      <IndianRupee size={28} strokeWidth={2.5} />
                      <span className="text-4xl font-bold">{displayPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-xs text-gray-400">per person</p>
                  </div>

                  <Separator />

                  {/* Pricing Details */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                      <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Pricing Breakdown</p>
                      <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                        {tour.pickupOptions.map(opt => (
                          <div key={opt.id} className="text-sm border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                              <p className="font-semibold text-gray-800 flex items-center gap-1 mb-1">
                                <MapPin size={12} className="text-orange-500"/> {opt.title}
                              </p>
                              <div className="space-y-1 pl-4 text-gray-600 text-xs">
                                {opt.priceDoubleSharing && <div className="flex justify-between"><span>Double:</span> <span className="font-medium text-gray-900">₹{opt.priceDoubleSharing}</span></div>}
                                {opt.priceTripleSharing && <div className="flex justify-between"><span>Triple:</span> <span className="font-medium text-gray-900">₹{opt.priceTripleSharing}</span></div>}
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
                        <Button variant="outline" className="w-full border-gray-200 text-gray-600 hover:text-orange-600 hover:border-orange-200">
                          <PhoneIcon className="mr-2 h-4 w-4" /> Call Expert
                        </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 mt-6">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-1"><CheckCircle2 size={18}/></div>
                  <p className="text-[10px] text-gray-500 font-medium">Verified Tour</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-1"><Users size={18}/></div>
                  <p className="text-[10px] text-gray-500 font-medium">Best Support</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-1"><IndianRupee size={18}/></div>
                  <p className="text-[10px] text-gray-500 font-medium">Best Price</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ---------------- MOBILE STICKY FOOTER ---------------- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 lg:hidden safe-area-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Starting from</p>
            <div className="flex items-center gap-1 text-orange-600">
              <IndianRupee size={18} strokeWidth={3} />
              <span className="text-2xl font-bold">{displayPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <div className="flex-1">
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