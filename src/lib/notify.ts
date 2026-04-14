/**
 * SMS notification via Twilio — alerts Erze when a visitor starts a chat.
 * Fire-and-forget: never blocks the chat response.
 */

let lastNotifiedAt = 0;
const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

export async function notifyArtist(visitorMessage: string): Promise<void> {
  const now = Date.now();
  if (now - lastNotifiedAt < RATE_LIMIT_MS) return;

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.ARTIST_PHONE;

  if (!sid || !token || !from || !to) {
    console.warn("[notify] Twilio not configured — skipping SMS");
    return;
  }

  // Truncate long messages
  const preview =
    visitorMessage.length > 120
      ? visitorMessage.slice(0, 120) + "..."
      : visitorMessage;

  const body = `Julia Gallery chat:\n"${preview}"\njulia-gallery.vercel.app`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }),
    });

    if (res.ok) {
      lastNotifiedAt = now;
      console.log("[notify] SMS sent to artist");
    } else {
      const err = await res.text();
      console.error("[notify] Twilio error:", res.status, err);
    }
  } catch (e) {
    console.error("[notify] SMS failed:", e);
  }
}
