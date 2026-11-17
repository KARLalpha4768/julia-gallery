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
 * Mailing-list sign-ups. There is no mailing-list service yet, so each
 * sign-up is texted to the artist to add by hand.
 */
export async function POST(req: Request) {
  const body = await readJsonObject(req);
  const email = body ? cleanText(body.email, 254) : null;
  if (!email || !isEmail(email)) return errorResponse("Please enter a valid email address.", 400);

  if (!allowRequest(`subscribe:${clientKey(req)}`, 3, TEN_MINUTES)) {
    return errorResponse("Too many sign-ups. Please try again in a few minutes.", 429);
  }

  if (!(await sendArtistSms(`Mailing list sign-up — Julia Gallery\n${email}`))) {
    return errorResponse(SEND_FAILED, 503);
  }

  return Response.json({ success: true });
}
