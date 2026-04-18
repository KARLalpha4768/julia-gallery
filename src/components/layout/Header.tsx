"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { SiteLanguageSelector } from "./SiteLanguageSelector";
import styles from "./Header.module.css";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      id="site-header"
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.inner}>
        {/* Logo */}
        <a href="/" className={styles.logo} id="logo-link">
          <span className={styles.logoMark}>J</span>
          <span className={styles.logoText}>JULIA</span>
        </a>

        {/* Desktop Navigation */}
        <nav className={styles.nav} id="main-nav" aria-label="Main navigation">
          <a href="/#collection" className={styles.navLink}>
            Works
          </a>
          <a href="/#concepts" className={styles.navLink}>
            Series
          </a>
          <a href="/#film" className={styles.navLink}>
            Atelier
          </a>
          <a href="/#about" className={styles.navLink}>
            The Artist
          </a>
          <a href="/#novel" className={styles.navLink}>
            Reading Room
          </a>
          <a href="/contact" className={styles.navLink}>
            Inquire
          </a>
        </nav>

        {/* Language, Cart + Mobile Toggle */}
        <div className={styles.actions}>
          <div className={styles.langWrapper}>
            <SiteLanguageSelector />
          </div>

          <button
            className={styles.cartBtn}
            id="cart-button"
            aria-label="View cart"
            onClick={toggleCart}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className={styles.cartCount}>{itemCount}</span>
          </button>

          <button
            className={styles.menuToggle}
            id="mobile-menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        id="mobile-menu"
      >
        <nav aria-label="Mobile navigation">
          <a href="/#collection" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Works
          </a>
          <a href="/#concepts" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Series
          </a>
          <a href="/#film" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Atelier
          </a>
          <a href="/#about" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            The Artist
          </a>
          <a href="/#novel" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Reading Room
          </a>
          <a href="/contact" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Inquire
          </a>
          <div className={styles.mobileLang}>
            <SiteLanguageSelector />
          </div>
        </nav>
      </div>
    </header>
  );
}
