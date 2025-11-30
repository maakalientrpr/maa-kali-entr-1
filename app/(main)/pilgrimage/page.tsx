import AnnouncementBar from "@/components/AnnouncementBar";
import prisma from "@/lib/db";
import PilgrimageGrid from "@/components/pilgrimages/pilgrimage-grid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  EarthIcon,
  LandPlotIcon,
  MountainIcon,
  PhoneCallIcon,
  SparklesIcon,
  SunriseIcon,
  TreesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import IndiaCircuitsMap from "@/components/IndiaMap";

export const dynamic = "force-dynamic"; // Ensures fresh data if needed

const PilgrimagePage = async () => {
  // 1. Fetch Data
  const pilgrimages = await prisma.pilgrimage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // 2. Handle Empty State
  if (!pilgrimages || pilgrimages.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <div className="flex-1 flex flex-col gap-4 items-center justify-center text-center p-4">
          <h1 className="text-2xl font-bold text-gray-400">Pilgrimages</h1>
          <p className="text-gray-500">
            No pilgrimage packages are currently listed. Please check back
            later.
          </p>
        </div>
      </div>
    );
  }

  // 3. Render Page
  return (
    <div>
      <AnnouncementBar />

      {/* Header Section */}
      <div className="mt-12 text-center flex flex-col gap-3 mb-10 px-4">
        <h1 className="text-orange-500 font-bold text-4xl md:text-5xl tracking-tight">
          Sacred Pilgrimages
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto text-lg leading-relaxed">
          Embark on a spiritual journey to the holiest destinations. Experience
          divinity, peace, and tradition with our guided pilgrimage tours.
        </p>
      </div>

      {/* Grid Section */}
      <PilgrimageGrid pilgrimages={pilgrimages} />
      <Region />
      <IndiaCircuitsMap />
    </div>
  );
};

export default PilgrimagePage;

const Region = () => {
  const REGIONS = [
    {
      id: "north",
      title: "North India Pilgrimage",
      icon: <LandPlotIcon />,
      color: "from-blue-600 to-blue-400",
      packages: [
        {
          title: "Chaar Dham Yatra",
          desc: "Yamunotri · Gangotri · Kedarnath · Badrinath",
        },
        {
          title: "Do Dham Yatra",
          desc: "Kedarnath & Badrinath divine journey",
        },
        {
          title: "Vaishno Devi",
          desc: "Sacred cave shrine in Trikuta mountains",
        },
        { title: "Golden Temple", desc: "Harmandir Sahib - Amritsar" },
      ],
    },
    {
      id: "east",
      title: "East India Pilgrimage",
      icon: <SunriseIcon />,
      color: "from-orange-700 to-orange-500",
      packages: [
        { title: "Jagannath Puri", desc: "Famous Rath Yatra & Char Dham" },
        { title: "Konark Sun Temple", desc: "UNESCO World Heritage Site" },
        { title: "Kamakhya Temple", desc: "One of the 51 Shakti Peethas" },
      ],
    },
    {
      id: "south",
      title: "South India Pilgrimage",
      icon: <TreesIcon />,
      color: "from-green-700 to-green-500",
      packages: [
        { title: "Rameshwaram Temple", desc: "One of the 12 Jyotirlingas" },
        { title: "Tirupati Balaji", desc: "Richest Hindu Temple" },
        { title: "Meenakshi Temple", desc: "Madurai – Dravidian architecture" },
      ],
    },
    {
      id: "west",
      title: "West India Pilgrimage",
      icon: <MountainIcon />,
      color: "from-yellow-600 to-yellow-300",
      packages: [
        { title: "Shirdi", desc: "Sai Baba Samadhi Temple" },
        { title: "Dwarkadish", desc: "Krishna's ancient kingdom" },
        { title: "Bet Dwarka", desc: "Krishna's original residence island" },
        { title: "Somnath", desc: "First of 12 Jyotirlingas" },
        { title: "Khatu Shyam", desc: "Barbarika Temple - Rajasthan" },
      ],
    },
    {
      id: "special",
      icon: <EarthIcon />,
      title: "Special Pilgrimage Packages",
      color: "from-purple-500 to-pink-600",
      packages: [
        {
          title: "12 Jyotirlinga Yatra",
          desc: "Complete tour of all Shiva Jyotirlingas",
        },
        {
          title: "Panch Kedar",
          desc: "Five sacred Shiva temples in Himalayas",
        },
        { title: "Panch Badri", desc: "Five forms of Lord Vishnu" },
        { title: "3 Shakti Peeth", desc: "Kamakhya . Tarapith . Kalighat" },
        {
          title: "Ganga Sagar",
          desc: "Holy confluence of Ganga & Bay of Bengal",
        },
      ],
    },
    {
      id: "international",
      icon: <SparklesIcon className="text-yellow-500 text-2xl" />,
      title: "International Pilgrimage Packages",
      color: "from-blue-600 to-purple-600",
      packages: [
        {
          title: "Pashupatinath (Nepal)",
          desc: "Sacred Shiva temple in Kathmandu",
        },
        { title: "Muktinath (Nepal)", desc: "High altitude temple at 3,800m" },
      ],
    },
  ];

  return (
    <section className="my-16 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-orange-600 mb-4">
        Pilgrimage Tours by Region
      </h2>

      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
        Discover spiritual journeys across India, organized region-wise for
        convenience.
      </p>

      <Accordion type="single" collapsible className="space-y-4">
        {REGIONS.map((region) => (
          <AccordionItem
            key={region.id}
            value={region.id}
            className="backdrop-blur-xl bg-white/80 border rounded-2xl  shadow-sm hover:shadow-md transition"
          >
            {/* Header */}
            <AccordionTrigger
              className={`
              text-xl font-semibold 
              py-4 
              text-white 
              rounded-xl 
              bg-linear-to-r ${region.color}
              w-full 
              hover:no-underline
             `}
            >
              <div className="flex gap-2 items-center justify-center">
                {region.icon}
                {region.title}
              </div>
            </AccordionTrigger>

            {/* Content */}
            <AccordionContent className="pb-6">
              <div className="space-y-4 mt-3 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
                {region.packages.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border hover:border-orange-500  hover:shadow-2xl"
                  >
                    <div className="bg-orange-100 p-2 rounded-full">
                      <SparklesIcon className="h-4 w-4 text-orange-600" />
                    </div>

                    <div>
                      <p className="font-medium text-gray-800">{p.title}</p>
                      <p className="text-sm text-gray-600">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-center w-full mx-auto pt-4 gap-4">
                <Button>
                  <PhoneCallIcon /> Enquire Now
                </Button>
                <Button className="bg-green-500 hover:bg-green-600">
                  <FaWhatsapp />
                  Whatsapp Enquiry
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};