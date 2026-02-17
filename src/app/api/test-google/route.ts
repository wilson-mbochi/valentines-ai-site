import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getUserApiKey } from "@/lib/get-user-api-key";
import { GEMINI_MODELS, type GeminiModelId } from "@/lib/gemini-models";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = await getUserApiKey("google");
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "No Google/Gemini API key found. Add one in Settings.",
        },
        { status: 400 }
      );
    }

    let model: GeminiModelId = "gemini-3-flash-preview";
    try {
      const body = (await request.json().catch(() => ({}))) as { geminiModel?: string };
      if (body?.geminiModel && GEMINI_MODELS.some((m) => m.id === body.geminiModel)) {
        model = body.geminiModel as GeminiModelId;
      }
    } catch {
      // use default
    }

    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    const response = await ai.models.generateContent({
      model,
      contents: "Say 'OK' only.",
      config: { maxOutputTokens: 5 },
    });

    if (response.text?.trim()) {
      return NextResponse.json({ success: true, message: "API key works!" });
    }
    return NextResponse.json({ error: "Empty response from Gemini" }, { status: 500 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
