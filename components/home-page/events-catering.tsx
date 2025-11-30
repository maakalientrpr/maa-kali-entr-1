import { ArrowRightIcon } from "lucide-react";
import CateringService from "../events & catering/catering-service";
import EventsCateringCard from "../events & catering/event-card";
import { Button } from "../ui/button";
import Link from "next/link";

const EventsCatering = () => {
  const data = [
    {
      src: "/wedding.jpg",
      name: "Weddings & Destination Weddings",
      description:
        "Celebrate your special day with a perfectly planned wedding experience. From venue selection and décor to guest management, photography, rituals, and travel arrangements — we create unforgettable destination weddings tailored to your traditions and preferences.",
      price: "Starting ₹2,50,000",
    },
    {
      src: "/house.jpg",
      name: "House Inaugurations",
      price: "Starting ₹35,000",
      description:
        "Begin your new journey with auspicious blessings and seamless arrangements. We provide complete support for Griha Pravesh ceremonies including pandit booking, muhurat guidance, décor, catering, and family coordination to make your home entry sacred and memorable.",
    },
    {
      src: "/birthday.jpg",
      name: "Birthday & Celebrations",
      price: "Starting ₹20,000",
      description:
        "Make every celebration joyful and stress-free. Whether it’s a child’s birthday, family function, or milestone event, we handle décor, venue setup, entertainment, photography, catering, and personalized themes to create moments worth cherishing.",
    },
  ];

  return (
    <div className="bg-[#fdf6ed] py-10">
      <div className="text-center flex flex-col gap-2 mb-6">
        <h1 className="text-orange-500 font-bold text-2xl md:text-4xl">
          Events & Catering Services
        </h1>
        <p className="text-gray-700">
          Complete event planning and premium catering for all occasions
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-5 max-w-[90vw] mx-auto">
        {data.map((event) => (
          <EventsCateringCard
            key={event.name}
            name={event.name}
            price={event.price}
            src={event.src}
            description={event.description}
          />
        ))}
      </div>
      <CateringService />
      <div className="flex items-center justify-center">
        <Link href={"/events&catering"}>
          <Button>
            Explore all service
            <ArrowRightIcon />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventsCatering;
