"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { InquiryForm } from "@/components/forms/InquiryForm";
import type { Artwork } from "@/lib/data";
import styles from "./ArtworkActions.module.css";

interface ArtworkActionsProps {
  artwork: Artwork;
}

export function ArtworkActions({ artwork }: ArtworkActionsProps) {
  const { addItem, items } = useCart();
  const [showInquiry, setShowInquiry] = useState(false);
  const isInCart = items.some((item) => item.artwork.id === artwork.id);

  return (
    <>
      <div className={styles.ctas}>
        <button
          className={`${styles.primaryBtn} ${isInCart ? styles.inCart : ""}`}
          onClick={() => addItem(artwork)}
          disabled={isInCart}
          id={`purchase-${artwork.slug}`}
        >
          {isInCart ? "✓ Added to Collection" : "Purchase This Work"}
        </button>
        <button
          className={styles.secondaryBtn}
          onClick={() => setShowInquiry(!showInquiry)}
          id={`inquire-${artwork.slug}`}
        >
          {showInquiry ? "Close" : "Inquire"}
        </button>
      </div>

      {showInquiry && (
        <div className={styles.inquiryWrapper}>
          <InquiryForm
            artworkTitle={artwork.title}
            onClose={() => setShowInquiry(false)}
          />
        </div>
      )}
    </>
  );
}
