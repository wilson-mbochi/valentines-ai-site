import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { encrypt } from "@/lib/encryption";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ keys: [] });
    }

    const { data, error } = await supabase
      .from("user_api_keys")
      .select("id, provider, created_at")
      .eq("user_id", userId);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch API keys" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      keys: data?.map((k) => ({
        id: k.id,
        provider: k.provider,
        created_at: k.created_at,
        hasKey: true,
      })) ?? [],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { provider, apiKey } = await request.json();
    if (!provider || !apiKey || typeof apiKey !== "string") {
      return NextResponse.json(
        { error: "Provider and apiKey are required" },
        { status: 400 }
      );
    }

    const validProviders = ["openai", "anthropic", "google"];
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: "Invalid provider" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    if (!supabase || !process.env.ENCRYPTION_SECRET) {
      return NextResponse.json(
        { error: "API key storage is not configured. Please contact support." },
        { status: 503 }
      );
    }

    const encryptedKey = encrypt(apiKey.trim());

    const { error } = await supabase.from("user_api_keys").upsert(
      {
        user_id: userId,
        provider,
        encrypted_key: encryptedKey,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,provider",
      }
    );

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save API key" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");
    if (!provider) {
      return NextResponse.json(
        { error: "Provider is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "API key storage is not configured." },
        { status: 503 }
      );
    }

    const { error } = await supabase
      .from("user_api_keys")
      .delete()
      .eq("user_id", userId)
      .eq("provider", provider);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to delete API key" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
