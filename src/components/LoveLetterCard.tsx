import { motion } from "framer-motion";

export default function LoveLetterCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="
        mx-auto w-full max-w-3xl
        rounded-3xl border border-white/15
        bg-white/10 backdrop-blur-md
        shadow-2xl
        px-5 py-7
        sm:px-8 sm:py-10
        md:px-10
      "
    >
      <h1
        className="
          brand-script text-center
          text-4xl leading-tight
          sm:text-5xl sm:leading-tight
          md:text-6xl
          mb-6 sm:mb-8
        "
      >
        To My Nabi
      </h1>

      <div
        className="
          space-y-4 sm:space-y-6
          text-white/85
          leading-relaxed
          text-[14px]
          sm:text-[15px]
          md:text-base
        "
      >
        <p className="text-white/90">Jillian,</p>

        <p>
          I’m honestly so thankful for you, Nabii, especially for your laugh,
          your softness, and the way you make everything feel lighter without
          even trying. Nabii, being around you just feels calm, warm, and safe.
        </p>

        <p>
          You’re so gorgeous, Nabii. Not just because of how you look. you’re
          beautiful inside and outside — but because of how kind you are and how
          you carry yourself. Nabii, there’s something about you that makes
          everything feel a little more magical.
        </p>

        <p>
          Happy Heart’s Day, Nabii. I just want you to know that what I feel for
          you is real and sincere, kiddy. Nabii, I truly love you and I also
          want to spend more time with you. You’re so special, you’re important,
          and you really matter to me, Nabii.
        </p>

        <p>
          Thank you for every moment, every smile, and every conversation we’ve
          shared, Nabii. More than anything, I’m grateful to have you in my
          life, Nabii.
        </p>

        <p>
          Happy Heart’s Day, Nabii! More Heart’s Days to come for us, Nabii.
        </p>

        <p className="text-white/90">
          Nabii, I truly love you — with all of my heart, nabii.
        </p>

        <p className="text-right mt-6 sm:mt-8 text-white/80">— Ren</p>
      </div>
    </motion.div>
  );
}
