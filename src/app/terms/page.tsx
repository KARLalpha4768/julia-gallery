import type { Metadata } from "next";
import styles from "../shipping/page.module.css";

export const metadata: Metadata = {
  title: "Terms of Service — Julia Art",
  description:
    "Terms and conditions governing the purchase of original artworks from Julia Art.",
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Terms of Service</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Original Artworks</h2>
        <p>
          All works offered through Julia Art are original, one-of-a-kind pieces
          created by the artist. Each purchase includes a signed{" "}
          <a href="/authenticity" style={{ textDecoration: "underline" }}>
            Certificate of Authenticity
          </a>
          . Reproduction rights are not transferred with purchase unless
          explicitly agreed in writing.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pricing &amp; Payment</h2>
        <p>
          All prices are listed in US Dollars (USD). Payment is processed
          securely at checkout. Prices are subject to change without notice, but
          confirmed orders are honored at the purchase price.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Shipping &amp; Delivery</h2>
        <p>
          Artworks are shipped via white-glove airfreight through{" "}
          <a
            href="https://www.agsmovers.com/additional-services/fine-art/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}
          >
            AGS Fine Art
          </a>
          , including custom crating, export clearance, and door-to-door
          delivery. Shipping timelines vary by destination. For full details, see
          our{" "}
          <a href="/shipping" style={{ textDecoration: "underline" }}>
            Shipping &amp; Returns
          </a>{" "}
          page.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Returns &amp; Refunds</h2>
        <p>
          We offer a <strong>14-day return guarantee</strong> from the date of
          delivery. The artwork must be returned in its original condition and
          packaging. Return shipping costs are the responsibility of the buyer.
          Refunds are issued to the original payment method within 7 business
          days of receiving the returned work.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Commissions</h2>
        <p>
          Custom commissions are available by inquiry. Terms including size,
          medium, timeline, and pricing are agreed upon before work begins. A
          50% deposit is required to begin a commissioned piece, with the
          balance due upon completion and approval.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Intellectual Property</h2>
        <p>
          All images, text, and content on this website are the intellectual
          property of Julia Art and may not be reproduced without written
          permission. The novel <em>Seven Coloured Earth</em> and all
          associated literary content are protected by copyright.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact</h2>
        <p>
          For questions about these terms, please reach out through our{" "}
          <a href="/contact" style={{ textDecoration: "underline" }}>
            contact page
          </a>
          . Last updated: <strong>April 2026</strong>.
        </p>
      </section>
    </div>
  );
}
