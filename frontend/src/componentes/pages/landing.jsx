import { useState, useEffect } from "react";

const TerminalPanel = () => {
  const [time, setTime] = useState("48:00:00");

  useEffect(() => {
    const end = Date.now() + 48 * 60 * 60 * 1000;
    const interval = setInterval(() => {
      const diff = end - Date.now();
      if (diff < 0) {
        clearInterval(interval);
        setTime("SYSTEM OFFLINE");
        return;
      }
      const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
      const m = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
      const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
   

    <>
    
    {/*give the introductury speches i am leaviing as it is . just like story talling */} 
    <div>
        <img src="/dark_jocker.png" alt="scary reality" />
    </div>
    <div className="w-full max-w-3xl mx-auto bg-black bg-opacity-40 border border-green-700/30 rounded-xl shadow-2xl shadow-green-900/20 p-8 text-center">

      <h1 className="font-press-start text-3xl text-red-500 mb-2">{time}</h1>
      <p className="text-green-400 mb-6">SYSTEM CORRUPTION IMMINENT</p>
      <div className="border border-green-800 bg-gray-900/50 rounded-md p-4">
        <p className="text-white">&gt; The network is collapsing. The world with it.</p>
      </div>
    </div>
    </>
  );
};

export default TerminalPanel;
