"use client";

import { motion } from "framer-motion";
import { MessageCircle, Gift, Wand2 } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Personalized Messages",
    description:
      "AI-crafted messages that capture your unique voice and emotions.",
  },
  {
    icon: Gift,
    title: "Thoughtful Ideas",
    description:
      "Discover gift ideas and date suggestions tailored to your loved one.",
  },
  {
    icon: Wand2,
    title: "Creative Magic",
    description:
      "Generate poems, playlists, and experiences that feel one-of-a-kind.",
  },
];

export function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            From the first message to the perfect surprise—AI assists every step.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-rose-500/30 hover:bg-white/10 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center mb-6 group-hover:from-rose-500/30 group-hover:to-pink-500/30 transition-colors">
                <feature.icon className="w-7 h-7 text-rose-400" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
