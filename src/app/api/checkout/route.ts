import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Since this is a test/mock checkout, we immediately "succeed" the payment.
    // Generates the AGS Movers Notification Payload
    let emailBody = `\n=========================================\n`;
    emailBody += `🔔 AUTOMATED LOGISTICS DISPATCH: AGS MOVERS MAURITIUS\n`;
    emailBody += `=========================================\n\n`;
    emailBody += `Dear AGS Movers Mauritius Team,\n\n`;
    emailBody += `A purchase has been successfully cleared on the Julia Art Gallery platform.\n`;
    emailBody += `Please contact the artist (Julia) immediately via text or phone at +49 178 4944787 to arrange a studio pickup for crating and export.\n\n`;
    emailBody += `--- ARTWORK DETAILS ---\n`;
    
    items.forEach((item: any) => {
      emailBody += `* Title: "${item.artwork.title}" (${item.artwork.series})\n`;
      emailBody += `* Medium: ${item.artwork.medium}\n`;
      emailBody += `* Dimensions: ${item.artwork.dimensions}\n`;
      emailBody += `* Price: ${item.artwork.priceFormatted}\n\n`;
    });

    emailBody += `--- FINANCIALS ---\n`;
    emailBody += `Total Value: $${total.toLocaleString('en-US')}\n`;
    let erzeBody = `\n=========================================\n`;
    erzeBody += `🔔 NEW ORDER CONFIRMATION: JULIA ART GALLERY\n`;
    erzeBody += `=========================================\n\n`;
    erzeBody += `Dear Julia,\n\n`;
    erzeBody += `Congratulations, a new piece has just been purchased!\n`;
    erzeBody += `AGS Movers has been notified via the automated dispatch system.\n`;
    erzeBody += `They have been instructed to TEXT or CALL you at +49 178 4944787 shortly to arrange crating and pickup.\n\n`;
    erzeBody += `--- BUYER INFORMATION ---\n`;
    erzeBody += `Name: Victoria Chen\n`;
    erzeBody += `Phone: +852 9123 4567\n`;
    erzeBody += `Address: 15B, The Peak Tower, 128 Peak Road, Hong Kong Island, Hong Kong\n\n`;

    erzeBody += `--- LOGISTICS & SHIPPING ---\n`;
    erzeBody += `Provider: AGS Movers Fine Art\n`;
    erzeBody += `Service Tier: White-Glove (Custom Crating, Export Clearance, Door-to-Door Airfreight)\n`;
    erzeBody += `Shipping Paid: $800 USD (Asia / Oceania Region)\n`;
    erzeBody += `Reference: https://www.agsmovers.com/additional-services/fine-art/\n\n`;

    erzeBody += `--- ORDER DETAILS ---\n`;
    items.forEach((item: any) => {
      erzeBody += `* Title: "${item.artwork.title}"\n`;
      if (item.artwork.slug) {
        erzeBody += `* Link: https://julia-gallery.vercel.app/artwork/${item.artwork.slug}\n`;
      }
      erzeBody += `* Value: ${item.artwork.priceFormatted}\n`;
      erzeBody += `* Medium: ${item.artwork.medium} | Dimensions: ${item.artwork.dimensions}\n`;
    });
    
    erzeBody += `\n--- BUYER TELEMETRY & ACTIVITY ---\n`;
    erzeBody += `Session Duration: 14 minutes\n`;
    erzeBody += `Artworks Viewed: "Monsoon Garden", "Chamarel Strata", "Bazaar Indigo"\n`;
    erzeBody += `AI Artist Interaction: YES\n`;
    erzeBody += `Chat Summary: The buyer interacted with your AI persona for 6 minutes, asking specifically about your geographical inspiration behind 'Chamarel Strata'. The AI responded beautifully in your voice, which directly contributed to this purchase.\n`;
    
    erzeBody += `\n--- FINANCIAL CLEARANCE ---\n`;
    const totalOrderValue = items.reduce((sum: number, item: any) => sum + item.artwork.price, 0) + 800; // Art + Shipping
    erzeBody += `Total Value: $${totalOrderValue.toLocaleString('en-US')} USD\n`;
    erzeBody += `Status: FUNDS CLEARED via Stripe\n`;
    erzeBody += `Deposit Destination: DBS Bank Singapore Account ending in **4922**\n`;
    erzeBody += `Expected Settlement: Within 24 hours\n`;

    erzeBody += `\n=========================================\n`;

    // Mock sending emails by logging to secure server terminal
    console.log("[SENDING SECURE EMAIL TO: logistics@agsmovers.mu]");
    console.log(emailBody);

    console.log("[SENDING SECURE EMAIL TO: erz1357@gmail.com]");
    console.log(erzeBody);

    return NextResponse.json({ 
      success: true, 
      message: "Order placed successfully. AGS Movers has been notified for pickup." 
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
