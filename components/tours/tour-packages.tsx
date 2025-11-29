"use client"; // 👈 Important: This makes it a Client Component

import { useState } from "react";
import TourPackageCard from "@/components/tours/tour-package-card";
import { cn } from "@/lib/utils"; // Assuming you have a utils file, or use conditional strings

// Match this with your Prisma Enum
type TourCategory = "DOMESTIC" | "INTERNATIONAL" | "WEEKEND";

type PickupOption = {
  id: string;
  title: string;
  priceSingleSharing: number;
  priceDoubleSharing: number | null;
  priceTripleSharing: number | null;
};

interface TourSchema {
  id: string;
  images: string[];
  title: string;
  slug: string;
  durationDays: number;
  pickupOptions: PickupOption[];
  availableSeats: number;
  price: number;
  category: TourCategory; // 👈 Ensure this is part of the interface
}

interface ToursSchema {
  tours: (TourSchema & Record<string, any>)[];
}

const TourPackages = ({ tours }: ToursSchema) => {
  const [activeTab, setActiveTab] = useState<TourCategory | "ALL">("ALL");

  // Filter tours based on active tab
  const filteredTours = tours.filter((tour) => {
    if (activeTab === "ALL") return true;
    return tour.category === activeTab;
  });

  const tabs = [
    { label: "All Tours", value: "ALL" },
    { label: "Domestic", value: "DOMESTIC" },
    { label: "International", value: "INTERNATIONAL" },
    { label: "Weekend", value: "WEEKEND" },
  ];

  return (
    <div className="p-5 flex flex-col gap-8">
      {/* --- TABS SECTION --- */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-gray-100/80 rounded-full border border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as TourCategory | "ALL")}
              className={`
                px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${
                  activeTab === tab.value
                    ? "bg-white text-orange-600 shadow-sm border border-gray-100"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- GRID SECTION --- */}
      {filteredTours.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredTours.map((tour) => (
            <TourPackageCard
              key={tour.id}
              id={tour.id}
              slug={tour.slug}
              image={tour.images?.[0] ?? "/placeholder.jpg"}
              title={tour.title}
              pickupOptions={tour.pickupOptions}
              days={tour.durationDays}
              people={tour.availableSeats}
              price={tour.price}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p>No tours found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default TourPackages;