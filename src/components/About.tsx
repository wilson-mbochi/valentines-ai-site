"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          className="font-display text-3xl sm:text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          About Eiish
        </motion.h2>
        <motion.p
          className="text-lg text-zinc-400 leading-relaxed"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          We believe every Valentine&apos;s Day deserves something special. Our AI-powered
          tools help you create personalized messages, discover thoughtful ideas,
          and add a touch of magic to your celebrations.
        </motion.p>
      </div>
    </section>
  );
}
