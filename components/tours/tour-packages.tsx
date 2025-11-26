import TourPackageCard from "@/components/tours/tour-package-card";
interface tourSchema {
  id: string;
  images: string[];
  title: string;
  slug: string
  durationDays: number;
  availableSeats: number;
  priceDoubleSharing: number;
}

interface toursSchema {
  tours: tourSchema[];
}

const TourPackages = async ({ tours }: toursSchema) => {
  return (
    <div className="p-5 flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour: tourSchema) => (
          <TourPackageCard
            key={tour.id}
            id={tour.id}
            slug={tour.slug}
            image={tour.images?.[0] ?? "/placeholder.jpg"} // ✅ handle missing image
            title={tour.title}
            days={tour.durationDays}
            people={tour.availableSeats}
            price={tour.priceDoubleSharing}
          />
        ))}
      </div>

      
    </div>
  );
};

export default TourPackages;
