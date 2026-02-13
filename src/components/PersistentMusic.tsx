import { useEffect, useRef } from "react";

type Props = {
  src: string;
  volume?: number; // 0..1
};

export default function PersistentMusic({ src, volume = 0.55 }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create once
    const a = new Audio(src);
    a.loop = true;
    a.preload = "auto";
    a.volume = volume;
    audioRef.current = a;

    const tryPlay = async () => {
      try {
        await a.play();
      } catch {
        // Autoplay likely blocked; will start on first user interaction
      }
    };

    // Attempt autoplay immediately
    tryPlay();

    // Fallback: start on first user interaction
    const onFirstInteract = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
      window.removeEventListener("touchstart", onFirstInteract);
    };

    window.addEventListener("pointerdown", onFirstInteract, { passive: true });
    window.addEventListener("touchstart", onFirstInteract, { passive: true });
    window.addEventListener("keydown", onFirstInteract);

    // Cleanup
    return () => {
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
      window.removeEventListener("touchstart", onFirstInteract);
      a.pause();
      audioRef.current = null;
    };
  }, [src, volume]);

  return null; // no toggle, no UI
}
