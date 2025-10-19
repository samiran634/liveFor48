import { createContext, useState, useContext, useEffect } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : {
      imageFile: null,
      imagePreview: null,
      didImageUrl: null,
      name: "",
      occupation: "",
      fondestMemory: "",
      darkestSecret: "",
    };
  });

  useEffect(() => {
    const { imageFile, imagePreview, ...dataToStore } = userData;
    localStorage.setItem("userData", JSON.stringify(dataToStore));
  }, [userData]);

  return (
    <GlobalContext.Provider value={{ userData, setUserData }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalData() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalData must be used within GlobalProvider");
  }
  return context;
}
