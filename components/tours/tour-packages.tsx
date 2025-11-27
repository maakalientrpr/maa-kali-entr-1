import TourPackageCard from "@/components/tours/tour-package-card";

type PickupOption = {
  id: string;
  title: string;
  priceSingleSharing: number;
  priceDoubleSharing: number | null;
  priceTripleSharing: number | null;
};

interface tourSchema {
  id: string;
  images: string[];
  title: string;
  slug: string;
  durationDays: number;
 pickupOptions: PickupOption[]; // ✅ Added pickupOptions  availableSeats: number;
  price: number; // ✅ Changed from priceDoubleSharing to generic price
}

interface toursSchema {
  // Allow the passed tours to have more properties (like pickupOptions) but enforce the ones we need
  tours: (tourSchema & Record<string, any>)[]; 
}

const TourPackages = async ({ tours }: toursSchema) => {
  return (
    <div className="p-5 flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <TourPackageCard
            key={tour.id}
            id={tour.id}
            slug={tour.slug}
            image={tour.images?.[0] ?? "/placeholder.jpg"}
            title={tour.title}
            pickupOptions={tour.pickupOptions}
            days={tour.durationDays}
            people={tour.availableSeats}
            price={tour.price} // ✅ Use the calculated min price
          />
        ))}
      </div>
    </div>
  );
};

export default TourPackages;