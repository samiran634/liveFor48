import { useState, useRef } from "react";
import MirrorMindPanel from "./componentes/pages/mirror";
import TerminalPanel from "./componentes/pages/landing";
import MemoriesPanel from "./componentes/pages/memories";

function App() {
  return (
    <div>
      <section className="w-screen h-full flex items-center justify-center">
        <TerminalPanel />
      </section>
    </div>
  );
}

export default App;
