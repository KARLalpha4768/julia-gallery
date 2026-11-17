/**
 * Text messages to the artist through Twilio.
 *
 * Configured with TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
 * and ARTIST_PHONE. Contact details live only in those environment
 * variables, never in this repository.
 */

const SITE_URL = "julia-gallery.vercel.app";
const SMS_MAX_CHARS = 1500; // Twilio accepts up to 1600 characters per message

function twilioConfig() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.ARTIST_PHONE;
  return sid && token && from && to ? { sid, token, from, to } : null;
}

export function smsConfigured(): boolean {
  return twilioConfig() !== null;
}

/** Sends a text to the artist. Resolves true only when Twilio accepted it. */
export async function sendArtistSms(body: string): Promise<boolean> {
  const config = twilioConfig();
  if (!config) {
    console.error("[notify] Twilio is not configured; message not sent");
    return false;
  }

  const text = body.length > SMS_MAX_CHARS ? `${body.slice(0, SMS_MAX_CHARS - 1)}…` : body;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.sid}/Messages.json`;
  const auth = Buffer.from(`${config.sid}:${config.token}`).toString("base64");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: config.to, From: config.from, Body: text }),
    });
    if (res.ok) return true;
    console.error("[notify] Twilio error:", res.status, (await res.text()).slice(0, 300));
    return false;
  } catch (e) {
    console.error("[notify] SMS failed:", e instanceof Error ? e.message : e);
    return false;
  }
}

let lastChatNoticeAt = 0;
const CHAT_NOTICE_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Tells the artist a visitor started a chat, at most once every five minutes.
 * Fire-and-forget: never blocks the chat response.
 */
export async function notifyArtist(visitorMessage: string): Promise<void> {
  const now = Date.now();
  if (now - lastChatNoticeAt < CHAT_NOTICE_INTERVAL_MS) return;
  if (!smsConfigured()) {
    console.warn("[notify] Twilio not configured — skipping SMS");
    return;
  }

  const preview = visitorMessage.length > 120 ? `${visitorMessage.slice(0, 120)}...` : visitorMessage;
  if (await sendArtistSms(`Julia Gallery chat:\n"${preview}"\n${SITE_URL}`)) {
    lastChatNoticeAt = now;
  }
}
