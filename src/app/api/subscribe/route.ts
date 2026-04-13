import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Mock — replace with Resend Audience API when credentials are ready:
    // await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID });
    console.log(`[MAILING LIST] New subscriber: ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
