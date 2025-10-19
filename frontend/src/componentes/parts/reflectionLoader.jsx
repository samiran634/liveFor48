import { useState, useEffect, useRef } from "react";
import { Circle } from "lucide-react";

export default function ReflectionLoader() {
  const [showImage, setShowImage] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let timer;

    const loopAnimation = () => {
      // Random time between 5 and 10 seconds
      const randomTime = Math.floor(Math.random() * 5000) + 5000;

      timer = setTimeout(() => {
        setShowImage((prev) => !prev);
        loopAnimation();
      }, randomTime);
    };

    loopAnimation();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Play sound when skull appears
    if (showImage && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore autoplay restriction until user interacts
      });
    }
  }, [showImage]);

  return (
    <div className="flex flex-col items-center justify-center h-64 w-full border border-green-800 rounded-lg relative overflow-hidden">
      {/* Circle loader */}
      <div
        className={`absolute transition-opacity duration-700 ${
          showImage ? "opacity-0" : "opacity-100"
        }`}
      >
        <Circle className="w-12 h-12 mb-3 text-green-500 animate-pulse" />
      </div>

      {/* Skull image */}
      <img
        src="/dark_scull.png"
        alt=""
        className={`h-60 w-40 transition-opacity duration-700 ${
          showImage ? "opacity-100" : "opacity-0"
        }`}
      />

      <p className="text-gray-400 mt-2">Awaiting reflection...</p>

      {/* Audio element */}
      <audio ref={audioRef} preload="auto">
        <source src="/thrilling_audio.opus" type="audio/ogg; codecs=opus" />
        Your browser does not support the OPUS audio format.
      </audio>
    </div>
  );
}
