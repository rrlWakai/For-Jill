import { motion } from "framer-motion";

type PolaroidCardProps = {
  src: string;
  caption?: string;
  subcaption?: string;
};

export default function PolaroidCard({
  src,
  caption = "Our little moment 💛",
  subcaption = "like lanterns in the sky ✨",
}: PolaroidCardProps) {
  return (
    <motion.div
      initial={{ rotate: -8, scale: 0.98 }}
      animate={{
        rotate: [-8, -4, -6, -4],
        y: [0, -6, 0],
        scale: [0.98, 1, 0.995, 1],
      }}
      transition={{
        duration: 4.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative w-[280px] sm:w-[320px]"
    >
      {/* soft lantern glow */}
      <div
        className="pointer-events-none absolute -inset-12 rounded-full blur-3xl opacity-80"
        style={{
          background:
            "radial-gradient(circle, rgba(247,201,94,0.45) 0%, rgba(245,167,199,0.22) 45%, transparent 70%)",
        }}
      />

      {/* hanging string */}
      <div className="pointer-events-none absolute left-1/2 -top-8 h-8 w-[2px] -translate-x-1/2 bg-white/25" />
      <div className="pointer-events-none absolute left-1/2 -top-10 -translate-x-1/2 rotate-12">
        <div className="h-4 w-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm" />
      </div>

      {/* polaroid frame */}
      <div className="rounded-xl bg-white shadow-2xl shadow-black/60 overflow-hidden">
        <div className="p-3">
          <div className="overflow-hidden rounded-lg bg-black/5">
            <img
              src={src}
              alt="Polaroid memory"
              draggable={false}
              className="h-[240px] w-full object-cover brightness-[1.06] saturate-[1.1] contrast-[1.04]"
            />
          </div>

          <div className="pt-5 pb-4 text-center">
            <p className="brand-script text-2xl text-[#1B1642]">{caption}</p>
            <p className="mt-1 text-xs text-[#1B1642]/70">{subcaption}</p>
          </div>
        </div>
      </div>

      {/* tiny film grain overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply">
        <div className="h-full w-full bg-[radial-gradient(circle,rgba(0,0,0,0.25)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>
    </motion.div>
  );
}
