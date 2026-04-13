import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message, artworkTitle } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Build the inquiry notification email for Julia
    let juliaBody = `\n=========================================\n`;
    juliaBody += `✉️  NEW COLLECTOR INQUIRY: JULIA ART GALLERY\n`;
    juliaBody += `=========================================\n\n`;
    juliaBody += `Dear Julia,\n\n`;
    juliaBody += `A collector has submitted an inquiry through your gallery website.\n\n`;

    juliaBody += `--- COLLECTOR DETAILS ---\n`;
    juliaBody += `Name: ${name}\n`;
    juliaBody += `Email: ${email}\n`;
    if (phone) juliaBody += `Phone: ${phone}\n`;

    if (artworkTitle) {
      juliaBody += `\n--- ARTWORK OF INTEREST ---\n`;
      juliaBody += `Title: "${artworkTitle}"\n`;
    }

    juliaBody += `\n--- MESSAGE ---\n`;
    juliaBody += `${message}\n`;
    juliaBody += `\n=========================================\n`;
    juliaBody += `Reply directly to: ${email}\n`;
    juliaBody += `=========================================\n`;

    // Build auto-reply for the collector
    let collectorBody = `\n=========================================\n`;
    collectorBody += `✉️  JULIA ART GALLERY — INQUIRY RECEIVED\n`;
    collectorBody += `=========================================\n\n`;
    collectorBody += `Dear ${name},\n\n`;
    collectorBody += `Thank you for your interest in Julia's work.\n`;
    collectorBody += `We have received your inquiry`;
    if (artworkTitle) collectorBody += ` regarding "${artworkTitle}"`;
    collectorBody += ` and will respond personally within 24 hours.\n\n`;
    collectorBody += `With warm regards,\n`;
    collectorBody += `Julia — Indo-Pacific Contemporary Art\n`;
    collectorBody += `https://julia-gallery.vercel.app\n`;
    collectorBody += `\n=========================================\n`;

    // Mock dispatch — replace with Resend API call when credentials are ready
    console.log("[SENDING INQUIRY NOTIFICATION TO: erz1357@gmail.com]");
    console.log(juliaBody);

    console.log(`[SENDING AUTO-REPLY TO: ${email}]`);
    console.log(collectorBody);

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully.",
    });
  } catch (error) {
    console.error("Inquiry Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
