import { useEffect, useState, useRef } from "react";
import { PowerGlitch } from "powerglitch";
import { useNavigate } from "react-router-dom";

export default function Home() {
//for audio
  const audioRef = useRef(null);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      // Remove listener after first play
      document.removeEventListener("click", playAudio);
    };

    document.addEventListener("click", playAudio);
    return () => document.removeEventListener("click", playAudio);
  }, []);

  const [time, setTime] = useState(48 * 60 * 60);
  const [showInitialContent, setShowInitialContent] = useState(true);
  const [showMissionButton, setShowMissionButton] = useState(false);
  const glitchRef = useRef(null);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger glitch right before transition
  useEffect(() => {
    const glitchTimer = setTimeout(() => {
      if (glitchRef.current) {
        PowerGlitch.glitch(glitchRef.current, {
          playMode: "always",
          createContainers: true,
          timing: { duration: 2000 },
          glitchTimeSpan: { start: 0.7, end: 1 },
          shake: { velocity: 20, amplitudeX: 0.2, amplitudeY: 0.2 },
          slice: {
            count: 4,
            velocity: 15,
            minHeight: 0.03,
            maxHeight: 0.07,
            hueRotate: true,
          },
        });
      }
    }, 15000);
    return () => clearTimeout(glitchTimer);
  }, []);

  // Hide initial content, then show mission button
  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setShowInitialContent(false);
      setTimeout(() => setShowMissionButton(true), 1000); // small delay for fade
    }, 20000);
    return () => clearTimeout(hideTimer);
  }, []);

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  const timeString = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleStartMission = () => {
    // Add your navigation logic here
    // If using react-router-dom: navigate("/mission");
    // Or window.location.href = "/mission";
    navigate("/mission");
  };

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-fadeInBackground"
        style={{
          backgroundImage:
            'url("https://www.countdowns.live/_next/image?url=%2Fbackgrounds%2Fdystopian.gif&w=3840&q=75")',
          backgroundAttachment: "fixed",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 animate-fadeInBackground" />

      {/* Initial Content */}
      {showInitialContent && (
        <div
          className="relative z-10 w-full h-full flex flex-col items-center justify-center transition-opacity duration-1000 opacity-100"
        >
          <div className="text-center px-4">
            <h1
              ref={glitchRef}
              className="text-6xl font-bold mb-6 md:text-6xl animate-fadeInSlideDown"
              style={{
                color: "#ffffff",
                textShadow:
                  "0 0 30px rgba(255, 68, 68, 0.8), 0 0 60px rgba(255, 68, 68, 0.4)",
                letterSpacing: "0.08em",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              AI HAS TAKEN OVER
            </h1>

            <div className="h-1 w-64 mx-auto mb-8 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-fadeInSlideDown" />

            <div className="mt-12 text-center">
              <div className="w-full max-w-2xl mx-auto bg-transparent p-6 animate-fadeInSlideUp">
                <div className="text-sm text-gray-300 mb-4 font-light tracking-widest">
                  You only have
                </div>
                <div
                  className={`text-4xl font-mono font-bold mb-6 ${
                    time === 0 ? "animate-pulse text-red-500" : ""
                  }`}
                  style={{
                    color: "#ff4444",
                    textShadow: "0 0 20px rgba(255, 68, 68, 0.6)",
                  }}
                >
                  {time === 0 ? "SYSTEM OFFLINE" : timeString}
                </div>

                <div className="text-red-400 font-light tracking-widest text-lg animate-fadeInSlideUpHope">
                  We are the last Humans left
                </div>
                <div className="mt-6 text-center animate-fadeInSlideUpConfess">
                  <div className="text-container">
                    <div className="font-creepster-main">
                      Our only hope to survive is to become
                    </div>
                    <span className="font-creepster-highlight">
                      {" "}
                      The Apocalypse Itself
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255, 68, 68, 0.03) 0px, rgba(255, 68, 68, 0.03) 1px, transparent 1px, transparent 2px)",
              animation: `scan ${Math.random() * 5 + 5}s linear infinite`,
              opacity: Math.random() * 0.2 + 0.3,
            }}
          />
        </div>
      )}

      {/* Start Mission Button */}
      {showMissionButton && (
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center animate-fadeInButton">
          <div className="text-center">
            <button
              onClick={handleStartMission}
              className="mission-button group relative px-8 py-4 text-2xl font-bold text-white bg-red-600 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-110 hover:bg-red-700"
              style={{
                boxShadow:
                  "0 0 30px rgba(255, 68, 68, 0.8), 0 0 60px rgba(255, 68, 68, 0.5)",
                border: "2px solid #ff4444",
              }}
            >
              <span className="relative z-10">START MISSION</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10px);
          }
        }
      `}</style>
    </main>
  );
}
