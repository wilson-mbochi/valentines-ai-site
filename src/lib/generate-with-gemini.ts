import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODELS, type GeminiModelId } from "./gemini-models";

const DEFAULT_MODEL: GeminiModelId = "gemini-3-flash-preview";

function isRateLimitError(err: unknown): boolean {
  if (err && typeof err === "object") {
    const e = err as {
      status?: number;
      statusCode?: number;
      code?: number;
      message?: string;
      error?: { code?: number };
    };
    if (e.status === 429 || e.statusCode === 429 || e.code === 429) return true;
    if (e.error?.code === 429) return true;
    const msg = String(e.message ?? "").toLowerCase();
    if (msg.includes("429") || msg.includes("too many requests") || msg.includes("resource exhausted"))
      return true;
  }
  return false;
}

export async function generateWithGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 500,
  model: GeminiModelId = DEFAULT_MODEL
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const maxRetries = 2;
  let lastError: unknown;
  const modelId = GEMINI_MODELS.some((m) => m.id === model) ? model : DEFAULT_MODEL;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: maxTokens,
        },
      });
      return response.text?.trim() ?? "";
    } catch (err) {
      lastError = err;
      if (isRateLimitError(err) && attempt < maxRetries) {
        const delay = 2000 * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
  throw lastError;
}
