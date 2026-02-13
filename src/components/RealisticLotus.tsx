import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import lotusOpen from "../assets/lotus_open.png";
import lotusClose from "../assets/lotus_close.png";
import polaroidImg from "../assets/polaroid.png";

import PolaroidCard from "./PolaroidCard";

type Phase = "idle" | "blooming" | "polaroid" | "choice";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getSafeViewport() {
  // Use visualViewport when available (mobile address bar / notch safe-ish behavior)
  const vv = window.visualViewport;
  const width = vv?.width ?? window.innerWidth;
  const height = vv?.height ?? window.innerHeight;
  const offsetLeft = vv?.offsetLeft ?? 0;
  const offsetTop = vv?.offsetTop ?? 0;
  return { width, height, offsetLeft, offsetTop };
}

export default function RealisticLotus() {
  const navigate = useNavigate();

  const [opened, setOpened] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");

  const [noCount, setNoCount] = useState(0);

  // NO starts aligned, then escapes as a fixed element
  const [noEscaping, setNoEscaping] = useState(false);
  const [noXY, setNoXY] = useState({ x: 0, y: 0 });

  // measure NO button size when it becomes fixed
  const noBtnRef = useRef<HTMLButtonElement | null>(null);

  // store last known NO dimensions
  const [noSize, setNoSize] = useState({ w: 120, h: 44 });

  const yesScale = useMemo(() => {
    // growth is continuous; cap very high so it can "take over"
    const s = 1 + noCount * 0.22;
    return Math.min(30, s);
  }, [noCount]);

  const bloom = () => {
    if (opened) return;
    setOpened(true);
    setPhase("blooming");
  };

  // timeline: bloom -> polaroid -> choice
  useEffect(() => {
    if (phase !== "blooming") return;
    const t = window.setTimeout(() => setPhase("polaroid"), 1100);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "polaroid") return;
    const t = window.setTimeout(() => setPhase("choice"), 2600);
    return () => window.clearTimeout(t);
  }, [phase]);

  // when NO becomes fixed/escaping, measure it (so we can keep it on-screen)
  useEffect(() => {
    if (!noEscaping) return;

    const measure = () => {
      const rect = noBtnRef.current?.getBoundingClientRect();
      if (!rect) return;
      setNoSize({ w: Math.max(80, rect.width), h: Math.max(36, rect.height) });
    };

    // measure now + next frame
    measure();
    requestAnimationFrame(measure);

    // re-measure on resize/orientation changes
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [noEscaping]);

  const randomizeNoPosition = () => {
    const { width, height, offsetLeft, offsetTop } = getSafeViewport();

    // padding so it never touches edges (bigger on mobile)
    const pad = Math.max(12, Math.min(width, height) * 0.03);

    // ensure within safe viewport bounds (including visualViewport offsets)
    const minX = offsetLeft + pad;
    const minY = offsetTop + pad;

    const maxX = offsetLeft + width - noSize.w - pad;
    const maxY = offsetTop + height - noSize.h - pad;

    const x = minX + Math.random() * Math.max(1, maxX - minX);
    const y = minY + Math.random() * Math.max(1, maxY - minY);

    setNoXY({
      x: clamp(x, minX, maxX),
      y: clamp(y, minY, maxY),
    });
  };

  // keep NO in-bounds if user rotates phone / resizes window
  useEffect(() => {
    if (!(phase === "choice" && noEscaping)) return;
    randomizeNoPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noEscaping, noSize.w, noSize.h]);

  const onNo = () => {
    setNoCount((c) => c + 1);

    if (!noEscaping) {
      setNoEscaping(true);
      // wait for fixed button to mount then place it
      requestAnimationFrame(() => randomizeNoPosition());
      return;
    }

    randomizeNoPosition();
  };

  const onYes = () => {
    navigate("/love");
  };

  const resetAll = () => {
    setOpened(false);
    setPhase("idle");
    setNoCount(0);
    setNoEscaping(false);
    setNoXY({ x: 0, y: 0 });
    setNoSize({ w: 120, h: 44 });
  };

  return (
    <section className="mt-14 sm:mt-16 flex flex-col items-center">
      <p className="text-white/75 mb-6">
        Tap the lotus to reveal something I’ve been wanting to ask.
      </p>

      {/* LOTUS STAGE */}
      <div className="relative grid place-items-center">
        <motion.button
          type="button"
          onClick={bloom}
          className="relative grid place-items-center select-none"
          whileHover={{ scale: opened ? 1 : 1.03 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Open lotus"
        >
          {/* Glow halo */}
          <motion.div
            className="absolute -inset-14 rounded-full blur-3xl"
            initial={false}
            animate={
              opened
                ? { opacity: [0.25, 0.7, 0.55], scale: [1, 1.15, 1.08] }
                : { opacity: 0.35, scale: 1 }
            }
            transition={{
              duration: opened ? 1.15 : 0.6,
              ease: "easeInOut",
              times: opened ? [0, 0.55, 1] : undefined,
            }}
            style={{
              background:
                "radial-gradient(circle, rgba(247,201,94,0.45) 0%, rgba(245,167,199,0.25) 40%, transparent 70%)",
            }}
          />

          {/* Lotus stack */}
          <div className="relative h-56 w-56 sm:h-72 sm:w-72">
            <motion.img
              src={lotusClose}
              alt="Closed lotus"
              draggable={false}
              className="absolute inset-0 h-full w-full drop-shadow-[0_0_30px_rgba(0,0,0,0.35)]"
              initial={false}
              animate={
                opened
                  ? {
                      opacity: 0,
                      scale: 0.92,
                      filter: "blur(6px) brightness(0.95) saturate(0.95)",
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px) brightness(1) saturate(1)",
                    }
              }
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.img
              src={lotusOpen}
              alt="Open lotus"
              draggable={false}
              className="absolute inset-0 h-full w-full drop-shadow-[0_0_44px_rgba(247,201,94,0.28)]"
              initial={false}
              animate={
                opened
                  ? {
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px) brightness(1.06) saturate(1.08)",
                    }
                  : {
                      opacity: 0,
                      scale: 0.88,
                      filter: "blur(8px) brightness(0.95) saturate(0.9)",
                    }
              }
              transition={{
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
                delay: opened ? 0.08 : 0,
              }}
            />

            <AnimatePresence>
              {opened && (
                <motion.div
                  key="sweep"
                  initial={{ opacity: 0, x: -90 }}
                  animate={{ opacity: 0.35, x: 90 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.95,
                    ease: "easeInOut",
                    delay: 0.05,
                  }}
                  className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 h-full w-24 rotate-12 blur-xl"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(247,201,94,0) 0%, rgba(247,201,94,0.55) 50%, rgba(247,201,94,0) 100%)",
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.button>

        {/* POLAROID (once) rises + floats + fades out */}
        <AnimatePresence mode="wait">
          {phase === "polaroid" && (
            <motion.div
              key="polaroid-once"
              className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, y: 30, scale: 0.85, rotate: -10 }}
              animate={{ opacity: 1, y: -175, scale: 1, rotate: -4 }}
              exit={{ opacity: 0, y: -210, scale: 0.98, rotate: -6 }}
              transition={{ type: "spring", stiffness: 170, damping: 16 }}
            >
              <PolaroidCard src={polaroidImg} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CHOICE CARD (always responsive) */}
      <AnimatePresence>
        {phase === "choice" && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-10 w-full max-w-xl rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 text-center shadow-lg"
          >
            <p className="text-xl sm:text-2xl font-semibold">
              Will you be my partner this Heart’s Day? 💛
            </p>

            {/* Before NO escapes: aligned row */}
            {!noEscaping ? (
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <motion.button
                  onClick={onYes}
                  className="rounded-2xl bg-[#F7C95E] px-6 py-3 font-semibold text-[#1B1642] hover:brightness-110 active:scale-[0.98] transition"
                  animate={{ scale: yesScale }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                >
                  YES 💛
                </motion.button>

                <button
                  onClick={onNo}
                  className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 hover:bg-white/10 active:scale-[0.98] transition"
                >
                  NO 🙂
                </button>
              </div>
            ) : (
              // After escape starts: YES stays centered in card
              <div className="mt-6 flex justify-center">
                <motion.button
                  onClick={onYes}
                  className="rounded-2xl bg-[#F7C95E] px-6 py-3 font-semibold text-[#1B1642] hover:brightness-110 active:scale-[0.98] transition"
                  animate={{ scale: yesScale }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                >
                  YES 💛
                </motion.button>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={resetAll}
                className="text-sm text-white/70 hover:text-white transition"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NO teleports across the viewport AFTER first click (fully responsive + safe) */}
      <AnimatePresence>
        {phase === "choice" && noEscaping && (
          <motion.button
            ref={noBtnRef}
            key="no-escape"
            onClick={onNo}
            className="fixed z-[999] rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3 hover:bg-white/15 active:scale-[0.98] transition"
            style={{ left: noXY.x, top: noXY.y }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            NO 🙂
          </motion.button>
        )}
      </AnimatePresence>

      {/* optional takeover glow when YES gets huge */}
      <AnimatePresence>
        {phase === "choice" && yesScale >= 6 && (
          <motion.div
            className="fixed inset-0 z-[998] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(247,201,94,0.22), rgba(0,0,0,0) 55%)",
              }}
              animate={{ opacity: [0.5, 0.85, 0.55] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 text-white/70 text-sm">
        <p>— From: Rhen</p>
      </div>
    </section>
  );
}
