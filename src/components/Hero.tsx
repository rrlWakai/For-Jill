import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-14 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-8 shadow-lg"
      >
        <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
          My lantern found its way to you.
        </h1>
        <p className="mt-3 text-white/80 max-w-2xl">
          I made this Tangled-inspired page with a lotus theme… because you’re
          special to me.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-2xl bg-[#F7C95E] px-5 py-3 font-semibold text-[#1B1642] shadow-md hover:brightness-110 active:scale-[0.98] transition">
            Light the lanterns ✨
          </button>
          <button className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-white/90 hover:bg-white/10 transition">
            Start the story →
          </button>
        </div>
      </motion.div>
    </section>
  );
}
