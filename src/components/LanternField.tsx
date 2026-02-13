import { useState } from "react";

type Lantern = {
  id: number;
  left: number;
  size: number;
  dur: number;
  delay: number;
  opacity: number;
};

function makeLanterns(count: number): Lantern[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 8 + Math.random() * 16,
    dur: 12 + Math.random() * 12,
    delay: Math.random() * 8,
    opacity: 0.2 + Math.random() * 0.4,
  }));
}

export default function LanternField() {
  // initializer runs ONCE (mount), not on every render → passes purity rule
  const [lanterns] = useState<Lantern[]>(() => makeLanterns(28));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {lanterns.map((l) => (
        <div
          key={l.id}
          className="absolute -bottom-10 rounded-full blur-[1px]"
          style={{
            left: `${l.left}%`,
            width: l.size,
            height: l.size,
            opacity: l.opacity,
            background: "rgba(247,201,94,1)",
            animation: `floatUp ${l.dur}s linear ${l.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
