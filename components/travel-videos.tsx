import { PlayIcon, Youtube } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";

const TravelVideos = () => {
  const videos = [
    {
      id: "QC_8E_OhpDA",
      title: "Andaman Tour Highlights",
      desc: "Experience the pristine beaches of Havelock & Neil Island.",
    },
    {
      id: "kk9wNcHeBoU",
      title: "Dubai Luxury Escape",
      desc: "Burj Khalifa, Desert Safari & Future Museum tour.",
    },
    {
      id: "9aIoZZ5wFjw",
      title: "Goa Vibes",
      desc: "Sun, Sand, and unforgettable memories in Goa.",
    },
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full text-orange-600 mb-2">
            <PlayIcon className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Travel <span className="text-orange-600">Diaries</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Watch our latest travel vlogs, customer experiences, and tour highlights from across the globe.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <Card 
              key={video.id} 
              className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white group"
            >
              {/* Video Frame */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                  className="absolute inset-0 w-full h-full"
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              
              {/* Content */}
              <CardContent className="p-5">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                  {video.title}
                </h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {video.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subscribe Action */}
        <div className="mt-12 text-center">
          <Link 
            href="https://www.youtube.com/@maakalitourstravelsofficial" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button className="bg-[#FF0000] hover:bg-[#CC0000] text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-red-500/30 transition-all gap-3">
              <Youtube className="w-6 h-6" />
              Subscribe to Our Channel
            </Button>
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            Join our community for weekly travel inspiration!
          </p>
        </div>

      </div>
    </section>
  );
};

export default TravelVideos;