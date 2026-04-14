import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ARTIST_SYSTEM_PROMPT } from "@/lib/artist-prompt";
import { notifyArtist } from "@/lib/notify";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Chat is not configured. Please set OPENAI_API_KEY." },
        { status: 503 }
      );
    }

    const { messages, language } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Notify Erze via SMS on the visitor's first message (fire-and-forget)
    const userMessages = messages.filter((m: { role: string }) => m.role === "user");
    if (userMessages.length === 1) {
      notifyArtist(userMessages[0].content).catch(() => {});
    }

    // Limit conversation history to last 20 messages to control token usage
    const recentMessages = messages.slice(-20);

    // Build the system prompt with optional language instruction
    let systemContent = ARTIST_SYSTEM_PROMPT;
    if (language && language !== "en") {
      const LANGUAGE_NAMES: Record<string, string> = {
        fr: "French", mfe: "Mauritian Creole (Kreol Morisien)", hi: "Hindi",
        zh: "Mandarin Chinese", yue: "Cantonese Chinese", ja: "Japanese", ms: "Malay",
        de: "German", hu: "Hungarian", es: "Spanish", it: "Italian",
        pt: "Portuguese", ar: "Arabic", ko: "Korean",
      };
      const langName = LANGUAGE_NAMES[language] || language;
      systemContent += `\n\n## LANGUAGE INSTRUCTION\nThe visitor prefers ${langName}. Respond ENTIRELY in ${langName}. Stay in character as Julia. Use natural, fluent ${langName} — not machine-translated phrasing.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        ...recentMessages,
      ],
      max_tokens: 500,
      temperature: 0.8,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I seem to be lost in thought. Could you ask me again?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
