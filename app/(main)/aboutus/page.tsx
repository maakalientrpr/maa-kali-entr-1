import AnnouncementBar from "@/components/AnnouncementBar";
import IndiaCircuitsMap from "@/components/IndiaMap";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AwardIcon,
  BookmarkIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  CompassIcon,
  EyeIcon,
  GlobeIcon,
  HeartIcon,
  MapIcon,
  MapPin,
  MapPinIcon,
  MountainIcon,
  PalmtreeIcon,
  PhoneIcon,
  SunIcon,
  TargetIcon,
  UsersIcon,
  UtensilsIcon,
  WavesIcon,
} from "lucide-react";
import Image from "next/image";

const Page = () => {
  const stats = [
    {
      icon: <UsersIcon className="text-orange-600 size-10" />,
      value: "500+",
      label: "Happy Travelers",
    },
    {
      icon: <MapPinIcon className="text-orange-600 size-10" />,
      value: "100+",
      label: "Destinations",
    },
    {
      icon: <BookmarkIcon className="text-orange-600 size-10" />,
      value: "50+",
      label: "Events Organised",
    },
    {
      icon: <HeartIcon className="text-orange-600 size-10" />,
      value: "12 Years",
      label: "Experience",
    },
  ];

  return (
    <div className=" bg-muted min-h-screen">
      <AnnouncementBar />
      {/* Heading */}
      <div className="mt-12 text-center flex flex-col gap-2 mb-12 px-4">
        <h1 className="text-orange-500 font-bold text-3xl md:text-4xl">
          About Maa Kali Enterprise
        </h1>
        <p className="text-gray-700 max-w-xl mx-auto">
          Your trusted partner for tours, events, and memorable experiences
          since 2019
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-5">
        {stats.map((item) => (
          <Card
            key={item.label}
            className="p-6 hover:shadow-md transition-all rounded-xl flex flex-col items-center justify-center text-center bg-white"
          >
            <div className="p-4 bg-orange-100 rounded-2xl mb-3">
              {item.icon}
            </div>

            <p className="text-3xl font-bold text-gray-800">{item.value}</p>
            <p className="text-gray-600 text-sm mt-1">{item.label}</p>
          </Card>
        ))}
      </div>

      {/* Our story */}
      <OurStory />

      {/* Card */}
      <Cards />

      <OurFounder />

      <Map />

      <OurCoverage />

      {/* Our values */}
      <OurValues />

      {/* what we offer */}
      <OurOffer />

      {/* what choose us */}
      <WhyChooseUs />
    </div>
  );
};

export default Page;

const OurStory = () => {
  return (
    <div className="bg-white m-5 px-5 py-5 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold text-orange-500 mb-3">Our Story</h2>

        <p className="mb-3">
          Founded by
          <span className="text-orange-500 font-semibold">
            {" "}
            Krishna Jaiswal
          </span>{" "}
          and
          <span className="text-orange-500 font-semibold">
            {" "}
            Shweta Jaiswal
          </span>{" "}
          in 2019, Maa Kali Enterprise began with a simple vision — to make
          travel accessible, events memorable, and every occasion special!
        </p>

        <p className="mb-3">
          What started as a small tour operation has grown into a comprehensive
          service provider offering tours & travel, event management, premium
          catering, and travel assistance services. Our dedication to quality
          and customer satisfaction has helped us build a loyal community of
          travelers and clients.
        </p>

        <p className="mb-3">
          Based in Kolkata, we serve clients across India and help them explore
          both domestic and international destinations. Every tour we organize
          and every event we manage carries our commitment to excellence and
          attention to detail.
        </p>
      </div>

      <div className="m-5 rounded-lg shadow overflow-hidden">
        <Image
          src={
            "data:image/jpeg;base64,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"
          }
          alt="Our Story Image"
          className="w-full h-full object-cover"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
};

const Cards = () => {
  return (
    <div className="my-10 mx-5 grid sm:grid-cols-2 grid-cols-1 gap-4">
      {/* Mission */}
      <div className="bg-orange-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-3 rounded-full">
            <TargetIcon className="text-white size-6" />
          </div>
          <h4 className="text-xl font-semibold">Our Mission</h4>
        </div>

        <p className="text-white/90 leading-relaxed">
          To provide exceptional travel and event experiences that create
          lasting memories while maintaining the highest standards of service,
          safety, and customer satisfaction. We strive to make every journey
          comfortable and every event successful.
        </p>
      </div>

      {/* Vision */}
      <div className="bg-linear-to-br from-purple-600 to-pink-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-3 rounded-full">
            <EyeIcon className="text-white size-6" />
          </div>
          <h4 className="text-xl font-semibold">Our Vision</h4>
        </div>

        <p className="text-white/90 leading-relaxed">
          To become the most trusted and preferred tours & events company in
          Eastern India, known for innovation, reliability, and personalized
          service. We aim to expand our services while maintaining the personal
          touch that sets us apart.
        </p>
      </div>
    </div>
  );
};

const OurFounder = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-white max-w-7xl mx-auto space-y-20">
      {/* --- SECTION 1: FOUNDERS --- */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full text-orange-600 mb-2">
            <UsersIcon className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Meet Our Founders
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            With their dedication and experience, Maa Kali Enterprise has become
            a symbol of trust and excellence in the travel industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Founder 1 */}
          <Card className="text-center overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-0 pt-8">
              <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-50 group-hover:border-orange-100 transition-colors">
                <Image
                  src="/members/Krishana.jpg" // Replace with actual image
                  fill
                  className="object-cover"
                  alt="Krishna Kumar Jaiswal"
                />
              </div>
            </CardHeader>
            <CardContent className="pb-8 space-y-1">
              <CardTitle className="text-xl font-bold text-slate-900">
                Krishna Kumar Jaiswal
              </CardTitle>
              <p className="text-orange-600 font-medium">
                Co-founder & Tour Director
              </p>
            </CardContent>
          </Card>

          {/* Founder 2 */}
          <Card className="text-center overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-0 pt-8">
              <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-50 group-hover:border-orange-100 transition-colors">
                <Image
                  src="/members/Shweta.jpg" // Replace with actual image
                  fill
                  className="object-cover"
                  alt="Shweta Jaiswal"
                />
              </div>
            </CardHeader>
            <CardContent className="pb-8 space-y-1">
              <CardTitle className="text-xl font-bold text-slate-900">
                Shweta Jaiswal
              </CardTitle>
              <p className="text-orange-600 font-medium">
                Co-founder & Tour Director
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- SECTION 2: EVENT & CATERING (Featured Block) --- */}
      <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: Team Cards */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <CalendarIcon className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-slate-900">
                Event & Catering Management
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="bg-white border-slate-200 hover:border-orange-200 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden bg-slate-100">
                    <Image
                      src="/members/Swastik.jpg"
                      alt="Shwastik Jaiswal"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-lg text-slate-900">
                    Shwastik Jaiswal
                  </h4>
                  <span className="text-sm text-slate-500 mt-1">
                    Event Planner & Ops
                  </span>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 hover:border-orange-200 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden bg-slate-100">
                    <Image
                      src="/members/Palak.jpg"
                      alt="Palak Jaiswal"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-lg text-slate-900">
                    Palak Jaiswal
                  </h4>
                  <span className="text-sm text-slate-500 mt-1">
                    Creative Head
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right: What They Manage */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <UtensilsIcon className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-bold text-slate-800">
                Services They Manage
              </h4>
            </div>

            <ul className="grid sm:grid-cols-2 gap-4">
              {[
                "Wedding Catering",
                "Social Gatherings",
                "Reception Events",
                "Anniversaries",
                "Stage Setup & Decor",
                "Lighting",
                "Corporate Events",
                "Customized Menus",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-100 shadow-sm"
                >
                  <CheckIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium text-sm">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* --- SECTION 3: STATE COORDINATORS --- */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900 inline-flex items-center gap-2">
            <MapPinIcon className="w-6 h-6 text-orange-600" />
            Our State Coordinators
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Coordinator 1 */}
          <Card className="flex flex-row items-center p-2 hover:shadow-md transition-shadow border-slate-200">
            <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100">
              <Image
                src="/members/Ashwini.jpg"
                alt="Ashwini"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900 text-lg leading-tight">
                  Ashwini Sonawane Kulaye
                </h4>
              </div>
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-700 hover:bg-orange-100"
              >
                Mumbai (Maharashtra)
              </Badge>
              {/* <div className="flex items-center gap-2 text-sm text-slate-600 pt-1">
                <PhoneIcon className="w-4 h-4" />
                <span>+91 8082101910</span>
              </div> */}
            </div>
          </Card>

          {/* Coordinator 2 */}
          <Card className="flex flex-row items-center p-2 hover:shadow-md transition-shadow border-slate-200">
            <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100">
              <Image
                src="/members/Manager-new.jpg"
                alt="Amit Jaiswal"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900 text-lg leading-tight">
                  Amit Jaiswal
                </h4>
              </div>
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-700 hover:bg-orange-100"
              >
                Uttar Pradesh
              </Badge>
              {/* <div className="flex items-center gap-2 text-sm text-slate-600 pt-1">
                <PhoneIcon className="w-4 h-4" />
                <span>+91 9214078757</span>
              </div> */}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

const Map = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* --- SECTION HEADER --- */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 text-orange-600 rounded-full shadow-sm mb-2">
            <BuildingIcon className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
            Kolkata Branch Offices
          </h3>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Both offices are fully equipped for customer support, bookings,
            meetings, and walk-in consultations.
          </p>
        </div>

        {/* --- CARDS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* BRANCH 1 */}
          <Card className="overflow-hidden p-0 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="bg-slate-50 border-b pt-4 border-slate-100 pb-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-white rounded-lg border border-slate-200 text-orange-600 shadow-sm group-hover:text-orange-700 group-hover:border-orange-200 transition-colors">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Branch Office 1
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    88A/1 Bechu Chatterjee Street
                    <br />
                    Kolkata - 700009, West Bengal
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Map Container - Aspect Ratio Video ensures responsiveness */}
            <div className="relative w-full aspect-video bg-gray-100">
              <iframe
                src="https://maps.google.com/maps?q=Kolkata&t=&z=13&ie=UTF8&iwloc=&output=embed" // Placeholder usable map link
                className="absolute inset-0 w-full h-full border-0 filter   transition-all duration-500"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </Card>

          {/* BRANCH 2 */}
          <Card className="overflow-hidden p-0 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="bg-slate-50 pt-4 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-white rounded-lg border border-slate-200 text-orange-600 shadow-sm group-hover:text-orange-700 group-hover:border-orange-200 transition-colors">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Branch Office 2
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    4/A Heaven Plaza , Anandalok , Kali Park <br />
                    Kolkata - 700157, West Bengal
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Map Container */}
            <div className="relative w-full aspect-video bg-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6125.996540760841!2d88.43138746760107!3d22.62071299268433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89e2c4bfe9b67%3A0x3f936e1df4d30cc1!2sHeaven%20Plaza%20Complex!5e0!3m2!1sen!2sin!4v1764510912727!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0 filter  transition-all duration-500"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

const OurCoverage = () => {
  const regions = [
    {
      title: "North India",
      desc: "Kashmir, Himachal, Uttarakhand, Delhi, Punjab",
      icon: <MountainIcon className="w-6 h-6 text-blue-200" />,
    },
    {
      title: "South India",
      desc: "Kerala, Kanyakumari, Rameswaram, Tirupati, Karnataka",
      icon: <SunIcon className="w-6 h-6 text-yellow-200" />,
    },
    {
      title: "East India",
      desc: "Sikkim, Assam, Meghalaya, Odisha, Bengal",
      icon: <CompassIcon className="w-6 h-6 text-orange-200" />,
    },
    {
      title: "West India",
      desc: "Rajasthan, Gujarat, Maharashtra, Goa",
      icon: <WavesIcon className="w-6 h-6 text-cyan-200" />,
    },
    {
      title: "Islands",
      desc: "Andaman & Nicobar, Lakshadweep",
      icon: <PalmtreeIcon className="w-6 h-6 text-green-200" />,
    },
    {
      title: "International",
      desc: "Nepal, Bhutan, Dubai, Thailand",
      icon: <GlobeIcon className="w-6 h-6 text-purple-200" />,
    },
  ];

  return (
    <section className="relative py-20 px-4 overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 text-white max-w-[80vw] rounded-lg shadow-2xl mx-auto">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        {/* --- HEADER --- */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium tracking-wide">
            <MapIcon className="w-4 h-4" /> Pan-India Network
          </div>

          <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            We Cover All Of India
          </h3>

          <div className="flex items-center justify-center gap-3 text-blue-100 font-medium tracking-wider text-sm md:text-base uppercase opacity-80">
            <span>North</span> • <span>South</span> • <span>East</span> •{" "}
            <span>West</span>
          </div>

          <p className="max-w-2xl mx-auto text-lg text-blue-50/90 leading-relaxed">
            Maa Kali Enterprise provides comprehensive travel packages to every
            corner of India and select international destinations.
          </p>
        </div>

        {/* --- GRID CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region, idx) => (
            <Card
              key={idx}
              className="bg-white/10 border-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-3 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                  {region.icon}
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  {region.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100/80 leading-relaxed">
                  {region.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- MAP PLACEHOLDER SECTION --- */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="p-4 bg-white/20 rounded-full mb-2">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-2xl md:text-3xl font-bold text-white">
              Explore Our Destination Map
            </h4>
            <p className="text-blue-100 mb-6 max-w-lg">
              Visualize your next journey. View our complete coverage network on
              the interactive map.
            </p>
            <IndiaCircuitsMap />
          </div>
        </div>
      </div>
    </section>
  );
};

const OurValues = () => {
  const stats = [
    {
      icon: <HeartIcon className="text-orange-600 size-10" />,
      value: "Customer First",
      label:
        "Your satisfaction and comfort are our top priorities in every service we provide.",
    },
    {
      icon: <AwardIcon className="text-orange-600 size-10" />,
      value: "Quality Service",
      label:
        "We maintain the highest standards in tour planning, event management, and catering.",
    },
    {
      icon: <TargetIcon className="text-orange-600 size-10" />,
      value: "Transparency",
      label:
        "Clear pricing, no hidden charges, and honest communication at every step.",
    },
    {
      icon: <EyeIcon className="text-orange-600 size-10" />,
      value: "Attention to Detail",
      label:
        "We carefully plan every aspect to ensure memorable experiences for our clients.",
    },
  ];

  return (
    <div className="my-12 mx-5">
      {/* Section Title */}
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Our Core Values
      </h3>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <Card
            key={item.value}
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all border border-transparent hover:border-orange-300"
          >
            {/* Icon Box */}
            <div className="mx-auto p-4 bg-orange-100 rounded-2xl w-fit mb-4 shadow-sm">
              {item.icon}
            </div>

            {/* Title */}
            <p className="text-lg font-bold text-gray-800 text-center">
              {item.value}
            </p>

            {/* Description */}
            <p className="text-gray-600 text-sm text-center mt-2 leading-relaxed">
              {item.label}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

const OurOffer = () => {
  const stats = [
    {
      icon: <MapPinIcon className="text-orange-600 size-10" />,
      value: "Tours & Travel",
      points: [
        "Domestic & International Tours",
        "Customized Itineraries",
        "Group & Family Packages",
        "Pilgrimage Tours",
        "Adventure & Leisure Trips",
      ],
    },
    {
      icon: <HeartIcon className="text-orange-600 size-10" />,
      value: "Events & Catering",
      points: [
        "Destination Weddings",
        "Corporate Events",
        "Birthday Parties",
        "House Inaugurations",
        "Premium Catering Services",
      ],
    },
    {
      icon: <AwardIcon className="text-orange-600 size-10" />,
      value: "Additional Services",
      points: [
        "Flight & Train Bookings",
        "Visa & Passport Assistance",
        "LIC & Mediclaim Advisory",
        "Hotel Reservation",
        "24/7 Customer Support",
      ],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow my-10 mx-5 p-5">
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
        What We Offer
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item) => (
          <Card
            key={item.value}
            className="p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <CardContent className="flex flex-col items-center text-center">
              <div className="p-4 bg-orange-100 rounded-2xl mb-3">
                {item.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                {item.value}
              </h4>

              <ul className="space-y-2 text-gray-700 text-sm">
                {item.points.map((p, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircleIcon className="size-4 text-orange-600" /> {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const WhyChooseUs = () => {
  const points = [
    {
      title: "Experienced Team",
      desc: "5+ years of expertise in travel and event management.",
    },
    {
      title: "Personalized Service",
      desc: "Customized packages tailored to your preferences.",
    },
    {
      title: "Safety First",
      desc: "Verified vendors and strict safety protocols.",
    },
    {
      title: "Affordable Pricing",
      desc: "Competitive rates without compromising on quality.",
    },
    {
      title: "Reliable Support",
      desc: "24/7 assistance throughout your journey.",
    },
    {
      title: "Happy Clients",
      desc: "500+ satisfied customers and counting.",
    },
  ];

  return (
    <div className="bg-[#fdf5ef] my-10 mx-5 py-12 px-6 rounded-xl shadow-sm">
      <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Why Choose <span className="text-orange-600">Maa Kali Enterprise?</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {points.map((item) => (
          <div
            key={item.title}
            className="flex gap-3 bg-white rounded-xl p-5 shadow hover:shadow-md transition-all"
          >
            <div className="bg-orange-100 h-12 w-12 flex items-center justify-center rounded-full">
              <CheckIcon className="text-orange-600" />
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 text-lg">
                {item.title}
              </h4>
              <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
