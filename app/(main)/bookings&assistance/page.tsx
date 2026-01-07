"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  BusIcon,
  PlaneIcon,
  TrainIcon,
  GlobeIcon,
  ShieldIcon,
  PhoneIcon,
  FileTextIcon,
  CheckCircleIcon,
  CheckIcon,
  PhoneCallIcon,
} from "lucide-react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
/* -----------------------------------------
                 PAGE DATA
------------------------------------------ */
const cardsData = [
  {
    icon: <TrainIcon className="text-orange-500 size-10" />,
    title: "Train Booking",
    description:
      "IRCTC Tatkal & General booking assistance. We handle the rush for you!",
    items: [
      "Tatkal Booking",
      "Seat Preference",
      "Group Bookings",
      "Premium Trains",
    ],
  },
  {
    icon: <PlaneIcon className="text-orange-500 size-10" />,
    title: "Flight Booking",
    description:
      "Best deals on domestic and international flights with flexible options.",
    items: [
      "Domestic Flights",
      "International Flights",
      "Best Prices",
      "Group Discounts",
    ],
  },
  {
    icon: <BusIcon className="text-orange-500 size-10" />,
    title: "Bus Booking",
    description:
      "Comfortable bus journeys with trusted operations across India.",
    items: [
      "AC & Non AC",
      "Sleeper & Seater",
      "Private Buses",
      "Group Charter",
    ],
  },
  {
    icon: <GlobeIcon className="text-orange-500 size-10" />,
    title: "Visa & Passport",
    description:
      "Complete assistance for passport applications and visa processing.",
    items: [
      "Passport Application Support",
      "Visa Document Guidance",
      "Travel Visa Processing",
      "Appointment Scheduling Assistance",
    ],
  },
  {
    icon: <ShieldIcon className="text-orange-500 size-10" />,
    title: "LIC & Mediclaim",
    description:
      "Expert advisory for life insurance & health insurance policies.",
    items: [
      "Life Insurance Planning",
      "Mediclaim Assistance",
      "Policy Comparison",
      "Claim Support & Guidance",
    ],
  },
];

/* -----------------------------------------
                 PAGE COMPONENT
------------------------------------------ */
const page = () => {
  return (
    <div className="bg-muted  shadow ">
      {/* Title */}
      <div className="text-center mt-12 flex flex-col gap-2 mb-12">
        <h1 className="text-orange-500 font-bold text-3xl md:text-4xl">
          Bookings & Assistance
        </h1>
        <p className="text-gray-700">
          Your one-stop solution for travel bookings and advisory services
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-5">
        {cardsData.map((card) => (
          <BookingCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            description={card.description}
            items={card.items}
          />
        ))}
      </div>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* VISA & PASSPORT SECTION */}
      <VisaPassport />

      {/* LIC & Mediclain Advisory */}
      <LicMediclaim />

         {/* Contact us */}
         <ContactUs />
    </div>
  );
};

export default page;

/* -----------------------------------------
   REUSABLE CARD COMPONENT
------------------------------------------ */
const BookingCard = ({
  icon,
  title,
  description,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  items: string[];
}) => {
  return (
    <Card className="p-3 shadow hover:shadow-md transition-all rounded-xl">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-orange-200 p-3 rounded-xl">{icon}</div>
          <CardTitle>{title}</CardTitle>
        </div>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <ul className="space-y-2 px-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-gray-700">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            {item}
          </li>
        ))}
      </ul>

      <CardFooter className="mt-4">
        <Link href="tel:+919330942690">
          <Button className="w-full bg-orange-600 text-white hover:bg-orange-700">
            Get Assistance
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const VisaPassport = () => {
  return (
    <div className="mx-5 bg-[#f4f5fe] flex flex-col md:flex-row px-10 gap-10 items-center py-10 rounded-3xl my-12 shadow">
      {/* Left */}
      <div className="flex-1">
        <div className="flex flex-col gap-4">
          <div className="p-3 bg-orange-100 rounded-xl w-fit text-orange-600 shadow-sm">
            <FileTextIcon />
          </div>

          <h3 className="text-2xl font-bold text-gray-800">
            Visa & Passport Assistance
          </h3>

          <p className="text-gray-600 leading-relaxed">
            Getting a passport or visa can be confusing. Let our experts guide
            you through the entire process with ease.
          </p>
        </div>

        {/* Bullet Points */}
        <ul className="mt-6 space-y-2 text-gray-700">
          <li className="flex gap-2">
            <CheckIcon className="text-orange-500" />
            New Passport application & renewal
          </li>
          <li className="flex gap-2">
            <CheckIcon className="text-orange-500" />
            Tourist visa for all countries
          </li>
          <li className="flex gap-2">
            <CheckIcon className="text-orange-500" />
            Business & student visa support
          </li>
          <li className="flex gap-2">
            <CheckIcon className="text-orange-500" />
            Document verification & form filling
          </li>
          <li className="flex gap-2">
            <CheckIcon className="text-orange-500" />
            Appointment booking & tracking
          </li>
        </ul>

        <Link href="tel:+919330942690">
          <Button className="mt-6 w-fit">Get Free Consultation</Button>
        </Link>
      </div>

      {/* Right */}
      <div className="bg-white p-8 rounded-2xl shadow flex-1">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Required Documents Checklist
        </h3>

        <div className="space-y-6">
          {/* Passport */}
          <div>
            <h4 className="font-bold text-gray-700">For Passport:</h4>
            <ul className="list-disc ml-6 text-gray-600">
              <li>Proof of address</li>
              <li>Date of birth proof</li>
              <li>Identity proof</li>
              <li>Photographs (white background)</li>
            </ul>
          </div>

          {/* Visa */}
          <div>
            <h4 className="font-bold text-gray-700">For Visa:</h4>
            <ul className="list-disc ml-6 text-gray-600">
              <li>Valid passport</li>
              <li>Photographs (as per country specs)</li>
              <li>Travel itinerary</li>
              <li>Additional country-specific documents</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <div className="bg-white mx-5 rounded-3xl mt-12 p-10 shadow-sm">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        How It Works
      </h2>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 rounded-xl overflow-hidden border">
        {/* Step 1 */}
        <div className="flex items-center gap-4 p-8 bg-muted/40 border-r md:border-b-0 border-b">
          <div className="p-4 bg-orange-200 text-orange-600 rounded-2xl shadow-sm">
            <PhoneIcon />
          </div>
          <div>
            <h3 className="text-lg font-semibold">1. Contact Us</h3>
            <p className="text-gray-600 text-sm">
              Call or WhatsApp us with your booking requirements
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-4 p-8 bg-muted/30 border-r md:border-b-0 border-b">
          <div className="p-4 bg-orange-200 text-orange-600 rounded-2xl shadow-sm">
            <FileTextIcon />
          </div>
          <div>
            <h3 className="text-lg font-semibold">2. Share Details</h3>
            <p className="text-gray-600 text-sm">
              Provide necessary information and preferences
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-center gap-4 p-8 bg-muted/40">
          <div className="p-4 bg-orange-200 text-orange-600 rounded-2xl shadow-sm">
            <CheckCircleIcon />
          </div>
          <div>
            <h3 className="text-lg font-semibold">3. We Handle the Rest</h3>
            <p className="text-gray-600 text-sm">
              Sit back while we complete your booking securely
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LicMediclaim = () => {
  return (
    <div className="bg-white mx-5 py-10 my-10 rounded-2xl shadow-md px-6">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-3 text-center mb-8">
        <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
          <ShieldIcon className="size-8" />
        </div>

        <h3 className="text-2xl font-semibold text-gray-800">
          LIC & Mediclaim Advisory
        </h3>

        <p className="text-sm text-gray-600 max-w-lg">
          Secure your future with expert insurance guidance. We help you choose
          the right policy that fits your needs and budget.
        </p>
      </div>

      {/* Columns */}
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
        {/* LIC */}
        <div className="bg-orange-50 p-6 rounded-xl shadow-sm border">
          <h4 className="font-semibold text-orange-700 text-lg mb-3">
            Life Insurance (LIC)
          </h4>

          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex gap-2">
              <CheckIcon className="text-orange-500" /> Term Insurance plans
            </li>
            <li className="flex gap-2">
              <CheckIcon className="text-orange-500" /> Endowment policies
            </li>
            <li className="flex gap-2">
              <CheckIcon className="text-orange-500" /> Pension plans
            </li>
            <li className="flex gap-2">
              <CheckIcon className="text-orange-500" /> Child education plans
            </li>
          </ul>
        </div>

        {/* Mediclaim */}
        <div className="bg-orange-50 p-6 rounded-xl shadow-sm border">
          <h4 className="font-semibold text-orange-700 text-lg mb-3">
            Health Insurance (Mediclaim)
          </h4>

          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex gap-2">
              <CheckIcon className="text-orange-500" /> Individual health cover
            </li>
            <li className="flex gap-2">
              <CheckIcon className="text-orange-500" /> Family floater plans
            </li>
            <li className="flex gap-2">
              <CheckIcon className="text-orange-500" /> Senior citizen plans
            </li>
            <li className="flex gap-2">
              <CheckIcon className="text-orange-500" /> Critical illness cover
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 mb-4">
          *We are authorized advisors. Services are provided in association with
          certified insurance agents.
        </p>

        <Link href="tel:+919330942690">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg">
            Schedule Consultation
          </Button>
        </Link>
      </div>
    </div>
  );
};

const ContactUs = () => {
  return (
     <div className="bg-orange-600 mx-5 rounded-lg text-white py-12 px-6 my-10">
      {/* Heading */}
      <div className="text-center space-y-3">
        <h3 className="text-3xl md:text-4xl font-bold tracking-wide">
          Need Immediate Assistance?
        </h3>

        <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto">
        Our team is available to help you with any booking or advisory needs
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

      <div className="flex items-center justify-center text-sm mt-5">
        Available Mon-Sat 9AM - 8PM | Sunday 10AM - 6PM
      </div>
    </div>
  );
};
