import AnnouncementBar from "@/components/AnnouncementBar";
import CateringServices from "@/components/events & catering/CateringServices";
import EventsCateringCard from "@/components/events & catering/event-card";
import { Button } from "@/components/ui/button";
import { PhoneCallIcon } from "lucide-react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

const page = () => {
  const data = [
    {
      src:'/wedding.jpg',
      name: "Premium Wedding Package",
      price: "Starting ₹2,50,000",
      icon: "HeartIcon",

      services: [
        "Complete venue decoration",
        "Catering for 300+ guests",
        "Professional photography & videography",
        "Stage & lighting setup",
        "Wedding coordination team",
        "Guest accommodation assistance",
      ],
    },
    {
      src:'/house.jpg',
      name: "House Inaugurations",
      price: "Starting ₹35,000",
      icon: "HouseIcon",
      services: [
        "Pandit ji arrangement",
        "Traditional pooja setup",
        "Decoration & flower arrangements",
        "Catering for 50-100 guests",
        "Photography coverage",
        "All pooja material included",
      ],
    },
    {
      src:'/birthday.jpg',
      name: "Birthday, Anniversary & Other Celebrations",
      price: "Starting ₹20,000",
      icon: "CakeIcon",

      services: [
        "Theme-based decoration",
        "Customized cake & deserts",
        "Entertainment setup",
        "Catering for 50 guests",
        "Return gifts arrangement",
        "Photography & videography",
      ],
    },
  ];
  return (
    <div className="bg-muted">
      <AnnouncementBar />
      <div className="mt-12 text-center flex flex-col gap-2 mb-6">
        <h1 className="text-orange-500 font-bold text-4xl md:text-4xl">
          Events & Catering
        </h1>
        <p className="text-gray-700">
          Making your special occassions unforgettable with perfect planning and
          delicious food
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-5 max-w-[90vw] mx-auto">
        {data.map((event) => (
          <EventsCateringCard
            key={event.name}
            price={event.price}
            name={event.name}
            services={event.services}
            icon={event.icon}
            src={event.src}
          />
        ))}
      </div>
      <CateringServices />
      <ContactUs />
    </div>
  );
};

export default page;



const ContactUs = () => {
  return (
    <div className="bg-orange-600 mx-5 rounded-lg text-white py-12 px-6 my-10">
      {/* Heading */}
      <div className="text-center space-y-3">
        <h3 className="text-3xl md:text-4xl font-bold tracking-wide">
          Ready to Plan Your Event?
        </h3>

        <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto">
          Contact us today for a free consultation and a fully customized quote.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
        {/* CALL BUTTON */}
        <Link href="tel:+919330942690">
          <Button className="bg-white text-orange-600 font-semibold hover:scale-105 cursor-pointer hover:bg-gray-100 px-6 py-3 rounded-xl flex items-center gap-2 shadow-md">
            <PhoneCallIcon className="size-5" />
            Call Now
          </Button>
        </Link>

        {/* WHATSAPP BUTTON */}
        <Link
          href="https://wa.me/919330942690"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="bg-green-600 hover:bg-green-700 hover:scale-105 cursor-pointer text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-md">
            <FaWhatsapp className="size-5" />
            WhatsApp Us
          </Button>
        </Link>
      </div>
    </div>
  );
};
