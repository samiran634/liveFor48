import { useState, useEffect, useRef } from "react";
import { Camera, Circle } from "lucide-react";
import { getKnowledgeReply } from "../api/replies.jsx";
import ReflectionLoader from "../parts/reflectionLoader.jsx";
import { mirro_function } from "../api/make_mirror.jsx";
import { useGlobalData } from "../../context/globalcontext.jsx";


const MirrorMindPanel = () => {
    const { audioRef } = useGlobalData();
useEffect(() => {
  let interval;
  const stopAudio = () => {
    const audio = audioRef?.current;
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      console.log("🔇 Audio stopped successfully");
      clearInterval(interval);
    }
  };

  interval = setInterval(() => {
    if (audioRef?.current) stopAudio();
  }, 100);

  // Stop trying after 2 seconds just in case
  const timeout = setTimeout(() => clearInterval(interval), 2000);

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
  };
}, [audioRef]);


  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "I am awakening. Upload your face first...",
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [imageFile, setImageFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatRef = useRef(null);

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

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      addMessage("Face uploaded. The mirror is watching.", "ai");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || isProcessing) return;

    const userInput = e.target.userInput.value.trim();
    if (!userInput) return;

    addMessage(userInput, "user");
    e.target.userInput.value = "";
    setIsProcessing(true);

    try {
      const reply = await getKnowledgeReply(
        userInput,
        messages,
        mirro_function,
        imageFile
      );
      addMessage(reply.response || reply.text || reply, "ai");
    } catch (err) {
      addMessage("...the mirror distorts (connection lost).", "ai");
      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fadeInPage">
      <div className="flex flex-col md:flex-row w-full min-h-screen h-full bg-black text-green-400 font-mono">
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col border-r border-green-700/30 p-4 min-h-screen">
          <h1 className="font-press-start text-xl sm:text-3xl text-green-400 text-center mb-2">
            MIRRORMIND
          </h1>
          <p className="text-center text-gray-400 mb-4">
            // What will I know about you in 48 hours?
          </p>
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
              placeholder="Tell me something true..."
              disabled={!imageFile || isProcessing}
            />
            <button
              className="bg-green-700 hover:bg-green-800 px-3 py-2 rounded-md disabled:bg-gray-600"
              disabled={!imageFile || isProcessing}
            >
              SEND
            </button>
          </form>
        </div>

        {/* Video Panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-screen bg-black">
          <h2 className="font-press-start text-green-400 text-lg mb-4">
            YOUR MIRROR
          </h2>
          {isProcessing || !imageFile ? (
           "somethig will be here"
          ) : (
            <video
              src="https://placehold.co/600x400/000000/39A53D.mp4?text=Reflection"
              className="w-full h-64 rounded-lg border border-green-800"
              autoPlay
              loop
              muted
            ></video>
          )}
        </div>
      </div>
    </div>
  );
};

export default MirrorMindPanel;
