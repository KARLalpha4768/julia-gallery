import styles from "./Footer.module.css";
import { MailingListForm } from "./MailingListForm";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.inner}>
        {/* Brand Column */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>J</span>
            <span className={styles.logoText}>JULIA</span>
          </div>
          <p className={styles.tagline}>
            Contemporary art from the Indo-Pacific region.
            <br />
            Each piece tells a story of color, texture, and place.
          </p>
        </div>

        {/* Links */}
        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <h4 className={styles.linkGroupTitle}>Gallery</h4>
            <a href="/#collection">Full Collection</a>
            <a href="/#concepts">Concepts</a>
            <a href="/#about">About the Artist</a>
          </div>
          <div className={styles.linkGroup}>
            <h4 className={styles.linkGroupTitle}>Support</h4>
            <a href="/shipping">Shipping &amp; Returns</a>
            <a href="/authenticity">Certificate of Authenticity</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

        {/* Mailing List */}
        <div className={styles.newsletter}>
          <h4 className={styles.newsletterTitle}>Collector Updates</h4>
          <p className={styles.newsletterText}>
            Be first to know about new works and exclusive studio releases.
          </p>
          <MailingListForm />
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <p>&copy; {year} Julia Art. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
