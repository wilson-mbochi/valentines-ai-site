"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer id="contact" className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <motion.div
        className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="text-zinc-400 text-sm">
          Made with <span className="text-rose-400">❤️</span>
        </p>
        <div className="flex gap-8">
          <a
            href="#"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Terms
          </a>
        </div>
      </motion.div>
    </footer>
  );
}
