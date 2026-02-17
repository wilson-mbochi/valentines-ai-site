import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { decrypt } from "@/lib/encryption";
import type { ApiProvider } from "@/lib/supabase";

export async function getUserApiKey(
  provider: ApiProvider
): Promise<string | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("user_api_keys")
      .select("encrypted_key")
      .eq("user_id", userId)
      .eq("provider", provider)
      .maybeSingle();

    if (error || !data?.encrypted_key) return null;

    return decrypt(data.encrypted_key);
  } catch {
    return null;
  }
}
