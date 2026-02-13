import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoveFlow from "./pages/LoveFlow";
import LanternField from "./components/LanternField";

import PersistentMusic from "./components/PersistentMusic";
import music from "./assets/music.mp3";

export default function App() {
  return (
    <BrowserRouter>
      <PersistentMusic src={music} volume={0.55} />

      <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-[#1B1642] via-[#3A1F5C] to-[#0B0A1A] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(247,201,94,0.18), transparent 45%), radial-gradient(circle at 70% 60%, rgba(245,167,199,0.14), transparent 55%)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
        </div>

        <LanternField />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/love" element={<LoveFlow />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
