import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import LanternTransition from "../components/LanternTransition";
import LoveLetterCard from "../components/LoveLetterCard";
import GallerySlideshow from "../components/GallerySlideshow";

// ✅ Replace these with your actual gallery imports
import g1 from "../assets/gallery/1.jpg";
import g2 from "../assets/gallery/2.jpg";
import g3 from "../assets/gallery/3.jpg";

type Step =
  | "lanternFly"
  | "lanternOpen"
  | "letterIn"
  | "letterHold"
  | "letterOut"
  | "gallery";

export default function LoveFlow() {
  const [step, setStep] = useState<Step>("lanternFly");

  useEffect(() => {
    // Lantern flies in
    if (step === "lanternFly") {
      const t = window.setTimeout(() => setStep("lanternOpen"), 1200);
      return () => window.clearTimeout(t);
    }

    // Lantern opens
    if (step === "lanternOpen") {
      const t = window.setTimeout(() => setStep("letterIn"), 900);
      return () => window.clearTimeout(t);
    }

    // Letter fade in then hold
    if (step === "letterIn") {
      const t = window.setTimeout(() => setStep("letterHold"), 700);
      return () => window.clearTimeout(t);
    }

    // Hold letter for 20 seconds
    if (step === "letterHold") {
      const t = window.setTimeout(() => setStep("letterOut"), 20000);
      return () => window.clearTimeout(t);
    }

    // Fade out then show gallery
    if (step === "letterOut") {
      const t = window.setTimeout(() => setStep("gallery"), 900);
      return () => window.clearTimeout(t);
    }
  }, [step]);

  const slides = [
    { src: g1, alt: "Memory 1" },
    { src: g2, alt: "Memory 2" },
    { src: g3, alt: "Memory 3" },
  ];

  return (
    <main className="relative z-10 min-h-dvh px-6 py-16 sm:py-20">
      {/* Lantern sequence */}
      <div className="mx-auto max-w-5xl">
        <AnimatePresence mode="wait">
          {(step === "lanternFly" || step === "lanternOpen") && (
            <motion.div
              key="lantern"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <LanternTransition
                phase={step === "lanternOpen" ? "open" : "fly"}
              />
              <p className="mt-8 text-center text-white/70">
                A little light… just for you ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Letter */}
      <div className="mx-auto max-w-5xl mt-10">
        <AnimatePresence>
          {(step === "letterIn" || step === "letterHold") && (
            <motion.div key="letter">
              <LoveLetterCard />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step === "letterOut" && (
            <motion.div
              key="letterOut"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
            >
              <LoveLetterCard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gallery */}
      <AnimatePresence>
        {step === "gallery" && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <GallerySlideshow slides={slides} intervalMs={4500} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
