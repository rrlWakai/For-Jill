import RealisticLotus from "../components/RealisticLotus";

export default function Home() {
  return (
    <main className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:py-20 text-center">
      <div className="mx-auto max-w-2xl">
        <p className="text-white/70 text-sm tracking-widest uppercase">
          For Jillian
        </p>

        <h1 className="brand-script text-5xl sm:text-6xl leading-tight mt-2">
          My Nabi 🦋
        </h1>

        <p className="mt-5 text-white/80">
          I made this Tangled-inspired little world… just for you.
        </p>

        <p className="mt-3 text-white/65 text-sm">
          (Tap the lotus when you’re ready ✨)
        </p>
      </div>

      <RealisticLotus />
    </main>
  );
}
