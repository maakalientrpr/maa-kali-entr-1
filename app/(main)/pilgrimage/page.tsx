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
  ArrowRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CheckIcon,
  EarthIcon,
  LandPlotIcon,
  MailIcon,
  MapPinIcon,
  MountainIcon,
  PhoneCallIcon,
  PhoneIcon,
  PlaneIcon,
  StarIcon,
  SunriseIcon,
  TreesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaBullseye, FaBus, FaClock, FaPray, FaWhatsapp } from "react-icons/fa";
import IndiaCircuitsMap from "@/components/IndiaMap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

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
    <div className="bg-orange-50/50">
      <AnnouncementBar />
      {/* Hero Section */}
      <HeroSection />

      {/* Header Section */}
      <div className="mt-12 text-center flex flex-col gap-3 mb-10 px-4">
        <h2 className="text-orange-500 font-bold text-4xl md:text-5xl tracking-tight">
          Sacred Pilgrimages
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto text-lg leading-relaxed">
          Embark on a spiritual journey to the holiest destinations. Experience
          divinity, peace, and tradition with our guided pilgrimage tours.
        </p>
      </div>

      {/* Grid Section */}
      <PilgrimageGrid pilgrimages={pilgrimages} />
      <FeaturedPilgrimage />
      <Region />
      <IndiaCircuitsMap />
      <WhyChooseUs />
      <ContactUs />
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
      icon: <PlaneIcon />,
      title: "International Pilgrimage Packages",
      color: "from-blue-600 to-purple-600",
      packages: [
        {
          title: "Pashupatinath (Nepal)",
          desc: "Sacred Shiva temple in Kathmandu",
        },
        { title: "Muktinath (Nepal)", desc: "High altitude temple at 3,800m" },
        {
          title: "BAPS Hindu Mandir (Abu Dhabi)",
          desc: "A magnificent stone-carved traditional Hindu temple and a symbol of peace in the UAE.",
        },
        {
          title: "Cambodia – Angkor Wat",
          desc: "World’s largest temple complex, a sacred masterpiece of ancient Khmer architecture.",
        },
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

const HeroSection = () => {
  return (
    <div className="relative w-full h-[75vh]  overflow-hidden flex items-center justify-center">
      {/* 1. Background Image with Parallax Feel */}
      <div className="absolute inset-0 select-none">
        <Image
          src="/puri-image.jpg"
          alt="Jagannath Puri Temple"
          fill
          className="object-cover scale-105 animate-slow-zoom" // Optional: Add a slow zoom animation in your CSS
          priority
        />
      </div>

      {/* 2. Advanced Overlay: Darkens bottom for text readability, keeps top airy */}
      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/50 to-black/90" />

      {/* 3. Hero Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center gap-6 mt-10">
        {/* Glass Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="text-orange-50 text-xs md:text-sm font-semibold tracking-wider uppercase">
            Divinity Awaits You
          </span>
        </div>

        {/* Main Title with Gradient Text */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white drop-shadow-2xl animate-in fade-in zoom-in duration-1000">
          Pilgrimage <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-yellow-200 to-orange-200">
            Tours
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl text-gray-200 font-light max-w-2xl leading-relaxed drop-shadow-md animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          Embark on sacred journeys across India & Nepal.
          <span className="block md:inline text-orange-100 font-medium">
            {" "}
            Curated with devotion by Maa Kali Enterprise.
          </span>
        </p>
      </div>

      {/* 4. The Wave Separator (Matches bg-orange-50 of next section) */}
      <div className="absolute -bottom-px left-0 w-full">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-20"
          preserveAspectRatio="none"
        >
          <path
            fill="#f5f5f5"
            d="M0,64L60,74.7C120,85,240,107,360,96C480,85,600,43,720,58.7C840,75,960,149,1080,170.7C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaPray className="w-8 h-8" />,
      title: "Experienced Pandits",
      desc: "Knowledgeable guides for authentic rituals and puja.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: <FaBus className="w-8 h-8" />,
      title: "Comfortable Travel",
      desc: "Premium AC vehicles & quality accommodation.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <FaClock className="w-8 h-8" />,
      title: "Perfect Timing",
      desc: "Visits planned during the most auspicious muhurats.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <FaBullseye className="w-8 h-8" />,
      title: "Complete Arrangement",
      desc: "We handle Darshan, Prasad, and all formalities.",
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <section className="py-16 bg-linear-to-b from-orange-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-orange-600 uppercase">
            Our Promise
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose Us For Your{" "}
            <span className="text-orange-500">Spiritual Journey?</span>
          </h3>
          <div className="w-24 h-1 bg-orange-400 mx-auto rounded-full" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="border border-orange-500 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white group"
            >
              <CardHeader className="text-center pt-8 pb-4 items-center">
                <div className="flex items-center justify-center">
                  <div
                    className={`p-4 rounded-full mb-4 transition-colors duration-300 ${feature.color} group-hover:scale-110 w-fit transform`}
                  >
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-gray-500 text-base leading-relaxed">
                  {feature.desc}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactUs = () => {
  return (
    <div className="bg-orange-600 mx-5 rounded-lg text-white py-12 px-6 my-10">
      {/* Heading */}
      <div className="text-center space-y-3">
        <h3 className="text-3xl md:text-4xl font-bold tracking-wide">
          Plan Your Yatra With Us
        </h3>

        <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto">
          Embark on a sacred journey with complete peace of mind. we handle all
          arrangements while you focus on your spiritual experience.
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

const FeaturedPilgrimage = () => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 grid grid-cols-1 lg:grid-cols-2">
          {/* --- LEFT: IMAGE SECTION --- */}
          <div className="relative h-72 lg:h-full min-h-[400px] group">
            <Image
              src="/kailash.jpg" // Ensure you have a high-res image here
              alt="Kailash Mansarovar"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />

            {/* Floating Badge */}
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
              <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Most Popular
              </span>
            </div>
          </div>

          {/* --- RIGHT: CONTENT SECTION --- */}
          <div className="p-8 lg:p-10 flex flex-col justify-center">
            {/* Header */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-sm tracking-wide uppercase">
                <span className="w-8 h-0.5 bg-orange-600 rounded-full" />
                The Ultimate Journey
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                Kailash Mansarovar Yatra
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Journey to the abode of Lord Shiva. A once-in-a-lifetime
                expedition through the mystical landscapes of Tibet and the
                Himalayas.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <FeatureItem
                icon={<MountainIcon className="w-5 h-5 text-blue-600" />}
                title="5,600m Altitude"
                desc="High altitude trek"
              />
              <FeatureItem
                icon={<MapPinIcon className="w-5 h-5 text-red-500" />}
                title="Sacred Parikrama"
                desc="52km Circumambulation"
              />
              <FeatureItem
                icon={<CheckCircle2Icon className="w-5 h-5 text-green-600" />}
                title="Expert Support"
                desc="Sherpas & Medical Aid"
              />
              <FeatureItem
                icon={<CheckCircle2Icon className="w-5 h-5 text-green-600" />}
                title="All Inclusive"
                desc="Meals, Visa & Permits"
              />
            </div>

            {/* Info Strip */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mb-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 font-medium">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-orange-600" />
                  <span>10-14 Days</span>
                </div>
                <div className="w-1.5 h-1.5 bg-orange-300 rounded-full hidden sm:block" />
                <span>Best Season: May - September</span>
                <div className="w-1.5 h-1.5 bg-orange-300 rounded-full hidden sm:block" />
                <span>Route: Via Nepal / Tibet</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="tel:+919330942690" className="flex-1">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 rounded-xl text-base shadow-lg transition-transform hover:-translate-y-0.5">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  Call to Enquire
                </Button>
              </Link>

              <Link
                href="https://wa.me/919330942690"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white h-12 rounded-xl text-base shadow-lg transition-transform hover:-translate-y-0.5">
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper Component for the Grid
const FeatureItem = ({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-colors">
    <div className="mt-0.5 bg-white p-1.5 rounded-lg shadow-sm">{icon}</div>
    <div>
      <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  </div>
);
