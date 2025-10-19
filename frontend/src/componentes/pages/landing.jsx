"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [glitch, setGlitch] = useState(false);
  const [time, setTime] = useState(48 * 60 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  const timeString = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://www.countdowns.live/_next/image?url=%2Fbackgrounds%2Fdystopian.gif&w=3840&q=75")',
          backgroundAttachment: "fixed",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {/* Main Text */}
        <div className="text-center px-4">
          <h1
            className={`text-6xl font-bold mb-6 transition-all duration-100 md:text-6xl ${
              glitch ? "translate-x-1 opacity-90" : "translate-x-0 opacity-100"
            }`}
            style={{
              color: "#ffffff",
              textShadow:
                "0 0 30px rgba(255, 68, 68, 0.8), 0 0 60px rgba(255, 68, 68, 0.4)",
              letterSpacing: "0.08em",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {"AI HAS TAKEN OVER"}
          </h1>

          <div className="h-1 w-64 mx-auto mb-8 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

          <div className="mt-12 text-center">
            <div className="w-full max-w-2xl mx-auto bg-transparent   p-6">
              <div className="text-sm text-gray-300 mb-4 font-light tracking-widest">
                TIME REMAINING
              </div>
              <div
                className="text-4xl font-mono font-bold mb-6"
                style={{
                  color: "#ff4444",
                  textShadow: "0 0 20px rgba(255, 68, 68, 0.6)",
                }}
              >
                {time === 0 ? "SYSTEM OFFLINE" : timeString}
              </div>

              <div className="text-red-400 font-light tracking-widest text-lg">
                YOU ARE OUR LAST HOPE
              </div>
              <div className="mt-6 text-center">
                <div className="text-container">
                  <span className="font-creepster-main">Now, You Have to </span>
                  <span className="font-creepster-highlight"> Confess</span>
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
              "repeating-linear-gradient(0deg, rgba(255, 68, 68, 0.02) 0px, rgba(255, 68, 68, 0.02) 1px, transparent 1px, transparent 2px)",
            animation: "scan 8s linear infinite",
          }}
        />
      </div>

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
