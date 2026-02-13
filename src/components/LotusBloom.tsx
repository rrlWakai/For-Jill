import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function LotusBloom() {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<"yes" | "think" | null>(null);

  return (
    <section className="mx-auto max-w-5xl px-6 py-14">
      <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold">The Lotus Moment</h2>
        <p className="mt-2 text-white/75">
          Tap the lotus to reveal something I’ve been wanting to ask.
        </p>

        <div className="mt-10 flex flex-col items-center">
          {/* Lotus button */}
          <motion.button
            onClick={() => setOpen(true)}
            className="relative h-40 w-40 sm:h-48 sm:w-48"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Open lotus"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-full blur-2xl bg-[#F7C95E]/25" />

            {/* Petals (simple shapes) */}
            <AnimatePresence>
              {!open ? (
                <motion.div
                  key="closed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="absolute inset-0 grid place-items-center"
                >
                  <div className="h-28 w-28 rounded-full bg-[#F5A7C7]/70 blur-[0px] opacity-90" />
                  <div className="absolute h-16 w-16 rounded-full bg-[#F7C95E]/70" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 grid place-items-center"
                >
                  {/* fake petals as rotating blobs */}
                  {[0, 1, 2, 3, 4, 5].map((k) => (
                    <motion.div
                      key={k}
                      initial={{ rotate: k * 60, scale: 0.8, opacity: 0 }}
                      animate={{ rotate: k * 60, scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 12,
                        delay: 0.05 * k,
                      }}
                      className="absolute h-28 w-12 rounded-full bg-[#F5A7C7]/70"
                      style={{ transformOrigin: "50% 90%" }}
                    />
                  ))}
                  <div className="absolute h-16 w-16 rounded-full bg-[#F7C95E]/80" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Question card */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.5 }}
                className="mt-8 w-full max-w-xl rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 text-center"
              >
                <p className="text-xl sm:text-2xl font-semibold">
                  Will you be my partner this Heart’s Day? 💛
                </p>

                {answer === null ? (
                  <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={() => setAnswer("yes")}
                      className="rounded-2xl bg-[#F7C95E] px-5 py-3 font-semibold text-[#1B1642] hover:brightness-110 transition"
                    >
                      Yes 💛
                    </button>
                    <button
                      onClick={() => setAnswer("think")}
                      className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 hover:bg-white/10 transition"
                    >
                      Let me think 🌸
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 text-white/85">
                    {answer === "yes" ? (
                      <p>Yay! I’ll make it a day you’ll remember ✨</p>
                    ) : (
                      <p>No pressure. The lotus will wait for you 🌸</p>
                    )}
                  </div>
                )}

                <div className="mt-6">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setAnswer(null);
                    }}
                    className="text-sm text-white/70 hover:text-white transition"
                  >
                    Reset
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
