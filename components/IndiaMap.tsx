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
  Info,
  MapPinIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// --- Configuration ---
// Top/Left percentages position the pins on the map image
const REGIONS = {
  north: {
    id: "north",
    title: "North India",
    top: "15%",   // Position from top
    left: "29%",  // Position from left
    color: "bg-blue-500",
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
    <section className="py-16 bg-slate-50 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-orange-500 mb-2">
          <div className="flex gap-2 justify-center items-center">
          <MapPinIcon />
          India Pilgrimage Circuits Map
          </div>
          </h2>
        <p className="text-gray-600 mb-10">
          Our pilgrimage network spans across the entire Indian subcontinent
        </p>
        
        {/* Map Container */}
        <div 
          ref={containerRef}
          className="relative w-full max-w-[500px] mx-auto select-none"
          onMouseMove={handleMouseMove}
        >
          
          {/* --- 1. THE EXACT IMAGE --- */}
          {/* Replace src with your local file: src="/india-map.png" */}
          <div className="relative aspect-[3/3.6] w-full">
            <Image 
               src={'/india-map.png'}
               alt="Map of India"
               fill
               className="object-contain drop-shadow-xl"
               priority
            />
          </div>

          {/* --- 2. INTERACTIVE HOTSPOTS --- */}
          {Object.values(REGIONS).map((region) => (
            <div
              key={region.id}
              className="absolute group cursor-pointer"
              style={{ top: region.top, left: region.left }}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              {/* Pulsing Effect */}
              <span className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${region.color}`} />
              
              {/* The Pin Icon */}
              <div className={`relative p-2 rounded-full shadow-lg border-2 border-white text-white transition-transform transform hover:scale-125 ${region.color}`}>
                <MapPin className="w-5 h-5" />
              </div>

              {/* Label (Visible on hover immediately above pin) */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                <Badge variant="secondary" className="shadow-md bg-white text-gray-800 font-bold border border-gray-200">
                  {region.title}
                </Badge>
              </div>
            </div>
          ))}

          {/* --- 3. THE FLOATING INFO CARD --- */}
          {hoveredRegion && (
            <div
              className="absolute z-50 w-72 pointer-events-none transition-all duration-150 ease-out hidden sm:block"
              style={{
                top: mousePos.y + 20,
                // Intelligent flipping so it doesn't go off screen
                left: mousePos.x > 250 ? mousePos.x - 300 : mousePos.x + 20,
              }}
            >
              <Card className="shadow-2xl border-white/50 bg-white/95 backdrop-blur-md animate-in zoom-in-95">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3 border-b pb-3">
                    <div className="p-2 rounded-full bg-slate-100">
                      {REGIONS[hoveredRegion as keyof typeof REGIONS].icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-none text-lg">
                        {REGIONS[hoveredRegion as keyof typeof REGIONS].title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {REGIONS[hoveredRegion as keyof typeof REGIONS].desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {REGIONS[hoveredRegion as keyof typeof REGIONS].places.map((place) => (
                      <Badge 
                        key={place} 
                        variant="outline" 
                        className="text-[10px] bg-slate-50 text-slate-700"
                      >
                        {place}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mobile View: Fixed Bottom Card for touched region */}
          {hoveredRegion && (
            <div className="sm:hidden fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5">
               <Card className="shadow-2xl border-orange-100 bg-white">
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    {REGIONS[hoveredRegion as keyof typeof REGIONS].icon}
                    {REGIONS[hoveredRegion as keyof typeof REGIONS].title}
                  </h3>
                   <div className="flex flex-wrap gap-1 mt-2">
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
      </div>
    </section>
  );
};

export default IndiaCircuitsMap;