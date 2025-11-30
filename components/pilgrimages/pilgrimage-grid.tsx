import { Button } from "@/components/ui/button";
import { Pilgrimage } from "@/prisma/generated/client";
import { Phone } from "lucide-react";
// import PilgrimageCard from "./pilgrimage-card"; // Inlined below for preview stability

// NOTE: Next.js specific components (Image, Link) might cause issues in some preview environments.
// If using Next.js, uncomment the imports and use the components.
// import Image from "next/image";
// import Link from "next/link";

interface PilgrimageCardProps {
  title: string;
  image: string;
  description: string;
}

// Inlined Card Component for Preview Compilation
const PilgrimageCard = ({ title, image, description }: PilgrimageCardProps) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Image Section */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
          {title}
        </h3>
        
        <p className="mb-6 text-sm text-gray-600 line-clamp-3 leading-relaxed flex-1">
          {description}
        </p>

        {/* Action Button */}
        <a href="tel:+919876543210" className="mt-auto block"> 
          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white gap-2 group-hover:translate-y-0 transition-all">
            <Phone className="w-4 h-4" /> Enquire Now
          </Button>
        </a>
      </div>
    </div>
  );
};

interface PilgrimageGridProps {
  pilgrimages: Pilgrimage[];
}

const PilgrimageGrid = ({ pilgrimages }: PilgrimageGridProps) => {
  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {pilgrimages.map((item) => (
          <PilgrimageCard
            key={item.id}
            title={item.title}
            image={item.image}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default PilgrimageGrid;