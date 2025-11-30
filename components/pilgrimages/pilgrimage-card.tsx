import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";



interface PilgrimageCardProps {
  title: string;
  image: string;
  description: string;
}

const PilgrimageCard = ({ title, image, description }: PilgrimageCardProps) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Image Section */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
        {/* Replace <img> with <Image fill ... /> in production */}
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay Gradient for text readability if needed, or kept clean */}
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

        {/* Action Button - Replace <a> with <Link> in production */}
        <a href="tel:+919876543210" className="mt-auto block"> 
          <Button className="w-full bg-linear-to-r from-orange-400 to-orange-700 hover:bg-orange-700 text-white gap-2 group-hover:translate-y-0 transition-all">
            <Phone className="w-4 h-4" /> Enquire Now
          </Button>
        </a>
      </div>
    </div>
  );
};

export default PilgrimageCard;