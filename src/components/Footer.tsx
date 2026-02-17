"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <motion.div
        className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-zinc-500 text-sm flex items-center gap-1">
          Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for
          Valentine&apos;s
        </p>
        <div className="flex gap-6 text-sm text-zinc-500">
          <a href="#" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a>
        </div>
      </motion.div>
    </footer>
  );
}
