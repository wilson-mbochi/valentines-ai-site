"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Lightbulb, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { StarsBackground } from "@/components/StarsBackground";
type Tool = "messages" | "ideas" | "creative";

export function DemoPage() {
  const [activeTool, setActiveTool] = useState<Tool>("messages");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>("");

  // Form state
  const [partnerName, setPartnerName] = useState("");
  const [relationshipType, setRelationshipType] = useState("partner");
  const [tone, setTone] = useState("romantic");
  const [hint, setHint] = useState("");
  const [interests, setInterests] = useState("");
  const [budget, setBudget] = useState("moderate");
  const [contentType, setContentType] = useState("poem");
  const [style, setStyle] = useState("classic");

  const handleGenerate = async () => {
    setLoading(true);
    setOutput("");

    try {
      const endpoint =
        activeTool === "messages"
          ? "/api/demo/messages"
          : activeTool === "ideas"
            ? "/api/demo/ideas"
            : "/api/demo/creative";

      const body =
        activeTool === "messages"
          ? { partnerName, relationshipType, tone, hint }
          : activeTool === "ideas"
            ? { interests, budget }
            : { contentType, style, partnerName };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setOutput(data.error || data.message || "Something went wrong.");
        return;
      }
      setOutput(data.content || data.message || "Something went wrong.");
    } catch {
      setOutput("Unable to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tools: { id: Tool; label: string; icon: typeof MessageCircle }[] = [
    { id: "messages", label: "Personalized Messages", icon: MessageCircle },
    { id: "ideas", label: "Thoughtful Ideas", icon: Lightbulb },
    { id: "creative", label: "Creative Magic", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-[#0c0a0f]">
      <StarsBackground />
      <Header />
      <div className="pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
            Try the Magic :)
          </h1>
          <p className="text-zinc-400 mb-4">
            Generate personalized content for your Valentine&apos;s Day. Choose a tool below.
          </p>
          <p className="text-sm text-zinc-500 mb-10">
            Add your OpenAI or Google/Gemini API key in{" "}
            <Link href="/settings" className="text-rose-400 hover:text-rose-300">
              Settings
            </Link>{" "}
            for AI-powered generation. Without a key, you&apos;ll get template content.
          </p>

          {/* Tool tabs */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mb-10">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id);
                  setOutput("");
                }}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all w-full sm:w-auto ${
                  activeTool === tool.id
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <tool.icon className="w-4 h-4" />
                {tool.label}
              </button>
            ))}
          </div>

          {/* Forms */}
          <div className="space-y-8">
            {activeTool === "messages" && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Partner&apos;s name
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Relationship
                  </label>
                  <select
                    value={relationshipType}
                    onChange={(e) => setRelationshipType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  >
                    <option value="partner">Partner / Significant other</option>
                    <option value="friend">Friend</option>
                    <option value="crush">Crush</option>
                    <option value="family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  >
                    <option value="romantic">Romantic</option>
                    <option value="playful">Playful</option>
                    <option value="sweet">Sweet</option>
                    <option value="heartfelt">Heartfelt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Any hints? (optional)
                  </label>
                  <textarea
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    placeholder="e.g. We love hiking, inside jokes about coffee..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                  />
                </div>
              </motion.div>
            )}

            {activeTool === "ideas" && (
              <motion.div
                key="ideas"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Partner&apos;s interests
                  </label>
                  <textarea
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g. Art, cooking, travel, cozy nights in..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Budget
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  >
                    <option value="budget">Budget-friendly</option>
                    <option value="moderate">Moderate</option>
                    <option value="splurge">Splurge</option>
                  </select>
                </div>
              </motion.div>
            )}

            {activeTool === "creative" && (
              <motion.div
                key="creative"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Recipient&apos;s name
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Content type
                  </label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  >
                    <option value="poem">Poem</option>
                    <option value="letter">Love letter</option>
                    <option value="message">Short message</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  >
                    <option value="classic">Classic</option>
                    <option value="modern">Modern</option>
                    <option value="playful">Playful</option>
                    <option value="poetic">Poetic</option>
                  </select>
                </div>
              </motion.div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate
              </>
            )}
          </button>

          {output && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 max-h-[60vh] overflow-y-auto min-w-0 w-full max-w-full"
            >
              <h3 className="font-display text-lg font-semibold text-white mb-3">
                Result
              </h3>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                {output}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
    </div>
  );
}
