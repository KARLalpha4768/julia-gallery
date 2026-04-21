"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, total, itemCount, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total }),
      });
      if (response.ok) {
        setCheckoutSuccess(true);
        clearCart();
        closeCart();
        router.push('/order-confirmation');
      } else {
        alert("Checkout failed. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Checkout error.");
    } finally {
      setIsCheckingOut(false);
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
              AGS Fine Art white-glove logistics · Shipping calculated at checkout
            </p>
            <button 
              className={styles.checkoutBtn} 
              id="checkout-button"
              onClick={handleCheckout}
              disabled={isCheckingOut || checkoutSuccess}
            >
              {checkoutSuccess 
                ? "✓ Order Placed. AGS Notified." 
                : isCheckingOut 
                  ? "Processing..." 
                  : "Proceed to Checkout"}
            </button>
            <button className={styles.continueBtn} onClick={closeCart}>
              Continue Browsing
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
