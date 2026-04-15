import type { Metadata } from "next";
import { NovelReader } from "@/components/novel/NovelReader";

export const metadata: Metadata = {
  title: "Seven Coloured Earth — A Novel by Julia Andrasy | Julia Gallery",
  description:
    "Read the full text of Seven Coloured Earth, a travel novel set in Mauritius by painter Julia Andrasy. An immersive auto-scrolling reading experience.",
  openGraph: {
    title: "Seven Coloured Earth — Read the Novel",
    description:
      "A travel guide in a story — Mauritius, Indian Ocean. Follow painter Julia Andrasy through paradise.",
  },
};

export default function NovelPage() {
  return <NovelReader />;
}
