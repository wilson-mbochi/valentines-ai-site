import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUserApiKey } from "@/lib/get-user-api-key";
import { generateWithGemini } from "@/lib/generate-with-gemini";
import { withRetryOn429 } from "@/lib/openai-retry";
import type { GeminiModelId } from "@/lib/gemini-models";

async function generateWithOpenAI(
  apiKey: string,
  contentType: string,
  style: string,
  partnerName: string
): Promise<string> {
  const openai = new OpenAI({ apiKey });
  const name = partnerName || "you";

  const typePrompt =
    contentType === "poem"
      ? "Write a short, heartfelt poem"
      : contentType === "letter"
        ? "Write a love letter"
        : "Write a short, sweet message";

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a romantic writer. ${typePrompt} for someone named ${name}. 
Style: ${style}. Keep it genuine and personal. 
For poems: 2-3 stanzas. For letters: 2-4 paragraphs. For messages: 1-2 short paragraphs.`,
      },
      {
        role: "user",
        content: `Create ${contentType} for ${name} in a ${style} style.`,
      },
    ],
    max_tokens: 500,
  });

  return res.choices[0]?.message?.content?.trim() ?? "";
}

function getTemplateContent(
  contentType: string,
  partnerName: string
): string {
  const name = partnerName || "you";

  return contentType === "poem"
    ? `Roses for ${name}

Roses red, violets blue,
Every day I think of you.
Your smile, your laugh, your gentle way,
Make ordinary moments bright as day.

On this Valentine's, I'm here to say
You light up my life in every way.
With love, today and always.`
    : contentType === "letter"
      ? `Dear ${name},

I'm writing this because sometimes words spoken aloud don't capture everything. I want you to know how much you mean to me.

You've brought so much joy into my life. The little things—the way you laugh, the way you care when I'm tired, the way you make every day feel like an adventure—they add up to something extraordinary.

This Valentine's Day, I'm celebrating you. Not just today, but every day we get to share together.

With all my love`
      : `Hey ${name},

Just wanted you to know—you're amazing. Today and every day. Happy Valentine's! ❤️`;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contentType, style, partnerName, geminiModel } = await request.json();
    const contentTypeVal = contentType || "poem";
    const styleVal = style || "classic";
    const name = partnerName || "you";
    const typePrompt =
      contentTypeVal === "poem"
        ? "Write a short, heartfelt poem"
        : contentTypeVal === "letter"
          ? "Write a love letter"
          : "Write a short, sweet message";
    const systemPrompt = `You are a romantic writer. ${typePrompt} for someone named ${name}. 
Style: ${styleVal}. Keep it genuine and personal. 
For poems: 2-3 stanzas. For letters: 2-4 paragraphs. For messages: 1-2 short paragraphs.`;
    const userPrompt = `Create ${contentTypeVal} for ${name} in a ${styleVal} style.`;

    const googleKey = await getUserApiKey("google");
    if (googleKey) {
      try {
        const content = await generateWithGemini(
          googleKey,
          systemPrompt,
          userPrompt,
          500,
          geminiModel as GeminiModelId | undefined
        );
        if (content) return NextResponse.json({ content });
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
            contentTypeVal,
            styleVal,
            name
          )
        );
        return NextResponse.json({ content });
      } catch (err: unknown) {
        console.error("OpenAI:", err instanceof Error ? err.message : "Error");
      }
    }

    const content = getTemplateContent(
      contentTypeVal,
      name
    );
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { message: "Failed to generate content" },
      { status: 500 }
    );
  }
}
