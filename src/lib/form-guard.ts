/**
 * Input checks and a simple rate limit for the public forms.
 *
 * The rate limit is kept in memory, so it applies per server instance. It
 * stops a single visitor from flooding the artist's phone with texts.
 */

// Control characters other than tab, newline and carriage return.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Trimmed text without control characters. Missing values become "".
 * Returns null when the value is not text or is longer than maxLength.
 */
export function cleanText(value: unknown, maxLength: number): string | null {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  const text = value.replace(CONTROL_CHARS, "").trim();
  return text.length <= maxLength ? text : null;
}

export function isEmail(value: string): boolean {
  return value.length <= 254 && EMAIL.test(value);
}

/** The visitor's address as Vercel reports it. */
export function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

const buckets = new Map<string, number[]>();

/** Allows `limit` requests per key within `windowMs`. */
export function allowRequest(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);

  if (buckets.size > 5000) {
    for (const [k, times] of buckets) {
      if (!times.some((t) => now - t < windowMs)) buckets.delete(k);
    }
  }
  return true;
}

export function resetRateLimits(): void {
  buckets.clear();
}

/** Parses a JSON object body, or returns null. */
export async function readJsonObject(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await req.json();
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function errorResponse(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

export const TEN_MINUTES = 10 * 60 * 1000;
export const SEND_FAILED =
  "Your message couldn't be sent right now. Please try again later, or use the contact page.";
