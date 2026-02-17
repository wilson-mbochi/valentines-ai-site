function isRateLimitError(err: unknown): boolean {
  if (err && typeof err === "object") {
    const e = err as { status?: number; statusCode?: number; message?: string };
    if (e.status === 429 || e.statusCode === 429) return true;
    const msg = String(e.message ?? "").toLowerCase();
    if (msg.includes("429") || msg.includes("rate limit") || msg.includes("quota")) return true;
  }
  return false;
}

/** Retry an async operation on 429 rate limit, with exponential backoff */
export async function withRetryOn429<T>(
  fn: () => Promise<T>,
  maxRetries = 2
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
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
