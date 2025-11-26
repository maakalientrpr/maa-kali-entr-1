import Image from "next/image";
import { Card, CardHeader, CardDescription } from "../ui/card";
import { Button } from "../ui/button";

export default function EventsCateringCard({
  src,
  name,
  description,
}: {
  src: string;
  name: string;
  description: string;
}) {
  return (
    <Card
      className="
    p-0
      group 
      bg-white 
      overflow-hidden 
      rounded-2xl 
      shadow-sm 
      hover:shadow-xl 
      transition-all 
      duration-300 
      border border-gray-200
    "
    >
      {/* IMAGE */}
      <div className="overflow-hidden">
        <Image
          src={src}
          alt={name}
          width={500}
          height={300}
          className="
            w-full 
            h-48 
            object-cover 
            transition-all 
            duration-500 
            group-hover:scale-110
          "
        />
      </div>

      {/* TEXT */}
      <CardHeader className="space-y-2 pb-2">
        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition">
          {name}
        </h3>
        <CardDescription className="text-sm text-gray-500">
          {description}
        </CardDescription>
      </CardHeader>

      {/* BUTTON */}
      <div className="flex items-center justify-center pb-5">
        <Button
          className="
            text-orange-600 
            bg-white 
            border 
            border-orange-500 
            rounded-full
            px-6
            py-2
            hover:bg-orange-500 
            hover:text-white 
            hover:shadow-md 
            transition-all 
            duration-300
          "
        >
          View Packages
        </Button>
      </div>
    </Card>
  );
}
