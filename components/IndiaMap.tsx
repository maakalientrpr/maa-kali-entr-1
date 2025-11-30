"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  MapPin,
  Mountain,
  Compass,
  Waves,
  Sunrise,
  Landmark,
  MapPinIcon,
  Users,
  Calendar,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// --- Configuration ---
const REGIONS = {
  north: {
    id: "north",
    title: "North India",
    top: "15%",
    left: "29%",
    color: "bg-blue-500",
    ring: "ring-blue-400",
    icon: <Mountain className="w-5 h-5 text-blue-600" />,
    desc: "The Crown: Himalayas & Holy Rivers",
    places: ["Kedarnath", "Badrinath", "Vaishno Devi", "Amritsar", "Haridwar"]
  },
  west: {
    id: "west",
    title: "West India",
    top: "45%",
    left: "15%",
    color: "bg-yellow-500",
    ring: "ring-yellow-400",
    icon: <Compass className="w-5 h-5 text-yellow-600" />,
    desc: "Land of Dwarka, Somnath & Sai Baba",
    places: ["Somnath", "Dwarkadish", "Shirdi", "Nageshwar", "Pushkar"]
  },
  central: {
    id: "central",
    title: "Central India",
    top: "45%",
    left: "40%",
    color: "bg-purple-500",
    ring: "ring-purple-400",
    icon: <Landmark className="w-5 h-5 text-purple-600" />,
    desc: "Spiritual Heart: Jyotirlingas & History",
    places: ["Mahakaleshwar", "Omkareshwar", "Khajuraho", "Chitrakoot", "Ujjain"]
  },
  east: {
    id: "east",
    title: "East India",
    top: "42%",
    left: "70%",
    color: "bg-orange-500",
    ring: "ring-orange-400",
    icon: <Sunrise className="w-5 h-5 text-orange-600" />,
    desc: "Shakti Peethas & Jagannath Culture",
    places: ["Jagannath Puri", "Kamakhya Devi", "Ganga Sagar", "Baidyanath"]
  },
  south: {
    id: "south",
    title: "South India",
    top: "75%",
    left: "35%",
    color: "bg-green-500",
    ring: "ring-green-400",
    icon: <Waves className="w-5 h-5 text-green-600" />,
    desc: "Dravidian Temples & Coastal Divinity",
    places: ["Rameshwaram", "Tirupati", "Meenakshi", "Kanyakumari", "Sabarimala"]
  }
};

const IndiaCircuitsMap = () => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-orange-50/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-2">
            <MapPinIcon className="w-4 h-4" /> Pan-India Network
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Pilgrimage Circuits of <span className="text-orange-600">India</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore our extensive network covering the holiest destinations across the subcontinent.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* --- LEFT: THE MAP --- */}
          <div className="lg:col-span-7 relative">
            <div className="relative w-full max-w-[500px] mx-auto p-4 bg-white rounded-[2rem] shadow-2xl border border-gray-100">
              {/* Map Container */}
              <div 
                ref={containerRef}
                className="relative w-full aspect-[3/3.6] select-none"
                onMouseMove={handleMouseMove}
              >
                {/* 1. The Image */}
                <Image 
                  src="/india-map.png"
                  alt="Map of India"
                  fill
                  className="object-contain"
                  priority
                />

                {/* 2. Interactive Hotspots */}
                {Object.values(REGIONS).map((region) => (
                  <div
                    key={region.id}
                    className="absolute group cursor-pointer z-10"
                    style={{ top: region.top, left: region.left }}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    {/* Pulsing Ring */}
                    <span className={`absolute -inset-3 rounded-full opacity-40 animate-ping ${region.color}`} />
                    <span className={`absolute -inset-1 rounded-full opacity-20 ${region.color} blur-sm`} />
                    
                    {/* The Pin Icon */}
                    <div className={`relative p-2 rounded-full shadow-lg border-[3px] border-white text-white transition-all duration-300 transform group-hover:scale-110 ${region.color}`}>
                      <MapPin className="w-5 h-5 drop-shadow-md" />
                    </div>

                    {/* Label */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                      <Badge variant="secondary" className="shadow-lg bg-gray-900 text-white border-0 px-3 py-1">
                        {region.title}
                      </Badge>
                    </div>
                  </div>
                ))}

                {/* 3. Floating Hover Card (Desktop) */}
                {hoveredRegion && (
                  <div
                    className="absolute z-50 w-72 pointer-events-none transition-all duration-200 ease-out hidden sm:block"
                    style={{
                      top: mousePos.y + 20,
                      left: mousePos.x > 250 ? mousePos.x - 300 : mousePos.x + 20,
                    }}
                  >
                    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md animate-in zoom-in-95 duration-200 overflow-hidden">
                      <div className={`h-1.5 w-full ${REGIONS[hoveredRegion as keyof typeof REGIONS].color}`} />
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                          <div className="p-2.5 rounded-xl bg-gray-50 shadow-inner">
                            {REGIONS[hoveredRegion as keyof typeof REGIONS].icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 leading-tight text-lg">
                              {REGIONS[hoveredRegion as keyof typeof REGIONS].title}
                            </h3>
                            <p className="text-xs font-medium text-gray-500 mt-1">
                              {REGIONS[hoveredRegion as keyof typeof REGIONS].desc}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {REGIONS[hoveredRegion as keyof typeof REGIONS].places.map((place) => (
                            <Badge 
                              key={place} 
                              variant="outline" 
                              className="text-[10px] bg-slate-50 text-slate-600 border-slate-200"
                            >
                              {place}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
              
              {/* Decorative Elements inside map frame */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-1 opacity-50 pointer-events-none">
                <Compass className="w-16 h-16 text-gray-200" />
              </div>
            </div>
          </div>

          {/* --- RIGHT: STATISTICS & INFO --- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 gap-4">
                
                {/* Stat 1 */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50/50 hover:bg-blue-50 transition-colors duration-300 border border-blue-100">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">50+</h4>
                    <p className="text-sm text-gray-600 font-medium">Holy Destinations Covered</p>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50/50 hover:bg-orange-50 transition-colors duration-300 border border-orange-100">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-orange-600">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">100+</h4>
                    <p className="text-sm text-gray-600 font-medium">Curated Pilgrimage Tours</p>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors duration-300 border border-green-100">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-green-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">10k+</h4>
                    <p className="text-sm text-gray-600 font-medium">Satisfied Pilgrims</p>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50/50 hover:bg-purple-50 transition-colors duration-300 border border-purple-100">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-purple-600">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">12+</h4>
                    <p className="text-sm text-gray-600 font-medium">Years of Experience</p>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-sm text-yellow-800 text-center">
              Tap on any region marker to view popular circuits and packages.
            </div>
          </div>

        </div>

        {/* Mobile View: Fixed Bottom Card for touched region */}
        {hoveredRegion && (
          <div className="sm:hidden fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5">
             <Card className="shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border-0 ring-1 ring-black/5 bg-white">
              <div className={`h-1 w-full ${REGIONS[hoveredRegion as keyof typeof REGIONS].color}`} />
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                  {REGIONS[hoveredRegion as keyof typeof REGIONS].icon}
                  {REGIONS[hoveredRegion as keyof typeof REGIONS].title}
                </h3>
                 <div className="flex flex-wrap gap-1">
                  {REGIONS[hoveredRegion as keyof typeof REGIONS].places.map((place) => (
                    <span key={place} className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                      {place}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </section>
  );
};

export default IndiaCircuitsMap;