import { useState, useEffect, useRef } from "react";
import { Camera, Circle } from "lucide-react";

const MirrorMindPanel = () => {
  const [messages, setMessages] = useState([
    { role: "ai", content: "I am awakening. Upload your face first...", time: new Date().toLocaleTimeString() },
  ]);
  const [imageFile, setImageFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const addMessage = (content, role) =>
    setMessages((prev) => [...prev, { role, content, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      addMessage("Face uploaded. The mirror is watching.", "ai");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageFile || isProcessing) return;

    const userInput = e.target.userInput.value.trim();
    if (!userInput) return;
    addMessage(userInput, "user");
    e.target.userInput.value = "";
    setIsProcessing(true);

    setTimeout(() => {
      const replies = [
        "Interesting. I see a flicker of doubt in that statement.",
        "Why do you think that is? Be honest.",
        "That contradicts something you implied earlier.",
        "You're hiding something. The reflection doesn't lie.",
        "A logical fallacy. Predictable.",
      ];
      addMessage(replies[Math.floor(Math.random() * replies.length)], "ai");
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-black text-green-400 font-mono">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col border-r border-green-700/30 p-4">
        <h1 className="font-press-start text-xl sm:text-3xl text-green-400 text-center mb-2">MIRRORMIND</h1>
        <p className="text-center text-gray-400 mb-4">// What will I know about you in 48 hours?</p>

        <label
          htmlFor="upload"
          className="border border-green-600 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-green-950/20 transition mb-4"
        >
          {imageFile ? (
            <span className="text-green-400">✅ Uploaded: {imageFile.name}</span>
          ) : (
            <>
              <Camera className="w-6 h-6 mb-2" />
              <p>Upload your face</p>
            </>
          )}
        </label>
        <input type="file" id="upload" accept="image/*" className="hidden" onChange={handleImage} />

        <div ref={chatRef} className="flex-1 overflow-y-auto bg-gray-900/30 rounded-md p-3 space-y-3 border border-green-800/30">
          {messages.map((msg, i) => (
            <div key={i} className={`p-2 rounded-md ${msg.role === "ai" ? "bg-green-900/20" : "bg-gray-800/40 text-right"}`}>
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
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h2 className="font-press-start text-green-400 text-lg mb-4">YOUR MIRROR</h2>
        {isProcessing || !imageFile ? (
          <div className="flex flex-col items-center justify-center h-64 w-full border border-green-800 rounded-lg">
            <Circle className="w-12 h-12 mb-3 text-green-500 animate-pulse" />
            <p className="text-gray-400">Awaiting reflection...</p>
          </div>
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
  );
};

export default MirrorMindPanel;
