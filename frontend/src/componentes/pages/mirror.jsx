import { useState, useEffect, useRef } from "react";
import { Camera, Circle } from "lucide-react";
import { getKnowledgeReply } from "../api/replies.jsx";
import ReflectionLoader from "../parts/reflectionLoader.jsx";
import { mirro_function, uploadImageToDID } from "../api/make_mirror.jsx";
import { useGlobalData } from "../../context/GlobalContext.jsx";
import { useNavigate } from "react-router-dom";

const MirrorMindPanel = () => {
  const { userData, setUserData } = useGlobalData();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: userData.didImageUrl 
        ? "The mirror remembers you. Speak your truth." 
        : "I am awakening. Upload your face first...",
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [isFinalVideo, setIsFinalVideo] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const [fullScreenGlitch, setFullScreenGlitch] = useState(false);
  const chatRef = useRef(null);
  const uploadAttempted = useRef(false);

  // Trigger glitch strips periodically based on message count
  useEffect(() => {
    if (messageCount === 0) return;
    
    const glitchInterval = setInterval(() => {
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 300);
    }, messageCount === 1 ? 5000 : messageCount === 2 ? 3000 : 1500);
    
    return () => clearInterval(glitchInterval);
  }, [messageCount]);

  useEffect(() => {
    if (userData.imageFile && !userData.didImageUrl && !uploadAttempted.current) {
      uploadAttempted.current = true;
      uploadImageToDidOnMount();
    }
  }, []);

  const uploadImageToDidOnMount = async () => {
    if (!userData.imageFile || userData.didImageUrl || isUploadingImage) return;
    
    setIsUploadingImage(true);
    addMessage("Uploading to the mirror...", "ai");
    try {
      const didUrl = await uploadImageToDID(userData.imageFile);
      setUserData(prev => ({ ...prev, didImageUrl: didUrl }));
      addMessage("The mirror has captured your essence. You may speak.", "ai");
    } catch (err) {
      console.error("Failed to upload to D-ID:", err);
      addMessage("The mirror rejects your image... (upload failed)", "ai");
    } finally {
      setIsUploadingImage(false);
    }
  };

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const addMessage = (content, role) =>
    setMessages((prev) => [
      ...prev,
      {
        role,
        content,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setUserData(prev => ({ ...prev, imageFile: file, imagePreview: previewUrl }));
      addMessage("Face uploaded. Uploading to the mirror...", "ai");
      
      uploadAttempted.current = true;
      setIsUploadingImage(true);
      try {
        const didUrl = await uploadImageToDID(file);
        setUserData(prev => ({ ...prev, didImageUrl: didUrl }));
        addMessage("The mirror has captured your essence. You may speak.", "ai");
      } catch (err) {
        console.error("Failed to upload to D-ID:", err);
        addMessage("The mirror rejects your image... (upload failed)", "ai");
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.imageFile || !userData.didImageUrl || isProcessing) return;

    const userInput = e.target.userInput.value.trim();
    if (!userInput) return;

    addMessage(userInput, "user");
    e.target.userInput.value = "";
    setIsProcessing(true);

    const currentCount = messageCount + 1;
    setMessageCount(currentCount);
    
    // Increase glitch intensity with each message
    setGlitchIntensity(currentCount * 0.33);

    try {
      let aiResponse;
      
      // After 3 messages, create final destruction message
      if (currentCount >= 3) {
        aiResponse = `The mirror shatters... Your essence has been captured. The apocalypse sees through your eyes now. There is no escape from what you truly are.`;
        addMessage(aiResponse, "ai");
        
        setIsGeneratingVideo(true);
        addMessage("Creating your final reflection...", "ai");
        
        const result = await mirro_function(userData.didImageUrl, aiResponse);
        if (result && result.video_url) {
          // Store the video URL in global state first
          await new Promise((resolve) => {
            setUserData(prev => {
              resolve();
              return { ...prev, finalVideo: result.video_url };
            });
          });
          
          addMessage("Preparing final destruction...", "ai");
          
          // Trigger full screen glitch effect
          setFullScreenGlitch(true);
          
          // Wait for glitch to complete and state to update, then redirect
          setTimeout(() => {
            navigate("/destruction");
          }, 1500);
        }
      } else {
        // Normal chat flow for messages 1 and 2
        const reply = await getKnowledgeReply(
          userInput,
          messages,
          null,
          userData.didImageUrl
        );
        
        aiResponse = reply.response || reply.text || reply;
        addMessage(aiResponse, "ai");

        setIsGeneratingVideo(true);
        addMessage("Generating your reflection...", "ai");
        
        const result = await mirro_function(userData.didImageUrl, aiResponse);
        if (result && result.video_url) {
          setVideoUrl(result.video_url);
          addMessage("Your reflection is ready. Watch the mirror.", "ai");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      addMessage("...the mirror distorts (connection lost).", "ai");
      console.log(err);
    } finally {
      setIsGeneratingVideo(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fadeInPage">
      <div className="flex flex-col md:flex-row w-full min-h-screen h-full bg-black text-green-400 font-mono relative">
        <style>{`
          @keyframes rgbGlitch {
            0% { opacity: 0; }
            10% { opacity: 1; }
            20% { opacity: 0; }
            100% { opacity: 0; }
          }
          
          .glitch-strip {
            position: absolute;
            left: 0;
            width: 100%;
            height: 8px;
            background: linear-gradient(90deg, 
              rgba(255, 0, 0, 0.8) 0%, 
              rgba(0, 255, 0, 0.8) 33%, 
              rgba(0, 0, 255, 0.8) 66%, 
              rgba(255, 0, 0, 0.8) 100%);
            animation: rgbGlitch 0.3s ease-in-out;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
          }
          
          @keyframes fullGlitchOut {
            0% { opacity: 0; }
            10% { opacity: 1; transform: translateX(-100%); }
            20% { opacity: 1; transform: translateX(100%); }
            30% { opacity: 1; transform: translateX(-50%); }
            40% { opacity: 1; transform: translateX(50%); }
            50% { opacity: 1; transform: translateX(0); }
            60% { opacity: 0.5; }
            70% { opacity: 1; }
            80% { opacity: 0.3; }
            90% { opacity: 1; }
            100% { opacity: 0; }
          }
          
          .full-screen-glitch {
            position: fixed;
            inset: 0;
            z-index: 99999;
            pointer-events: none;
          }
          
          .full-screen-glitch::before,
          .full-screen-glitch::after {
            content: '';
            position: absolute;
            inset: 0;
            animation: fullGlitchOut 1s ease-in-out;
          }
          
          .full-screen-glitch::before {
            background: repeating-linear-gradient(
              0deg,
              rgba(255, 0, 0, 0.8) 0px,
              rgba(0, 255, 0, 0.8) 3px,
              rgba(0, 0, 255, 0.8) 6px,
              transparent 9px,
              transparent 12px
            );
          }
          
          .full-screen-glitch::after {
            background: repeating-linear-gradient(
              90deg,
              rgba(255, 0, 0, 0.6) 0px,
              rgba(0, 255, 0, 0.6) 2px,
              rgba(0, 0, 255, 0.6) 4px,
              transparent 6px,
              transparent 8px
            );
            animation-delay: 0.1s;
          }
        `}</style>
        {/* Full screen glitch effect */}
        {fullScreenGlitch && <div className="full-screen-glitch" />}
        {/* Glitch strips that appear based on message count */}
        {showGlitch && messageCount > 0 && (
          <>
            <div className="glitch-strip" style={{ top: `${Math.random() * 100}%` }} />
            <div className="glitch-strip" style={{ top: `${Math.random() * 100}%`, height: '10px' }} />
            {messageCount > 1 && (
              <>
                <div className="glitch-strip" style={{ top: `${Math.random() * 100}%`, height: '12px' }} />
                <div className="glitch-strip" style={{ top: `${Math.random() * 100}%`, height: '6px' }} />
              </>
            )}
            {messageCount >= 2 && (
              <>
                <div className="glitch-strip" style={{ top: `${Math.random() * 100}%`, height: '15px' }} />
                <div className="glitch-strip" style={{ top: `${Math.random() * 100}%`, height: '10px' }} />
                <div className="glitch-strip" style={{ top: `${Math.random() * 100}%`, height: '8px' }} />
              </>
            )}
          </>
        )}
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col border-r border-green-700/30 p-4 min-h-screen">
          <h1 className="font-press-start text-xl sm:text-3xl text-green-400 text-center mb-2">
            MIRRORMIND
          </h1>
          <p className="text-center text-gray-400 mb-4">
            // What will I know about you in 48 hours?
          </p>

          <label
            htmlFor="upload"
            className="border border-green-600 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-green-950/20 transition mb-4"
          >
            {isUploadingImage ? (
              <span className="text-yellow-400 animate-pulse">
                ⏳ Uploading to D-ID...
              </span>
            ) : userData.didImageUrl ? (
              <span className="text-green-400">
                ✅ Ready: {userData.imageFile?.name || "Image from mission"}
              </span>
            ) : userData.imageFile ? (
              <span className="text-yellow-400">
                📤 Processing...
              </span>
            ) : (
              <>
                <Camera className="w-6 h-6 mb-2" />
                <p>Upload your face</p>
              </>
            )}
          </label>
          <input
            type="file"
            id="upload"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
            disabled={isUploadingImage}
          />

          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto bg-gray-900/30 rounded-md p-3 space-y-3 border border-green-800/30"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md ${
                  msg.role === "ai"
                    ? "bg-green-900/20"
                    : "bg-gray-800/40 text-right"
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-xs text-gray-400">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <input
              name="userInput"
              className="flex-1 bg-black border border-green-700 text-green-300 p-2 rounded-md outline-none"
              placeholder={messageCount >= 3 ? "Final message sent..." : "Tell me something true..."}
              disabled={!userData.didImageUrl || isProcessing || isUploadingImage || messageCount >= 3}
            />
            <button
              className="bg-green-700 hover:bg-green-800 px-3 py-2 rounded-md disabled:bg-gray-600"
              disabled={!userData.didImageUrl || isProcessing || isUploadingImage || messageCount >= 3}
            >
              {isUploadingImage ? "UPLOADING..." : messageCount >= 3 ? "DONE" : "SEND"}
            </button>
          </form>
        </div>

        {/* Video Panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-screen bg-black">
          <h2 className="font-press-start text-green-400 text-lg mb-4">
            YOUR MIRROR
          </h2>
          {isGeneratingVideo ? (
            <div className="flex flex-col items-center">
              <ReflectionLoader />
              <p className="text-green-400 mt-4 animate-pulse">
                Creating your reflection...
              </p>
            </div>
          ) : videoUrl ? (
            <div className="w-full max-w-2xl">
              <video
                key={videoUrl}
                src={videoUrl}
                className="w-full rounded-lg border-2 border-green-600 shadow-lg shadow-green-900/50"
                controls
                autoPlay
                onError={(e) => {
                  console.error("Video playback error:", e);
                  addMessage("Failed to load reflection video", "ai");
                }}
              />
              <p className="text-center text-green-400 mt-2 text-sm">
                Your reflection speaks...
              </p>
            </div>
          ) : userData.imagePreview ? (
            <div className="w-full max-w-2xl">
              <img
                src={userData.imagePreview}
                alt="Your uploaded face"
                className="w-full rounded-lg border-2 border-green-600 shadow-lg shadow-green-900/50"
              />
              <p className="text-center text-green-400 mt-2 text-sm">
                The mirror awaits your confession...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ReflectionLoader />
              <p className="text-green-400 mt-4">
                Upload your face to begin...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MirrorMindPanel;
