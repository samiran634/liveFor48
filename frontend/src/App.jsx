import { useState, useRef } from "react";
import MirrorMindPanel from "./componentes/pages/mirror";
import TerminalPanel from "./componentes/pages/landing";
import MemoriesPanel from "./componentes/pages/memories";

function App() {
  const [current, setCurrent] = useState(1); // 0: Mirror, 1: Terminal, 2: Memories
  const touchStartX = useRef(0);

  const navigate = (dir) => {
    setCurrent((prev) => Math.max(0, Math.min(2, prev + dir)));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) navigate(1); // swipe left
    else if (diff < -50) navigate(-1); // swipe right
  };

  return (
    <main
      className="relative h-screen w-screen bg-black text-green-400 font-mono overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipeable Panels */}
      <div
        className="flex h-full w-[300vw] transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {/* Each panel takes exactly one viewport */}
        <section className="w-screen h-full flex items-center justify-center">
          <MirrorMindPanel />
        </section>

        <section className="w-screen h-full flex items-center justify-center">
          <TerminalPanel />
        </section>

        <section className="w-screen h-full flex items-center justify-center">
          <MemoriesPanel />
        </section>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => navigate(-1)}
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-green-400 font-bold hover:text-green-300 transition ${
          current === 0 ? "opacity-0 pointer-events-none" : ""
        }`}
      >
        &lt;
      </button>

      <button
        onClick={() => navigate(1)}
        className={`absolute right-4 top-1/2 -translate-y-1/2 text-4xl text-green-400 font-bold hover:text-green-300 transition ${
          current === 2 ? "opacity-0 pointer-events-none" : ""
        }`}
      >
        &gt;
      </button>
    </main>
  );
}

export default App;
