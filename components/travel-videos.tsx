import { PlayIcon } from "lucide-react";
import React from "react";

const TravelVideos = () => {
  return (
    <div className="py-10">
      <div className="text-center flex flex-col gap-2">
        <div className="flex items-center justify-center">
          <h2 className="text-orange-500 flex font-bold items-center gap-2 text-2xl md:text-4xl">
            <PlayIcon /> Travel Diaries
          </h2>
        </div>
        <p className="text-gray-700">
          Watch our latest travel vlogs and event highlights
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-5">
        {/* Video 1 */}
        <iframe
          src="https://www.youtube.com/embed/QC_8E_OhpDA"
          className="w-full h-64 rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>

        {/* Shorts converted to embed */}
        <iframe
          src="https://www.youtube.com/embed/9aIoZZ5wFjw"
          className="w-full h-64 rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>

        {/* Video 3 */}
        <iframe
          src="https://www.youtube.com/embed/kk9wNcHeBoU"
          className="w-full h-64 rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>

      </div>
    </div>
  );
};

export default TravelVideos;
