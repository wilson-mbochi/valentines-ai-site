"use client";

import { motion } from "framer-motion";

const stars = [
  { top: "10%", left: "15%", size: 2, delay: 0, opacity: 0.45 },
  { top: "20%", left: "85%", size: 1, delay: 0.5, opacity: 0.3 },
  { top: "35%", left: "25%", size: 2, delay: 1, opacity: 0.4 },
  { top: "45%", left: "70%", size: 1, delay: 0.2, opacity: 0.35 },
  { top: "60%", left: "10%", size: 2, delay: 0.8, opacity: 0.25 },
  { top: "70%", left: "90%", size: 1, delay: 0.4, opacity: 0.2 },
  { top: "80%", left: "40%", size: 2, delay: 0.6, opacity: 0.3 },
  { top: "25%", left: "55%", size: 1, delay: 0.3, opacity: 0.35 },
  { top: "55%", left: "45%", size: 1, delay: 0.7, opacity: 0.2 },
];

export function StarsBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            boxShadow: `0 0 ${star.size * 4}px ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`,
          }}
          animate={{
            opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
          }}
          transition={{
            duration: 2 + (i % 3),
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
