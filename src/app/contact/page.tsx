import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/InquiryForm";
import styles from "../shipping/page.module.css";

export const metadata: Metadata = {
  title: "Contact — Julia Art",
  description: "Get in touch about original artworks, commissions, or exhibition inquiries.",
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Contact</h1>

      <section className={styles.section}>
        <p>
          Whether you&apos;re interested in a specific work, commissioning a
          piece, or exploring exhibition opportunities, we&apos;d love to hear
          from you. Use the form below or reach out directly.
        </p>
      </section>

      <section className={styles.section}>
        <InquiryForm />
      </section>
    </div>
  );
}
