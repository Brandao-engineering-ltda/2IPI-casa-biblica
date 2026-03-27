"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

/**
 * Buttery-smooth scroll-triggered fade-in wrapper using Framer Motion.
 *
 * Replaces the old CSS-based FadeInSection with spring-physics animations
 * for a fluid, Framer-style entrance effect.
 *
 * Props:
 *  - delay   : seconds before animation starts (default 0)
 *  - direction: "up" | "down" | "left" | "right" (default "up")
 *  - distance : px to travel (default 60)
 *  - scale   : initial scale multiplier (default 1, set to 0.97 for subtle zoom)
 *  - once    : only animate once (default true)
 *  - amount  : viewport % required to trigger (default 0.15)
 */

interface MotionFadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  scale?: number;
  once?: boolean;
  amount?: number;
}

const directionMap = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
};

const spring = {
  type: "spring" as const,
  stiffness: 100,
  damping: 22,
  mass: 0.5,
};

export function MotionFadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 60,
  scale = 1,
  once = true,
  amount = 0.15,
}: MotionFadeInProps) {
  const dir = directionMap[direction];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: dir.x * distance,
      y: dir.y * distance,
      scale,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { ...spring, delay },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
