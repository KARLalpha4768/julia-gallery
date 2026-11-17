import { artworks, type Artwork } from "@/lib/data";
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

const MAX_ITEMS = 20;

/**
 * Purchase requests from the cart.
 *
 * No payment is taken here. The request is texted to the artist, who
 * contacts the buyer by email to confirm availability, payment and shipping.
 * Titles and prices come from the catalog, not from the browser.
 */
export async function POST(req: Request) {
  const body = await readJsonObject(req);
  if (!body) return errorResponse("Invalid request.", 400);

  const lines = Array.isArray(body.items) ? body.items : [];
  if (lines.length === 0) return errorResponse("Your collection is empty.", 400);
  if (lines.length > MAX_ITEMS) return errorResponse("Too many works in one request.", 400);

  const ids = [
    ...new Set(
      lines.map((line: unknown) => (line as { artwork?: { id?: unknown } } | null)?.artwork?.id),
    ),
  ];
  const selected: Artwork[] = [];
  for (const id of ids) {
    const artwork = typeof id === "number" ? artworks.find((a) => a.id === id) : undefined;
    if (!artwork) {
      return errorResponse("One of these works could not be found. Please refresh the page and try again.", 400);
    }
    if (!artwork.available) {
      return errorResponse(`"${artwork.title}" is no longer available. Please remove it from your collection.`, 409);
    }
    selected.push(artwork);
  }

  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 254);
  const phone = cleanText(body.phone, 40);
  const message = cleanText(body.message, 2000);
  if (!name || !email || phone === null || message === null) {
    return errorResponse("Please enter your name and email.", 400);
  }
  if (!isEmail(email)) return errorResponse("Please enter a valid email address.", 400);

  if (!allowRequest(`purchase:${clientKey(req)}`, 5, TEN_MINUTES)) {
    return errorResponse("Too many requests. Please try again in a few minutes.", 429);
  }

  const total = selected.reduce((sum, a) => sum + a.price, 0);
  const text = [
    "Purchase request — Julia Gallery",
    ...selected.map((a) => `- ${a.title} (${a.priceFormatted})`),
    `Listed total: $${total.toLocaleString("en-US")}, shipping not included`,
    `From: ${name} <${email}>${phone ? `, ${phone}` : ""}`,
    ...(message ? ["", message] : []),
    "",
    "No payment has been taken. Reply by email to arrange payment and shipping.",
  ].join("\n");

  if (!(await sendArtistSms(text))) return errorResponse(SEND_FAILED, 503);

  return Response.json({ success: true, message: "Purchase request sent." });
}
