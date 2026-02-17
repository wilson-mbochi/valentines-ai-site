import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUserApiKey } from "@/lib/get-user-api-key";
import { generateWithGemini } from "@/lib/generate-with-gemini";
import { withRetryOn429 } from "@/lib/openai-retry";
import type { GeminiModelId } from "@/lib/gemini-models";

async function generateWithOpenAI(
  apiKey: string,
  partnerName: string,
  relationshipType: string,
  tone: string,
  hint: string
): Promise<string> {
  const openai = new OpenAI({ apiKey });
  const name = partnerName || "your special someone";

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a thoughtful Valentine's Day message writer. Create a personalized, heartfelt message. 
Keep it concise (2-4 short paragraphs). Put a blank line between each paragraph. Match the requested tone. 
${hint ? `Incorporate or reference these details: ${hint}` : ""}`,
      },
      {
        role: "user",
        content: `Write a Valentine's message for ${name}. Relationship: ${relationshipType}. Tone: ${tone}.`,
      },
    ],
    max_tokens: 800,
  });

  return res.choices[0]?.message?.content?.trim() ?? "";
}

/** Insert paragraph breaks when model returns content on one line */
function formatMessagesContent(content: string): string {
  if (!content.trim()) return content;
  if (content.includes("\n\n")) return content; // Already has paragraph breaks
  return content.replace(/\.\s+([A-Z])/g, (_match, letter: string, offset: number) => {
    const before = content.slice(0, offset);
    const lastBreak = before.lastIndexOf("\n\n");
    const segmentStart = lastBreak === -1 ? 0 : lastBreak + 2;
    const segmentLen = offset - segmentStart;
    return segmentLen > 60 ? `.\n\n${letter}` : `. ${letter}`;
  });
}

function getTemplateContent(
  partnerName: string,
  relationshipType: string,
  tone: string,
  hint: string
): string {
  const name = partnerName || "your special someone";
  const toneText =
    tone === "romantic"
      ? "romantic and heartfelt"
      : tone === "playful"
        ? "playful and fun"
        : tone === "sweet"
          ? "sweet and tender"
          : "deeply heartfelt";

  return `To ${name},

On this Valentine's Day, I wanted to tell you how much you mean to me. Every moment we share feels like a gift, and I'm grateful for the ${toneText} connection we have.

${hint ? `(Inspired by: ${hint})\n\n` : ""}You make ordinary days extraordinary. Here's to many more adventures together.

With love,
Your Valentine`;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { partnerName, relationshipType, tone, hint, geminiModel } = await request.json();

    const name = partnerName || "your special someone";
    const relationship = relationshipType || "partner";
    const toneVal = tone || "romantic";
    const hintVal = hint || "";
    const systemPrompt = `You are a thoughtful Valentine's Day message writer. Create a personalized, heartfelt message. 
Keep it concise (2-4 short paragraphs). Put a blank line between each paragraph. Match the requested tone. 
${hintVal ? `Incorporate or reference these details: ${hintVal}` : ""}`;
    const userPrompt = `Write a Valentine's message for ${name}. Relationship: ${relationship}. Tone: ${toneVal}.`;

    const googleKey = await getUserApiKey("google");
    if (googleKey) {
      try {
        const content = await generateWithGemini(
          googleKey,
          systemPrompt,
          userPrompt,
          800,
          geminiModel as GeminiModelId | undefined
        );
        if (content) return NextResponse.json({ content: formatMessagesContent(content) });
      } catch (err: unknown) {
        console.error("Gemini:", err instanceof Error ? err.message : "Error");
      }
    }

    const openaiKey = await getUserApiKey("openai");
    if (openaiKey) {
      try {
        const content = await withRetryOn429(() =>
          generateWithOpenAI(
            openaiKey.trim(),
            name,
            relationship,
            toneVal,
            hintVal
          )
        );
        if (content) return NextResponse.json({ content: formatMessagesContent(content) });
      } catch (err: unknown) {
        console.error("OpenAI:", err instanceof Error ? err.message : "Error");
      }
    }

    const content = getTemplateContent(
      name,
      relationship,
      toneVal,
      hintVal
    );
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { message: "Failed to generate message" },
      { status: 500 }
    );
  }
}
