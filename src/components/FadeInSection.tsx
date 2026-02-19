"use client";

import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

export function FadeInSection({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useFadeInOnScroll(0.1);

  return (
    <div ref={ref} className={`fade-in-section ${isVisible ? "visible" : ""}`}>
      {children}
    </div>
  );
}
