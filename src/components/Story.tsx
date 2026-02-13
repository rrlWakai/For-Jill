import { Link } from "react-router-dom";

export default function Story() {
  return (
    <main className="relative z-10 mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="brand-script text-5xl sm:text-6xl">Our Story ✨</h1>
      <p className="mt-5 text-white/80 leading-relaxed">
        (Put your story content here — like “I’ve been wanting to ask you…” then
        your planned date/time, etc.)
      </p>

      <div className="mt-10">
        <Link
          to="/"
          className="inline-flex rounded-2xl border border-white/20 bg-white/5 px-5 py-3 hover:bg-white/10 transition"
        >
          Back
        </Link>
      </div>
    </main>
  );
}
