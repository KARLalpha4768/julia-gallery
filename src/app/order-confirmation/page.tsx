import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Order Confirmed — Julia Art",
  description: "Your order has been confirmed. Thank you for collecting original art by Julia.",
};

export default function OrderConfirmationPage() {
  return (
    <div className={styles.page}>
      <div className={styles.iconWrap}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      <h1 className={styles.title}>Thank You for Your Acquisition</h1>
      <p className={styles.subtitle}>
        Your order has been confirmed and payment cleared. A full summary has been sent to your email.
      </p>

      <div className={styles.card}>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Shipping</span>
          <span className={styles.cardValue}>AGS Fine Art will contact you to arrange delivery</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Timeline</span>
          <span className={styles.cardValue}>Custom crating & export clearance initiated</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Certificate</span>
          <span className={styles.cardValue}>Certificate of Authenticity included with shipment</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Questions?</span>
          <span className={styles.cardValue}>
            <Link href="/contact">Contact us</Link> — we respond within 24 hours
          </span>
        </div>
      </div>

      <p className={styles.note}>
        AGS Movers Mauritius has been dispatched and will reach out to the artist directly to arrange professional crating and door-to-door airfreight to your address.
      </p>

      <Link href="/" className={styles.returnBtn}>
        Return to Gallery
      </Link>
    </div>
  );
}
