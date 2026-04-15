import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>This canvas is empty</h1>
        <p className={styles.body}>
          The page you&rsquo;re looking for has been moved, sold, or never painted.
          Let&rsquo;s guide you back to the gallery.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            View Collection
          </Link>
          <Link href="/contact" className={styles.secondaryBtn}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
