import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PowerGlitch } from "powerglitch";
import { Skull } from "lucide-react";

export default function Loading() {

  const glitchAudioRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [hasGlitched, setHasGlitched] = useState(false);
  const [showError, setShowError] = useState(false);
  const [dots, setDots] = useState(".");
  const glitchRef = useRef(null);
  const staticRef = useRef(null);
  const navigate = useNavigate();

  // Dots animation
  useEffect(() => {
    if (!hasGlitched) {
      const dotsInterval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : "."));
      }, 500);
      return () => clearInterval(dotsInterval);
    }
  }, [hasGlitched]);

  // Progress bar and glitch trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 70) {
          return prev + Math.random() * 2;
        } else if (prev >= 70 && !hasGlitched) {
          setHasGlitched(true);
          setShowError(true);
          clearInterval(interval);
          return 70;
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [hasGlitched]);

  // Apply glitch effect
  useEffect(() => {
   
    if (hasGlitched && glitchRef.current) {
         // Play glitch sound exactly when glitch starts
    if (glitchAudioRef.current) {
      glitchAudioRef.current.currentTime = 0;
      glitchAudioRef.current.play().catch((err) => {
        console.warn("Audio play prevented:", err);
      });
    }
      PowerGlitch.glitch(glitchRef.current, {
        playMode: "always",
        optimizeSeo: true,
        createContainers: true,
        hideOverflow: false,
        timing: { duration: 1950 },
        glitchTimeSpan: { start: 0.67, end: 1 },
        shake: { velocity: 15, amplitudeX: 0, amplitudeY: 0.35 },
        slice: {
          count: 4,
          velocity: 12,
          minHeight: 0.02,
          maxHeight: 0.06,
          hueRotate: true,
          cssFilters: "",
        },
        pulse: false,
      });
    }
  }, [hasGlitched]);

  // Static effect animation
  useEffect(() => {
    if (hasGlitched && staticRef.current) {
      staticRef.current.style.animation = "fadeInOut 0.5s ease-in-out";
    }
  }, [hasGlitched]);

  // Navigate after glitch completes
  useEffect(() => {
    if (hasGlitched) {
      const timeout = setTimeout(() => {
        navigate("/mirror");
      }, 4500);
      return () => clearTimeout(timeout);
    }
  }, [hasGlitched, navigate]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors ${
        showError
          ? "bg-gradient-to-br from-red-950 via-black to-black"
          : "bg-gradient-to-br from-green-950 via-black to-black"
      }`}
      style={{ fontFamily: "'Courier New', monospace" }}
    >
        <audio ref={glitchAudioRef} src="/glitch-effect-1-397982.mp3" preload="auto" />
      {/* Static lines effect */}
      {hasGlitched && (
        <div
          ref={staticRef}
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              rgba(220, 38, 38, 0.15) 0px,
              rgba(220, 38, 38, 0.15) 1px,
              transparent 1px,
              transparent 2px
            )`,
            animation: "scanLines 0.1s linear infinite",
          }}
        >
          <style>{`
            @keyframes scanLines {
              0% {
                transform: translateY(0);
              }
              100% {
                transform: translateY(10px);
              }
            }
            
            @keyframes fadeInOut {
              0% {
                opacity: 0;
              }
              20% {
                opacity: 1;
              }
              80% {
                opacity: 1;
              }
              100% {
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      <div ref={glitchRef}>
        {showError && (
          <div className="mb-8 flex items-center justify-center w-full">
            <Skull size={60} className="text-red-500" />
          </div>
        )}

        <div className="text-center mb-12">
          <h1
            className={`text-4xl font-bold tracking-wider ${
              showError ? "text-red-400" : "text-green-400"
            }`}
          >
            {showError ? (
              <>
                <div>Unusual error</div>
                <div className="text-2xl mt-4">Mission Hijacked</div>
              </>
            ) : (
              <div>Creating replica{dots}</div>
            )}
          </h1>
        </div>
      </div>
      <div className="w-80 h-2 border border-green-400 bg-black rounded-full overflow-hidden mb-8">
        <div
          className={`h-full transition-all duration-300 ${
            showError ? "bg-red-500" : "bg-green-400"
          }`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>

      <p
        className={`text-sm font-mono ${
          showError ? "text-red-500" : "text-gray-500"
        }`}
      >
        {Math.floor(progress)}%
      </p>
    </div>
  );
}
