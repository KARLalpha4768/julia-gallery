import type { Metadata } from "next";
import styles from "../shipping/page.module.css";

export const metadata: Metadata = {
  title: "Certificate of Authenticity — Julia Art",
  description: "Every original artwork includes a signed Certificate of Authenticity documenting provenance, materials, and edition details.",
};

export default function AuthenticityPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Certificate of Authenticity</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Every Work is Authenticated</h2>
        <p>
          Each original artwork purchased from Julia Art includes a signed,
          numbered Certificate of Authenticity (COA). This document serves as a
          permanent record of the work&apos;s provenance and is essential for
          insurance, resale, and collection documentation.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What&apos;s Included</h2>
        <ul className={styles.list}>
          <li>Artist&apos;s name and signature</li>
          <li>Title of the work</li>
          <li>Year of creation</li>
          <li>Medium and materials used</li>
          <li>Exact dimensions</li>
          <li>Unique catalogue number</li>
          <li>High-resolution photograph of the work</li>
          <li>Condition report at time of sale</li>
          <li>Date of purchase and buyer information</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Archival Quality</h2>
        <p>
          Certificates are printed on 100% cotton, acid-free paper with
          archival-grade inks. They are designed to last as long as the artwork
          itself and should be stored in a cool, dry place away from direct
          sunlight.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Digital Verification</h2>
        <p>
          In addition to the physical certificate, a digital record of each
          authenticated work is maintained in our secure database. Buyers may
          request verification at any time by contacting us with their catalogue
          number.
        </p>
      </section>
    </div>
  );
}
