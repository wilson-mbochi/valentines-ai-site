import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUserApiKey } from "@/lib/get-user-api-key";
import { generateWithGemini } from "@/lib/generate-with-gemini";
import { withRetryOn429 } from "@/lib/openai-retry";
import type { GeminiModelId } from "@/lib/gemini-models";

async function generateWithOpenAI(
  apiKey: string,
  interests: string,
  budget: string
): Promise<string> {
  const openai = new OpenAI({ apiKey });

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a Valentine's Day planning expert. Suggest exactly 5 creative date ideas, gift suggestions, or experiences. 
Each idea must be about 3 sentences. Format with numbered items. Match the budget level. 
${interests ? `Tailor ideas to these interests: ${interests}` : ""}`,
      },
      {
        role: "user",
        content: `Give me Valentine's ideas. Budget: ${budget}.`,
      },
    ],
    max_tokens: 1500,
  });

  return res.choices[0]?.message?.content?.trim() ?? "";
}

/** Ensure numbered ideas (2., 3., 4., 5.) start on new lines when model returns them on one line */
function formatIdeasContent(content: string): string {
  if (!content.trim()) return content;
  if (content.includes("\n\n")) return content; // Already has proper line breaks
  return content
    .replace(/([^\n])\s*(2\.\s)/g, "$1\n\n$2")
    .replace(/([^\n])\s*(3\.\s)/g, "$1\n\n$2")
    .replace(/([^\n])\s*(4\.\s)/g, "$1\n\n$2")
    .replace(/([^\n])\s*(5\.\s)/g, "$1\n\n$2");
}

function getTemplateContent(interests: string, budget: string): string {
  const budgetText =
    budget === "budget"
      ? "Budget-friendly"
      : budget === "moderate"
        ? "Moderate"
        : "Splurge-worthy";

  return `${budgetText} Valentine's Ideas for You:

${interests ? `Based on interests: ${interests}\n\n` : ""}1. **Home-cooked dinner** – A cozy night in with a homemade meal. Light candles, play soft music, and enjoy each other's company.

2. **Surprise picnic** – Pack a basket with favorite snacks and find a scenic spot. Perfect for a sunset or stargazing.

3. **Experience together** – Book a class, workshop, or activity you've both wanted to try: cooking, pottery, painting, or a dance lesson.

4. **Memory lane** – Recreate your first date or a favorite moment. Add a small twist to make it special.

5. **Gift of time** – Plan a day with no phones—just quality time together.

Happy Valentine's Day!`;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { interests, budget, geminiModel } = await request.json();
    const interestsVal = interests || "";
    const budgetVal = budget || "moderate";
    const systemPrompt = `You are a Valentine's Day planning expert. Suggest exactly 5 creative date ideas, gift suggestions, or experiences. 
Format with numbered items (1., 2., 3., etc.). Each idea must be about 3 sentences. Put a blank line between ideas. Match the budget level. 
${interestsVal ? `Tailor ideas to these interests: ${interestsVal}` : ""}`;
    const userPrompt = `Give me Valentine's ideas. Budget: ${budgetVal}.`;

    const googleKey = await getUserApiKey("google");
    if (googleKey) {
      try {
        const raw = await generateWithGemini(
          googleKey,
          systemPrompt,
          userPrompt,
          1500,
          geminiModel as GeminiModelId | undefined
        );
        if (raw) return NextResponse.json({ content: formatIdeasContent(raw) });
      } catch (err: unknown) {
        console.error("Gemini:", err instanceof Error ? err.message : "Error");
      }
    }

    const openaiKey = await getUserApiKey("openai");
    if (openaiKey) {
      try {
        const raw = await withRetryOn429(() =>
          generateWithOpenAI(
            openaiKey.trim(),
            interestsVal,
            budgetVal
          )
        );
        if (raw) return NextResponse.json({ content: formatIdeasContent(raw) });
      } catch (err: unknown) {
        console.error("OpenAI:", err instanceof Error ? err.message : "Error");
      }
    }

    const content = getTemplateContent(
      interestsVal,
      budgetVal
    );
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { message: "Failed to generate ideas" },
      { status: 500 }
    );
  }
}
