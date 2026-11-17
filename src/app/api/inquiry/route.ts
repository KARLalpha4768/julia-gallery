import {
  SEND_FAILED,
  TEN_MINUTES,
  allowRequest,
  cleanText,
  clientKey,
  errorResponse,
  isEmail,
  readJsonObject,
} from "@/lib/form-guard";
import { sendArtistSms } from "@/lib/notify";

/**
 * Collector inquiries and offers (the inquiry form and Make an Offer).
 * Forwarded to the artist by text message; a success response means the
 * message was accepted for delivery.
 */
export async function POST(req: Request) {
  const body = await readJsonObject(req);
  if (!body) return errorResponse("Invalid request.", 400);

  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 254);
  const phone = cleanText(body.phone, 40);
  const subject = cleanText(body.subject, 200);
  const artworkTitle = cleanText(body.artworkTitle, 200);
  const message = cleanText(body.message, 4000);

  if (!name || !email || !message || phone === null || subject === null || artworkTitle === null) {
    return errorResponse("Please fill in your name, email and message.", 400);
  }
  if (!isEmail(email)) return errorResponse("Please enter a valid email address.", 400);

  if (!allowRequest(`inquiry:${clientKey(req)}`, 5, TEN_MINUTES)) {
    return errorResponse("Too many messages. Please try again in a few minutes.", 429);
  }

  const lines = ["New inquiry — Julia Gallery"];
  if (subject) lines.push(subject);
  if (artworkTitle) lines.push(`Artwork: ${artworkTitle}`);
  lines.push(`From: ${name} <${email}>${phone ? `, ${phone}` : ""}`, "", message);

  if (!(await sendArtistSms(lines.join("\n")))) return errorResponse(SEND_FAILED, 503);

  return Response.json({ success: true, message: "Inquiry sent." });
}
