"use client";

import { useState } from "react";
import styles from "./MakeOffer.module.css";

interface MakeOfferProps {
  artworkTitle: string;
  artworkPrice: number;
  artworkPriceFormatted: string;
  onClose: () => void;
}

export function MakeOffer({
  artworkTitle,
  artworkPrice,
  artworkPriceFormatted,
  onClose,
}: MakeOfferProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [offer, setOffer] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: `Offer for "${artworkTitle}"`,
          message: `OFFER: $${offer}\nListed Price: ${artworkPriceFormatted}\n\n${message || "No additional message."}`,
        }),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const offerNum = parseFloat(offer) || 0;
  const pctOfList = artworkPrice > 0 ? Math.round((offerNum / artworkPrice) * 100) : 0;

  if (status === "sent") {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.success}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2d7a4f" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h3>Offer Submitted</h3>
            <p>
              Your offer of <strong>${offer}</strong> for <em>{artworkTitle}</em> has been
              sent. Julia will review and respond within 24 hours.
            </p>
            <button className={styles.doneBtn} onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h3 className={styles.title}>Make an Offer</h3>
        <p className={styles.subtitle}>
          <em>{artworkTitle}</em> — Listed at {artworkPriceFormatted}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <label className={styles.label}>
              Name
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                placeholder="Your name"
              />
            </label>
            <label className={styles.label}>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="your@email.com"
              />
            </label>
          </div>

          <label className={styles.label}>
            Your Offer (USD)
            <div className={styles.offerInputWrapper}>
              <span className={styles.currencySign}>$</span>
              <input
                type="number"
                required
                min="1"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className={`${styles.input} ${styles.offerInput}`}
                placeholder={String(Math.round(artworkPrice * 0.85))}
              />
              {offerNum > 0 && (
                <span className={styles.pctBadge}>
                  {pctOfList}% of list
                </span>
              )}
            </div>
          </label>

          <label className={styles.label}>
            Message <span className={styles.optional}>(optional)</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.textarea}
              rows={3}
              placeholder="Tell Julia about your collection or what draws you to this work..."
            />
          </label>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Submit Offer"}
          </button>

          {status === "error" && (
            <p className={styles.errorMsg}>
              Something went wrong. Please try again or email directly.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
