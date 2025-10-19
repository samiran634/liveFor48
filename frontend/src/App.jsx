import { useState, useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TerminalPanel from "./componentes/pages/landing";
import MissionPage from "./componentes/pages/mission";
import Loadingpage from "./componentes/pages/loading";
import FinalMessage from "./componentes/pages/finalMessage";
import MirrorMindPanel from "./componentes/pages/mirror";
import DestructionVideo from "./componentes/pages/destructionVideo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/loading" element={<Loadingpage />} />
        <Route path="/mirror" element={<MirrorMindPanel />} />
        <Route path="/destruction" element={<DestructionVideo />} />
        <Route path="/final" element={<FinalMessage />} />
        <Route path="/" element={<TerminalPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
