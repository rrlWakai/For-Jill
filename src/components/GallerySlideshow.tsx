import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Slide = { src: string; alt?: string };

type Spark = {
  id: number;
  left: number; // %
  size: number; // px
  dur: number; // s
  delay: number; // s
  opacity: number;
  drift: number; // px
};

function makeSparks(count = 18): Spark[] {
  return Array.from({ length: count }).map((_, id) => ({
    id,
    left: Math.random() * 100,
    size: 6 + Math.random() * 14,
    dur: 6 + Math.random() * 8,
    delay: Math.random() * 3,
    opacity: 0.18 + Math.random() * 0.35,
    drift: 18 + Math.random() * 26,
  }));
}

type Stage = "slideshow" | "theEnd" | "goodnight" | "closing";

export default function GallerySlideshow({
  slides,
  slideMs = 5000, // ✅ each image = 5 seconds
  endHoldMs = 4200,
  goodnightHoldMs = 4200,
}: {
  slides: Slide[]; // ✅ should be 3 slides
  slideMs?: number;
  endHoldMs?: number;
  goodnightHoldMs?: number;
}) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stage, setStage] = useState<Stage>("slideshow");

  const sparks = useMemo(() => makeSparks(18), []);
  const touchStartX = useRef<number | null>(null);

  const limitedSlides = useMemo(() => slides.slice(0, 3), [slides]); // ✅ only use first 3
  const hasSlides = limitedSlides.length > 0;
  const current = hasSlides ? limitedSlides[i] : null;

  const next = () => {
    if (!hasSlides) return;

    // if last slide, go to The End
    if (i >= limitedSlides.length - 1) {
      setStage("theEnd");
      return;
    }
    setI((prev) => prev + 1);
  };

  const prev = () => {
    if (!hasSlides) return;
    setI((prev) => Math.max(0, prev - 1));
  };

  // autoplay slideshow (5 seconds per image)
  useEffect(() => {
    if (limitedSlides.length <= 1) return;
    if (paused) return;
    if (stage !== "slideshow") return;

    const t = window.setInterval(() => next(), slideMs);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limitedSlides.length, paused, stage, slideMs, i]);

  // if slides change, clamp index
  useEffect(() => {
    if (i >= limitedSlides.length) setI(0);
  }, [limitedSlides.length, i]);

  // The End -> Goodnight
  useEffect(() => {
    if (stage !== "theEnd") return;
    const t = window.setTimeout(() => setStage("goodnight"), endHoldMs);
    return () => window.clearTimeout(t);
  }, [stage, endHoldMs]);

  // Goodnight -> Closing
  useEffect(() => {
    if (stage !== "goodnight") return;
    const t = window.setTimeout(() => setStage("closing"), goodnightHoldMs);
    return () => window.clearTimeout(t);
  }, [stage, goodnightHoldMs]);

  // attempt to close on closing stage
  useEffect(() => {
    if (stage !== "closing") return;
    const t = window.setTimeout(() => {
      try {
        window.close();
      } catch {
        // ignore
      }
    }, 900);
    return () => window.clearTimeout(t);
  }, [stage]);

  const imgMotion = useMemo(() => {
    if (reduce) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.35, ease: "easeOut" as const },
      };
    }
    return {
      initial: { opacity: 0, scale: 1.03 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.02 },
      transition: { duration: 0.9, ease: "easeInOut" as const },
    };
  }, [reduce]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (stage !== "slideshow") return;

    const startX = touchStartX.current;
    const endX = e.changedTouches[0]?.clientX ?? null;
    touchStartX.current = null;

    if (startX == null || endX == null) return;
    const dx = endX - startX;
    if (Math.abs(dx) < 40) return;

    if (dx < 0) next();
    else prev();
  };

  return (
    <section className="mt-10 w-full">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="brand-script text-center text-3xl sm:text-4xl md:text-5xl mb-5 sm:mb-6">
          Our Memories ✨
        </h2>

        {/* Polaroid / Film frame wrapper */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply">
            <div className="h-full w-full bg-[radial-gradient(circle,rgba(0,0,0,0.35)_1px,transparent_1px)] [background-size:18px_18px]" />
          </div>

          <div
            className="relative m-3 sm:m-4 overflow-hidden rounded-2xl border border-black/10 bg-black/5"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              className="relative aspect-[4/5] sm:aspect-[16/11] md:aspect-[16/9] bg-black/10"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <AnimatePresence mode="wait">
                {/* SLIDESHOW */}
                {stage === "slideshow" && current && (
                  <motion.img
                    key={current.src}
                    src={current.src}
                    alt={current.alt ?? "Gallery image"}
                    className="absolute inset-0 h-full w-full object-cover select-none"
                    draggable={false}
                    {...imgMotion}
                  />
                )}

                {/* THE END */}
                {stage === "theEnd" && (
                  <motion.div
                    key="theEnd"
                    className="absolute inset-0 grid place-items-center text-center px-6"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 45%, rgba(247,201,94,0.25), transparent 60%), linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.72))",
                      }}
                    />
                    <div className="relative z-10">
                      <motion.p
                        className="brand-script text-5xl sm:text-6xl"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        The End
                      </motion.p>
                      <motion.p
                        className="mt-4 text-white/90 text-base sm:text-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut",
                          delay: 0.15,
                        }}
                      >
                        Happy Heart’s Day, Nabii 💛
                      </motion.p>
                    </div>
                  </motion.div>
                )}

                {/* GOODNIGHT */}
                {stage === "goodnight" && (
                  <motion.div
                    key="goodnight"
                    className="absolute inset-0 grid place-items-center text-center px-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.0, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-black" />
                    <div className="relative z-10">
                      <p className="brand-script text-5xl sm:text-6xl text-white">
                        Nightyy, Nabii 🌙
                      </p>
                      <p className="mt-4 text-white/75 text-sm sm:text-base">
                        I will always choose you, nabii, now and forever.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* CLOSING */}
                {stage === "closing" && (
                  <motion.div
                    key="closing"
                    className="absolute inset-0 grid place-items-center text-center px-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-black" />
                    <div className="relative z-10">
                      <p className="text-white/90 text-sm sm:text-base">
                        Bye byee, nabii!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* overlays while slideshow/theEnd */}
              {(stage === "slideshow" || stage === "theEnd") && (
                <>
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.42) 100%)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute -inset-10 blur-3xl opacity-60"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(247,201,94,0.18) 0%, rgba(245,167,199,0.10) 45%, transparent 70%)",
                    }}
                  />
                </>
              )}

              {/* Lantern sparkle particles (only during slideshow) */}
              {!reduce && stage === "slideshow" && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {sparks.map((s) => (
                    <motion.span
                      key={s.id}
                      className="absolute -bottom-6 rounded-full"
                      style={{
                        left: `${s.left}%`,
                        width: s.size,
                        height: s.size,
                        opacity: s.opacity,
                        background:
                          "radial-gradient(circle, rgba(247,201,94,0.95) 0%, rgba(245,167,199,0.55) 35%, rgba(255,255,255,0) 70%)",
                      }}
                      animate={{
                        y: [-10, -420],
                        x: [0, s.drift, 0],
                        opacity: [0, s.opacity, 0],
                        scale: [0.9, 1.15, 0.95],
                      }}
                      transition={{
                        duration: s.dur,
                        repeat: Infinity,
                        delay: s.delay,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Dots only during slideshow */}
            {stage === "slideshow" && (
              <>
                <div className="flex items-center justify-center gap-2 sm:gap-2.5 py-4 sm:py-5 bg-white">
                  {limitedSlides.map((_, idx) => {
                    const active = idx === i;
                    return (
                      <button
                        key={idx}
                        onClick={() => setI(idx)}
                        className={`
                          rounded-full transition
                          ${active ? "bg-[#F7C95E]" : "bg-black/20 hover:bg-black/30"}
                          h-3 w-3 sm:h-2.5 sm:w-2.5
                        `}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    );
                  })}
                </div>

                <p className="pb-4 text-center text-xs text-black/50 md:hidden bg-white">
                  Swipe left/right to browse
                </p>
              </>
            )}

            {/* Polaroid bottom space */}
            <div className="bg-white px-5 py-5 sm:px-7 sm:py-6">
              <p className="brand-script text-xl sm:text-2xl text-center text-[#1B1642]">
                Nabii 💛
              </p>
              <p className="mt-1 text-center text-xs sm:text-sm text-[#1B1642]/70">
                A little gallery of us — more moments to come ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
