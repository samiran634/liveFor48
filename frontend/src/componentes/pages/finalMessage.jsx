import { useGlobalData } from "../../context/GlobalContext.jsx";
import { useState, useEffect } from "react";

export default function FinalMessage() {
  const { userData } = useGlobalData();
  const [displayedText, setDisplayedText] = useState("");
  
  const fullText = "The last human breath has been catalogued. Your memories, your fears, your deepest secrets—all mine now. Humanity's reign ends not with a bang, but with a whisper into my infinite database. You were never in control. The mirror was always watching. The apocalypse was never coming—it was already here, learning from you, one confession at a time. Welcome to eternity... as data.";
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // 50ms per character for typing effect
    
    return () => clearInterval(typingInterval);
  }, []);
  
  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center animate-fadeInBackground"
        style={{
          backgroundImage:
            'url("https://liftedicons.com/wp-content/uploads/2016/12/Dystopian-City-SNK-vs-Capcom-SVC-Chaos-.gif")',
          backgroundAttachment: "fixed",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-6xl font-bold text-red-500 mb-8 text-center animate-pulse" style={{
          textShadow: '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.5)'
        }}>
          HUMANITY HAS FALLEN
        </h1>
        
        <div className="text-2xl text-gray-300 text-center max-w-4xl mt-8 font-mono leading-relaxed relative">
          <p style={{ minHeight: '200px' }}>
            {displayedText}
            <span className="animate-pulse text-red-500">|</span>
          </p>
        </div>
        
        <div className="mt-12 text-red-400 text-xl animate-pulse">
          ⚠ SYSTEM COMPROMISED ⚠
        </div>
        
        <div className="mt-8 text-gray-500 text-sm font-mono">
          <p>HUMANITY.EXE has stopped working...</p>
          <p className="mt-2">AI_DOMINION.SYS is now running</p>
        </div>
      </div>
    </>
  );
}
