"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, total, itemCount, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // No payment is taken here: the request goes to Julia, who replies by email.
  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError("");
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({ artwork: { id: item.artwork.id } })),
          name,
          email,
          phone,
          message: note,
        }),
      });
      if (response.ok) {
        clearCart();
        closeCart();
        router.push('/order-confirmation');
        return;
      }
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Your request couldn't be sent. Please try again.");
    } catch {
      setError("Your request couldn't be sent. Please check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        id="cart-drawer"
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            Your Collection
            {itemCount > 0 && (
              <span className={styles.headerCount}>{itemCount}</span>
            )}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={closeCart}
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p className={styles.emptyText}>Your collection is empty</p>
              <p className={styles.emptySubtext}>
                Browse the gallery to discover original works
              </p>
              <button className={styles.emptyBtn} onClick={closeCart}>
                View Collection
              </button>
            </div>
          ) : (
            <ul className={styles.itemList}>
              {items.map((item) => (
                <li key={item.artwork.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.artwork.src}
                      alt={item.artwork.title}
                      fill
                      sizes="80px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemSeries}>{item.artwork.series}</span>
                    <h3 className={styles.itemTitle}>{item.artwork.title}</h3>
                    <span className={styles.itemMeta}>
                      {item.artwork.medium} · {item.artwork.dimensions}
                    </span>
                    <span className={styles.itemPrice}>
                      {item.artwork.priceFormatted}
                    </span>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.artwork.id)}
                    aria-label={`Remove ${item.artwork.title}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span>Subtotal</span>
              <span className={styles.subtotalPrice}>
                ${total.toLocaleString('en-US')}
              </span>
            </div>
            <p className={styles.shippingNote}>
              No payment is taken here. Julia will email you to confirm
              availability, payment and shipping.
            </p>
            <form className={styles.requestForm} onSubmit={handleRequest} id="purchase-request-form">
              <input
                className={styles.requestInput}
                type="text"
                placeholder="Your name"
                aria-label="Your name"
                autoComplete="name"
                maxLength={100}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className={styles.requestInput}
                type="email"
                placeholder="Email"
                aria-label="Email"
                autoComplete="email"
                maxLength={254}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className={styles.requestInput}
                type="tel"
                placeholder="Phone (optional)"
                aria-label="Phone (optional)"
                autoComplete="tel"
                maxLength={40}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <textarea
                className={styles.requestInput}
                placeholder="Shipping country or a note (optional)"
                aria-label="Shipping country or a note (optional)"
                maxLength={2000}
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              {error && (
                <p className={styles.requestError} role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className={styles.checkoutBtn}
                id="checkout-button"
                disabled={isSending}
              >
                {isSending ? "Sending…" : "Request to Purchase"}
              </button>
            </form>
            <button className={styles.continueBtn} onClick={closeCart}>
              Continue Browsing
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
