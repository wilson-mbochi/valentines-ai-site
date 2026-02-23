"use client";

import { motion } from "framer-motion";

interface CupidGraphicProps {
  side?: "left" | "right";
  className?: string;
}

export function CupidGraphic({ side = "left", className = "" }: CupidGraphicProps) {
  const isLeft = side === "left";

  return (
    <motion.div
      className={`absolute top-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none ${isLeft ? "left-4 sm:left-8 lg:left-16" : "right-4 sm:right-8 lg:right-16"} ${!isLeft ? "scale-x-[-1]" : ""} ${className}`}
      animate={{
        y: [0, -12, 0],
        rotate: isLeft ? [-3, 3, -3] : [3, -3, 3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-lg"
        style={{ filter: "drop-shadow(0 0 12px rgba(251, 113, 133, 0.4))" }}
      >
        {/* Wings */}
        <motion.g
          animate={{ scaleX: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50px 50px" }}
        >
          <path
            d="M30 45 Q15 35 20 25 Q25 20 35 30 Q40 40 30 45"
            fill="rgba(251, 207, 232, 0.9)"
            stroke="rgba(251, 113, 133, 0.5)"
            strokeWidth="1"
          />
          <path
            d="M70 45 Q85 35 80 25 Q75 20 65 30 Q60 40 70 45"
            fill="rgba(251, 207, 232, 0.9)"
            stroke="rgba(251, 113, 133, 0.5)"
            strokeWidth="1"
          />
        </motion.g>

        {/* Body */}
        <ellipse cx="50" cy="58" rx="14" ry="18" fill="rgba(254, 226, 226, 0.95)" />

        {/* Head */}
        <circle cx="50" cy="32" r="16" fill="rgba(254, 226, 226, 0.95)" />

        {/* Bow */}
        <motion.path
          d="M35 25 Q25 35 30 50 Q35 65 45 55"
          fill="none"
          stroke="rgba(251, 113, 133, 0.9)"
          strokeWidth="4"
          strokeLinecap="round"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M65 25 Q75 35 70 50 Q65 65 55 55"
          fill="none"
          stroke="rgba(251, 113, 133, 0.9)"
          strokeWidth="4"
          strokeLinecap="round"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Arrow */}
        <line
          x1="50"
          y1="45"
          x2="50"
          y2="75"
          stroke="rgba(251, 113, 133, 0.8)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <polygon
          points="50,78 47,72 53,72"
          fill="rgba(251, 113, 133, 0.9)"
        />

        {/* Heart */}
        <motion.path
          d="M50 15 C45 10 38 12 38 18 C38 24 50 30 50 30 C50 30 62 24 62 18 C62 12 55 10 50 15"
          fill="rgba(244, 63, 94, 0.9)"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50px 22px" }}
        />

        {/* Face - eyes */}
        <ellipse cx="45" cy="30" rx="2" ry="2.5" fill="rgba(120, 53, 15, 0.8)" />
        <ellipse cx="55" cy="30" rx="2" ry="2.5" fill="rgba(120, 53, 15, 0.8)" />
        {/* Blush */}
        <ellipse cx="40" cy="36" rx="4" ry="2" fill="rgba(251, 113, 133, 0.3)" />
        <ellipse cx="60" cy="36" rx="4" ry="2" fill="rgba(251, 113, 133, 0.3)" />
      </svg>
    </motion.div>
  );
}
