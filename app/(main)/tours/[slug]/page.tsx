import Image from "next/image";
import { Clock, MapPin, PhoneIcon, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    },
  });

  if (!tour || !tour.isPublished) return notFound();

  const isSamePrice = tour?.priceDoubleSharing === tour?.priceTripleSharing;
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="relative w-full h-[60vh]">
        <Image
          src={tour.images[0]}
          alt={tour.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-end p-8">
          <div>
            <h1 className="text-white text-4xl font-bold">{tour.title}</h1>
            <p className="text-gray-200 flex items-center gap-2 mt-2">
              <MapPin size={18} />
              {tour.destination}
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tour Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">About this Tour</h2>
              <p className="text-gray-600 leading-relaxed">
                {tour.description}
              </p>

              <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-700">
                <span className="flex items-center gap-2">
                  <Clock size={16} /> {tour.durationDays} Days /{" "}
                  {tour.durationNights} Nights
                </span>

                <span className="flex items-center gap-2">
                  <Users size={16} /> {tour.availableSeats} Seats Available
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Itinerary */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Detailed Itinerary</h2>

              <div className="space-y-4">
                {tour.itineraries.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-4 border-orange-500 pl-4"
                  >
                    <h3 className="font-semibold text-lg">
                      Day {item.day}: {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inclusions & Exclusions */}
          <Card>
            <CardContent className="p-6 grid md:grid-cols-2 gap-8">
              {/* Inclusions */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-green-600">
                  ✅ Inclusions
                </h3>

                <div className="flex flex-wrap gap-2">
                  {tour.inclusions.map((item, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exclusions */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-red-600">
                  ❌ Exclusions
                </h3>

                <div className="flex flex-wrap gap-2">
                  {tour.exclusions.map((item, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6 sticky top-24 h-fit">
          {/* Pricing Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Pricing</h2>

              <div className="space-y-2 text-gray-800 text-lg font-semibold">
                {isSamePrice ? (
                  <p>Price Per Person: ₹{tour.priceDoubleSharing}</p>
                ) : (
                  <>
                    <p>Double Sharing: ₹{tour.priceDoubleSharing}</p>
                    <p>Triple Sharing: ₹{tour.priceTripleSharing}</p>
                  </>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <TourBookingButton
                  title={tour.title}
                  tourId={tour.id}
                  price={
                    isSamePrice
                      ? tour.priceDoubleSharing
                      : Math.min(
                          tour.priceDoubleSharing,
                          tour.priceTripleSharing
                        )
                  }
                />

                <Link href="tel:+919330942690">
                  <Button asChild variant="outline" className="w-full mb-2">
                    <div className="flex items-center gap-1">
                      <PhoneIcon />
                      Enquire
                    </div>
                  </Button>
                </Link>

                <ShareButton />
              </div>
            </CardContent>
          </Card>

          {/* Pickup Points */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3">Pickup Points</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {tour.pickupPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ---------------- IMAGE GALLERY ---------------- */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-semibold mb-4">Gallery</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tour.images.map((img, index) => (
            <div
              key={index}
              className="relative h-48 rounded-lg overflow-hidden"
            >
              <Image
                src={img}
                alt={`${tour.title} image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourPage;
