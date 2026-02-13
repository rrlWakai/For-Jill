import { motion } from "framer-motion";

export default function LanternTransition({
  phase,
}: {
  phase: "fly" | "open";
}) {
  return (
    <div className="relative h-[320px] sm:h-[380px] w-full grid place-items-center">
      {/* soft background glow */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(247,201,94,0.18), transparent 55%)",
        }}
      />

      {/* lantern body */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 120, scale: 0.65, rotate: -6 }}
        animate={
          phase === "fly"
            ? { opacity: 1, y: 0, scale: 1, rotate: -2 }
            : { opacity: 1, y: 0, scale: 1.02, rotate: 0 }
        }
        transition={{ type: "spring", stiffness: 150, damping: 16 }}
      >
        {/* lantern glow */}
        <motion.div
          className="pointer-events-none absolute -inset-10 rounded-full blur-3xl"
          initial={{ opacity: 0.25, scale: 0.9 }}
          animate={
            phase === "open"
              ? { opacity: [0.35, 0.95, 0.7], scale: [1, 1.35, 1.2] }
              : { opacity: 0.35, scale: 1 }
          }
          transition={{
            duration: phase === "open" ? 1.1 : 0.7,
            ease: "easeInOut",
            times: phase === "open" ? [0, 0.55, 1] : undefined,
          }}
          style={{
            background:
              "radial-gradient(circle, rgba(247,201,94,0.55) 0%, rgba(245,167,199,0.18) 45%, transparent 72%)",
          }}
        />

        {/* lantern shape (CSS) */}
        <div className="relative h-[170px] w-[120px] sm:h-[200px] sm:w-[140px]">
          {/* top cap */}
          <div className="absolute left-1/2 top-0 h-6 w-10 -translate-x-1/2 rounded-full bg-white/20 border border-white/20" />
          {/* body */}
          <div className="absolute left-1/2 top-5 -translate-x-1/2 h-[135px] w-[120px] sm:h-[160px] sm:w-[140px] rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_20px_80px_rgba(0,0,0,0.35)]" />
          {/* inner light */}
          <motion.div
            className="absolute left-1/2 top-8 -translate-x-1/2 h-[120px] w-[96px] sm:h-[140px] sm:w-[112px] rounded-2xl"
            animate={
              phase === "open" ? { opacity: [0.5, 1, 0.85] } : { opacity: 0.55 }
            }
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{
              background:
                "linear-gradient(180deg, rgba(247,201,94,0.75) 0%, rgba(247,201,94,0.35) 60%, rgba(0,0,0,0) 100%)",
              filter: "blur(0.3px)",
            }}
          />

          {/* opening burst (only when open) */}
          {phase === "open" && (
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[260px] w-[260px] rounded-full blur-2xl"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.9, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                background:
                  "radial-gradient(circle, rgba(247,201,94,0.35), transparent 70%)",
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
