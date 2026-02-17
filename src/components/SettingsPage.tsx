"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Key, Loader2, Check, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { StarsBackground } from "@/components/StarsBackground";

const PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4, GPT-3.5 — used for messages, ideas, and creative content",
    placeholder: "sk-...",
    url: "https://platform.openai.com/api-keys",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude — alternative for creative writing",
    placeholder: "sk-ant-...",
    url: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "google",
    name: "Google AI",
    description: "Gemini — free tier available",
    placeholder: "AIza...",
    url: "https://aistudio.google.com/app/apikey",
  },
] as const;

type ProviderId = (typeof PROVIDERS)[number]["id"];

export function SettingsPage() {
  const [keys, setKeys] = useState<{ provider: ProviderId; hasKey: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<ProviderId | null>(null);
  const [deleting, setDeleting] = useState<ProviderId | null>(null);
  const [inputs, setInputs] = useState<Record<ProviderId, string>>({
    openai: "",
    anthropic: "",
    google: "",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testing, setTesting] = useState<ProviderId | null>(null);

  useEffect(() => {
    fetch("/api/api-keys")
      .then((res) => res.json())
      .then((data) => {
        if (data.keys) {
          setKeys(
            PROVIDERS.map((p) => ({
              provider: p.id,
              hasKey: data.keys.some((k: { provider: string }) => k.provider === p.id),
            }))
          );
        }
      })
      .catch(() => setMessage({ type: "error", text: "Failed to load API keys" }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (provider: ProviderId) => {
    const apiKey = inputs[provider]?.trim();
    if (!apiKey) {
      setMessage({ type: "error", text: "Please enter an API key" });
      return;
    }

    setSaving(provider);
    setMessage(null);

    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save");
      }

      setKeys((prev) =>
        prev.map((k) => (k.provider === provider ? { ...k, hasKey: true } : k))
      );
      setInputs((prev) => ({ ...prev, [provider]: "" }));
      setMessage({ type: "success", text: `${PROVIDERS.find((p) => p.id === provider)?.name} key saved` });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save API key",
      });
    } finally {
      setSaving(null);
    }
  };

  const handleTest = async (provider: ProviderId) => {
    const endpoint =
      provider === "openai"
        ? "/api/test-openai"
        : provider === "google"
          ? "/api/test-google"
          : null;
    if (!endpoint) {
      setMessage({ type: "error", text: "Test is only available for OpenAI and Google." });
      return;
    }
    setTesting(provider);
    setMessage(null);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Test failed");
      }
      setMessage({ type: "success", text: data.message || "API key works!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Test failed",
      });
    } finally {
      setTesting(null);
    }
  };

  const handleDelete = async (provider: ProviderId) => {
    setDeleting(provider);
    setMessage(null);

    try {
      const res = await fetch(`/api/api-keys?provider=${provider}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }

      setKeys((prev) =>
        prev.map((k) => (k.provider === provider ? { ...k, hasKey: false } : k))
      );
      setMessage({ type: "success", text: "API key removed" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete",
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a0f]">
      <StarsBackground />
      <Header />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              API Keys
            </h1>
            <p className="text-zinc-400 mb-10">
              Add your own API keys to use AI models. Your keys are encrypted and
              never shared. You pay only for what you use.
            </p>

            {message && (
              <div
                className={`mb-8 p-4 rounded-xl ${
                  message.type === "success"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}
              >
                {message.text}
              </div>
            )}

            {loading ? (
              <div className="flex items-center gap-2 text-zinc-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </div>
            ) : (
              <div className="space-y-8">
                {PROVIDERS.map((provider) => {
                  const hasKey = keys.find((k) => k.provider === provider.id)?.hasKey ?? false;
                  return (
                    <div
                      key={provider.id}
                      className="p-6 rounded-2xl border border-white/10 bg-white/5"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                            <Key className="w-4 h-4 text-rose-400" />
                            {provider.name}
                          </h2>
                          <p className="text-sm text-zinc-400 mt-1">
                            {provider.description}
                          </p>
                        </div>
                        {hasKey && (
                          <span className="flex items-center gap-1.5 text-sm text-emerald-400 shrink-0">
                            <Check className="w-4 h-4" />
                            Connected
                          </span>
                        )}
                      </div>

                      <div className="flex gap-3 mt-4">
                        <input
                          type="password"
                          value={inputs[provider.id]}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              [provider.id]: e.target.value,
                            }))
                          }
                          placeholder={provider.placeholder}
                          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                        />
                        <button
                          onClick={() => handleSave(provider.id)}
                          disabled={saving !== null}
                          className="px-5 py-3 rounded-xl bg-rose-500/20 text-rose-400 font-medium hover:bg-rose-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {saving === provider.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Save"
                          )}
                        </button>
                        {hasKey && (provider.id === "openai" || provider.id === "google") && (
                          <button
                            onClick={() => handleTest(provider.id)}
                            disabled={testing !== null}
                            className="px-5 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {testing === provider.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Test"
                            )}
                          </button>
                        )}
                        {hasKey && (
                          <button
                            onClick={() => handleDelete(provider.id)}
                            disabled={deleting !== null}
                            className="px-5 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {deleting === provider.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>

                      <a
                        href={provider.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-sm text-rose-400 hover:text-rose-300 transition-colors"
                      >
                        Get API key →
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="mt-10 text-sm text-zinc-500">
              Keys are encrypted and stored securely. We never see or log your
              keys. Add at least one key to use the AI tools on the demo page.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
