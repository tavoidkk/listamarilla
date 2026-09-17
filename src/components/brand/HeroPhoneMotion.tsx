"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HeroPhoneMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const progress = Math.max(
          -1,
          Math.min(1, (window.innerHeight * 0.55 - rect.top) / window.innerHeight),
        );
        el.style.setProperty("--phone-shift", `${Math.round(progress * -24)}px`);
        el.style.setProperty("--phone-tilt", `${(progress * -2).toFixed(2)}deg`);
        el.style.setProperty("--screen-shift", `${Math.round(Math.max(0, progress) * -18)}px`);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} className="hero-phone-motion relative">
      {children}
    </div>
  );
}
