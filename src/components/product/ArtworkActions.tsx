"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { MakeOffer } from "./MakeOffer";
import { ViewInRoom } from "./ViewInRoom";
import type { Artwork } from "@/lib/data";
import styles from "./ArtworkActions.module.css";

interface ArtworkActionsProps {
  artwork: Artwork;
}

export function ArtworkActions({ artwork }: ArtworkActionsProps) {
  const { addItem, items } = useCart();
  const [showInquiry, setShowInquiry] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showRoom, setShowRoom] = useState(false);
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
          onClick={() => setShowOffer(true)}
          id={`offer-${artwork.slug}`}
        >
          Make an Offer
        </button>
      </div>

      <div className={styles.utilityRow}>
        <button
          className={styles.utilityBtn}
          onClick={() => setShowRoom(true)}
          id={`view-room-${artwork.slug}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 15l5-5 4 4 4-6 5 7" />
          </svg>
          View in Room
        </button>
        <button
          className={styles.utilityBtn}
          onClick={() => setShowInquiry(!showInquiry)}
          id={`inquire-${artwork.slug}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
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

      {showOffer && (
        <MakeOffer
          artworkTitle={artwork.title}
          artworkPrice={artwork.price}
          artworkPriceFormatted={artwork.priceFormatted}
          onClose={() => setShowOffer(false)}
        />
      )}

      {showRoom && (
        <ViewInRoom
          src={artwork.src}
          title={artwork.title}
          dimensions={artwork.dimensions}
          onClose={() => setShowRoom(false)}
        />
      )}
    </>
  );
}
