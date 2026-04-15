import type { Metadata } from "next";
import styles from "../shipping/page.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy — Julia Art",
  description:
    "How Julia Art collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Privacy Policy</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Information We Collect</h2>
        <p>
          When you browse Julia Art, we collect only the information necessary to
          provide you with a seamless experience. This may include your name,
          email address, and shipping details when you make a purchase or submit
          an inquiry.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
        <p>
          Your information is used exclusively to process orders, respond to
          inquiries, and send collector updates if you opt in to our mailing
          list. We never sell, rent, or share your personal data with third
          parties for marketing purposes.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cookies &amp; Analytics</h2>
        <p>
          We use Google Analytics to understand how visitors interact with our
          site. This data is anonymized and used solely to improve the browsing
          experience. You can disable cookies in your browser settings at any
          time.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Payment Security</h2>
        <p>
          All transactions are processed through <strong>Stripe</strong>, a
          PCI-DSS Level 1 certified payment processor. We never store your
          credit card information on our servers.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          data at any time by contacting us through our{" "}
          <a href="/contact" style={{ textDecoration: "underline" }}>
            contact page
          </a>
          . We will respond within 30 days.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Updates</h2>
        <p>
          This policy may be updated periodically. The latest version will
          always be available on this page. Last updated:{" "}
          <strong>April 2026</strong>.
        </p>
      </section>
    </div>
  );
}
