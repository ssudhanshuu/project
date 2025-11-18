import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { dummyTrailers } from "../assets/assets";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

export default function TrailersSection() {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentTrailer]);

  const getEmbedUrl = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-24 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
        Trailers
      </p>

      {/* Trailer Player */}
      <div
        ref={videoRef}
        tabIndex="-1"
        className="relative mt-6 aspect-video max-w-4xl mx-auto"
      >
        <BlurCircle top="-100px" right="-100px" />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10 text-white text-lg">
            Loading trailer...
          </div>
        )}
        {currentTrailer && (
          <ReactPlayer
            url={getEmbedUrl(currentTrailer.videoUrl)}
            controls
            playing
            muted
            width="100%"
            height="100%"
            onReady={() => setIsLoading(false)}
          />
        )}
      </div>

      {/* Trailer Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer, index) => (
          <button
            key={index}
            onClick={() => {
              if (trailer.videoUrl !== currentTrailer.videoUrl) {
                setIsLoading(true);
                setCurrentTrailer(trailer);
              }
            }}
            className={`relative group rounded-lg overflow-hidden border-2 transition focus:outline-none focus:ring-2 focus:ring-white ${
              trailer.videoUrl === currentTrailer.videoUrl
                ? "border-white"
                : "border-transparent"
            }`}
            aria-label={`Play trailer ${index + 1}`}
          >
            <img
              src={trailer.image}
              alt={`Trailer ${index + 1}`}
              className="w-full h-full object-cover brightness-75 group-hover:brightness-90"
            />
            <PlayCircleIcon
              className="absolute inset-0 m-auto w-10 h-10 text-white opacity-80 group-hover:opacity-100 transition"
              strokeWidth={1.6}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
