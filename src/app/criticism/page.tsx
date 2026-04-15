import type { Metadata } from "next";
import { CriticismReader } from "@/components/novel/CriticismReader";

export const metadata: Metadata = {
  title: "Critical Reflections — Art, Journey & Vision | Julia Gallery",
  description:
    "Literary criticism, art history, and poetics exploring the traditions behind Seven Coloured Earth and Julia Andrasy's paintings.",
  openGraph: {
    title: "Critical Reflections on Seven Coloured Earth",
    description:
      "Placing Julia Andrasy's novel within the traditions of travel writing, plein air painting, and island poetics.",
  },
};

export default function CriticismPage() {
  return <CriticismReader />;
}
