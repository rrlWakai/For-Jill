import { motion } from "framer-motion";

export default function Final() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55 }}
        className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md p-8 text-center"
      >
        <h3 className="text-2xl font-semibold">A little note</h3>
        <p className="mt-3 text-white/80 max-w-2xl mx-auto">
          Whatever your answer is, thank you for being you. 💛
          <br />
          (From: Rhen)
        </p>
      </motion.div>
    </section>
  );
}
