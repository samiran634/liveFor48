import { useEffect } from "react";
import { useGlobalData } from "../../context/GlobalContext.jsx";
import { useNavigate } from "react-router-dom";

const DestructionVideo = () => {
  const { userData } = useGlobalData();
  const navigate = useNavigate();

  useEffect(() => {
    // If no final video, redirect back
    if (!userData.finalVideo) {
      navigate("/mirror");
    }
  }, [userData.finalVideo, navigate]);

  const handleVideoEnd = () => {
    // Redirect to final message page after video ends
    setTimeout(() => {
      navigate("/final");
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden">
      <style>{`
        @keyframes pulseRed {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes flickerRed {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .devil-glow {
          box-shadow: 
            0 0 20px rgba(255, 0, 0, 0.5),
            0 0 40px rgba(255, 0, 0, 0.3),
            0 0 60px rgba(255, 0, 0, 0.2),
            inset 0 0 20px rgba(255, 0, 0, 0.1);
        }
        
        .blood-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            transparent 30%,
            rgba(139, 0, 0, 0.3) 70%,
            rgba(0, 0, 0, 0.9) 100%
          );
          pointer-events: none;
          animation: pulseRed 3s ease-in-out infinite;
        }
      `}</style>

      {/* Blood vignette effect */}
      <div className="blood-vignette" />

      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-red-600 rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulseRed ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl px-4">
        <h1 
          className="font-press-start text-3xl md:text-5xl text-red-600 text-center mb-8 animate-pulse"
          style={{
            textShadow: '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.5)',
            animation: 'flickerRed 0.5s ease-in-out infinite'
          }}
        >
          THE END SPEAKS
        </h1>

        {userData.finalVideo ? (
          <div className="relative">
            <video
              src={userData.finalVideo}
              className="w-full rounded-lg devil-glow"
              style={{
                border: '3px solid #8B0000',
              }}
              controls
              autoPlay
              onEnded={handleVideoEnd}
              onError={(e) => {
                console.error("Video playback error:", e);
              }}
            />
            
            {/* Corner decorations */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-red-600 animate-pulse" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-red-600 animate-pulse" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-red-600 animate-pulse" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-red-600 animate-pulse" />
          </div>
        ) : (
          <div className="text-center text-red-500 animate-pulse">
            Loading destruction...
          </div>
        )}

        <p 
          className="text-center text-red-500 mt-6 font-mono text-lg tracking-wider"
          style={{
            textShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
          }}
        >
          WITNESS YOUR FINAL REFLECTION...
        </p>
      </div>
    </div>
  );
};

export default DestructionVideo;
