"use client";

import { motion } from "framer-motion";
import { MessageCircle, Lightbulb, Sparkles } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Personalized Messages",
    description:
      "Craft heartfelt messages tailored to your relationship. AI helps you find the perfect words.",
  },
  {
    icon: Lightbulb,
    title: "Thoughtful Ideas",
    description:
      "Discover unique date ideas, gift suggestions, and experiences that match your partner's interests.",
  },
  {
    icon: Sparkles,
    title: "Creative Magic",
    description:
      "Generate poems, love letters, and creative content that feels authentic and personal.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-display text-3xl sm:text-4xl font-bold text-white text-center mb-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Why Choose Eiish?
        </motion.h2>
        <motion.p
          className="text-zinc-400 text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          Everything you need to make this Valentine&apos;s Day unforgettable.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="flex flex-row md:flex-col gap-6 md:gap-0 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors items-start md:items-stretch"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 * i }}
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-rose-500/20 flex items-center justify-center md:mb-6">
                <feature.icon className="w-6 h-6 text-rose-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
