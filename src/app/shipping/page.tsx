import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Shipping & Returns — Julia Art",
  description: "Worldwide white-glove shipping on all original artworks via AGS Fine Art. 14-day return guarantee.",
};

export default function ShippingPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Shipping & Returns</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Worldwide White-Glove Shipping</h2>
        <p>
          We exclusively partner with <strong><a href="https://www.agsmovers.com/additional-services/fine-art/" target="_blank" rel="noopener noreferrer">AGS Movers Fine Art</a></strong>, a premium logistics provider specializing in the safe transport of high-value artwork direct from our studio in Mauritius. Because each piece requires specialized handling, shipping costs are dynamically calculated at checkout based on your global region:
        </p>
        <ul className={styles.list}>
          <li><strong>Local (Mauritius):</strong> Secure domestic transport</li>
          <li><strong>Europe & UK:</strong> Door-to-door airfreight</li>
          <li><strong>North America:</strong> Door-to-door airfreight</li>
          <li><strong>Asia & Oceania:</strong> Door-to-door airfreight</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Professional Crating & Packaging</h2>
        <p>
          Unlike standard shipping, every original artwork undergoes professional, custom-built crating by AGS Fine Art experts before export. The artwork is sealed against moisture, structurally reinforced, and strictly handled via specialized fine art airfreight networks.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Insurance</h2>
        <p>
          All shipments are automatically insured for the full purchase price during transit. In the unlikely event of damage during the international journey, we will work with our logistics partners to either replace the work (if a similar piece is available) or issue a full refund.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Returns</h2>
        <p>
          We offer a <strong>14-day return guarantee</strong>. If the work does not meet your expectations, you may return it in its original condition within 14 days of delivery. Due to the high structural costs of international fine-art logistics and custom crating, <strong>all return shipping, re-crating, and insurance costs are the responsibility of the buyer.</strong>
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Customs, Duties & Export</h2>
        <p>
          AGS Movers will fully handle the export clearance documentation on our end to ensure the artwork leaves Mauritius legally and safely. However, original artworks may be subject to import duties and taxes depending on your destination country's customs laws. <strong>These import charges are the sole responsibility of the buyer.</strong> We declare all shipments at their full purchase value and securely attach a Certificate of Authenticity with the export documentation.
        </p>
      </section>
    </div>
  );
}
