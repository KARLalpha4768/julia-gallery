import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Purchase Request Received — Julia Art",
  description: "Your purchase request has been sent to Julia. She will email you to arrange payment and shipping.",
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

      <h1 className={styles.title}>Thank You for Your Request</h1>
      <p className={styles.subtitle}>
        Your purchase request has been sent to Julia. No payment has been taken.
      </p>

      <div className={styles.card}>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Next step</span>
          <span className={styles.cardValue}>Julia will email you within 24 hours to confirm availability</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Payment</span>
          <span className={styles.cardValue}>Agreed directly with Julia before anything is shipped</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Shipping</span>
          <span className={styles.cardValue}>Crating and delivery are arranged once payment is agreed</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Questions?</span>
          <span className={styles.cardValue}>
            <Link href="/contact">Contact us</Link> — we respond within 24 hours
          </span>
        </div>
      </div>

      <Link href="/" className={styles.returnBtn}>
        Return to Gallery
      </Link>
    </div>
  );
}
