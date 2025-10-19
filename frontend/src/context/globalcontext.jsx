import { createContext, useContext, useState, useRef, useEffect } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [userData, setUserData] = useState({
    image: null,
    name: "",
    occupation: "",
    fondestMemory: "",
    darkestSecret: "",
  });

  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current && !isAudioPlaying) {
      audioRef.current.play().catch(() => {});
      setIsAudioPlaying(true);
    }
  }, [isAudioPlaying]);

  return (
    <GlobalContext.Provider value={{ userData, setUserData, audioRef }}>
      {/* Persistent background audio */}
      <audio ref={audioRef} preload="auto" loop>
        <source src="/thrilling_audio.opus" type="audio/ogg; codecs=opus" />
        Your browser does not support the OPUS audio format.
      </audio>

      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalData() {
  return useContext(GlobalContext);
}
