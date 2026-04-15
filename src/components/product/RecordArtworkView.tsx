"use client";

import { useEffect } from "react";
import { recordView } from "@/components/gallery/RecentlyViewed";

export function RecordArtworkView({ artworkId }: { artworkId: number }) {
  useEffect(() => {
    recordView(artworkId);
  }, [artworkId]);
  return null;
}
