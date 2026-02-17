import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUserApiKey } from "@/lib/get-user-api-key";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = await getUserApiKey("openai");
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "No API key found. The key may not be saved correctly, or decryption failed.",
        },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey: apiKey.trim() });
    await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say 'OK' only." }],
      max_tokens: 5,
    });

    return NextResponse.json({ success: true, message: "API key works!" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
