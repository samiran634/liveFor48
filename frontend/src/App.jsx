import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRef, useState } from "react";
import { GlobalProvider } from "./context/GlobalContext.jsx";
import Home from "./componentes/pages/landing";
import Mission from "./componentes/pages/mission";
import MirrorMindPanel from "./componentes/pages/mirror";
import DestructionVideo from "./componentes/pages/destructionVideo";
import FinalMessage from "./componentes/pages/finalMessage";
import Loading from "./componentes/pages/loading";

function App() {
  const audioRef = useRef(null);
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1;
      audio.play().catch(console.warn);
    }
    setStarted(true);
  };

  return (
    <BrowserRouter>
      <GlobalProvider>
        <audio ref={audioRef} preload="auto" loop>
          <source src="/thrilling_audio.opus" type="audio/ogg; codecs=opus" />
          Your browser does not support the OPUS audio format.
        </audio>

        {!started ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              background: "black",
              color: "white",
              flexDirection: "column",
            }}
          >
            <h2>🎧 Click to Begin</h2>
            <button
              onClick={handleStart}
              style={{
                padding: "10px 20px",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              Start Experience
            </button>
          </div>
        ) : (
          <Routes>
            <Route path="/mission" element={<Mission />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/mirror" element={<MirrorMindPanel />} />
            <Route path="/destruction" element={<DestructionVideo />} />
            <Route path="/final" element={<FinalMessage />} />
            <Route path="/" element={<Home />} />
          </Routes>
        )}
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
