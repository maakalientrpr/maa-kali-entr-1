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
  UserIcon,
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
      value: "12+ Years",
      label: "Experience",
    },
  ];

  return (
    <div className=" bg-muted min-h-screen">
      {/* Heading */}
      <div className="mt-12 text-center flex flex-col gap-2 mb-12 px-4">
        <h1 className="text-orange-500 font-bold text-3xl md:text-4xl">
          About Maa Kali Enterprise
        </h1>
        <p className="text-gray-700 max-w-xl mx-auto">
          Your trusted partner for tours, events, and memorable experiences
          since 2013
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
          Maa Kali Enterprise, built in 2013, began as a small tour operation
          with a simple mission — to make every journey comfortable, memorable,
          and stress-free. Over the years, we have grown into a comprehensive
          service provider offering tours & travel, event management, and
          premium catering. Our dedication to quality and customer satisfaction
          has helped us build a loyal community of travellers across India.
        </p>

        <p className="mb-3">
          We welcome travellers of all generations, and a large part of our
          cherished audience also includes elders and happily-settled couples
          who now have the freedom to explore. For them, we ensure care-free
          darshan experiences with complete safety & comfort.
        </p>

        <p className="mb-3">
          Our tours also bring people together. Travellers bond, enjoy a
          friendly and supportive environment, share stories, and often return
          home with new friendships. Every journey feels like travelling with a
          family.
        </p>
        <p>
          Based in Kolkata, we organize both domestic and international tours.
          Every itinerary we design reflects our commitment to comfort, trust,
          and attention to detail — helping every guest travel with peace, joy,
          and confidence.
        </p>
      </div>

      <div className="m-5 rounded-lg shadow overflow-hidden">
        <Image
          src={"/Aboutus.jpeg"}
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
              <div className="flex items-center gap-2 text-sm text-slate-600 pt-1">
                <PhoneIcon className="w-4 h-4" />
                <span>+91 8082101910</span>
              </div>
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
              <div className="flex items-center gap-2 text-sm text-slate-600 pt-1">
                <PhoneIcon className="w-4 h-4" />
                <span>+91 9214078757</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* --- SECTION 4: MANAGER --- */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900 inline-flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-orange-600" />{" "}
            {/* Changed icon to User for semantic correctness */}
            Manager
          </h3>
        </div>

        <div className="grid gap-6 max-w-xl mx-auto">
          {" "}
          {/* Centered max-width for single card */}
          {/* Manager Card */}
          <Card className="flex flex-row items-center p-2 hover:shadow-md transition-shadow border-slate-200">
            <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100">
              <Image
                src="/members/Manager.jpg"
                alt="Mithlesh Kumar Raut"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 flex-1 space-y-1">
              <h4 className="font-bold text-slate-900 text-lg leading-tight">
                Mithlesh Kumar Raut
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                Operations Manager
              </p>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.960008677712!2d88.36640039999995!3d22.580598999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02764c6b5c58b5%3A0x96c375149ee985d4!2s88a%2C%201%2C%20Bechu%20Chatterjee%20St%2C%20Machuabazar%2C%20Kolkata%2C%20West%20Bengal%20700009!5e0!3m2!1sen!2sin!4v1764656777280!5m2!1sen!2sin"
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
      desc: "Nepal, Bhutan, Dubai, Thailand, Bangkok, Bali, Vietnam, Europe, Australia & more",
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
