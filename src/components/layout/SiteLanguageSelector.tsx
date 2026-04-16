"use client";

import { useState, useEffect } from "react";
import styles from "./SiteLanguageSelector.module.css";

const LANGUAGES = [
  { code: "en", label: "EN", title: "English", gtCode: "en" },
  { code: "fr", label: "FR", title: "Français", gtCode: "fr" },
  { code: "hi", label: "HI", title: "हिन्दी", gtCode: "hi" },
  { code: "zh", label: "ZH", title: "普通话 (Mandarin)", gtCode: "zh-CN" },
  { code: "yue", label: "YUE", title: "廣東話 (Cantonese)", gtCode: "zh-TW" },
  { code: "ja", label: "JA", title: "日本語", gtCode: "ja" },
  { code: "ms", label: "MS", title: "Bahasa Melayu", gtCode: "ms" },
  { code: "de", label: "DE", title: "Deutsch", gtCode: "de" },
  { code: "hu", label: "HU", title: "Magyar", gtCode: "hu" },
  { code: "es", label: "ES", title: "Español", gtCode: "es" },
  { code: "it", label: "IT", title: "Italiano", gtCode: "it" },
  { code: "pt", label: "PT", title: "Português", gtCode: "pt" },
  { code: "af", label: "AF", title: "Afrikaans", gtCode: "af" },
  { code: "ar", label: "AR", title: "العربية", gtCode: "ar" },
  { code: "ko", label: "KO", title: "한국어", gtCode: "ko" },
];

export function SiteLanguageSelector() {
  const [currentLang, setCurrentLang] = useState("en");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check for ?lang= URL parameter (enables shareable language links)
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    if (urlLang) {
      const lang = LANGUAGES.find((l) => l.code === urlLang);
      if (lang) {
        const domain = window.location.hostname;
        document.cookie = `googtrans=/en/${lang.gtCode}; path=/; domain=${domain}`;
        document.cookie = `googtrans=/en/${lang.gtCode}; path=/`;
        setCurrentLang(lang.code);
        localStorage.setItem("julia-lang-set", "true");
        // Remove the param from URL to keep it clean, then reload
        const url = new URL(window.location.href);
        url.searchParams.delete("lang");
        window.history.replaceState({}, "", url.toString());
        window.location.reload();
        return;
      }
    }

    // Read the current language from the Google Translate cookie
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (match && match[1]) {
      const gtCode = match[1];
      const lang = LANGUAGES.find((l) => l.gtCode === gtCode);
      if (lang) setCurrentLang(lang.code);
      return; // User already has a language preference
    }

    // Auto-detect South African visitors (first visit only)
    if (!localStorage.getItem("julia-lang-set")) {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.country_code === "ZA") {
            const domain = window.location.hostname;
            document.cookie = `googtrans=/en/af; path=/; domain=${domain}`;
            document.cookie = `googtrans=/en/af; path=/`;
            localStorage.setItem("julia-lang-set", "true");
            window.location.reload();
          }
        })
        .catch(() => {}); // Fail silently — English is fine as default
    }
  }, []);

  const handleSelect = (lang: typeof LANGUAGES[0]) => {
    setCurrentLang(lang.code);
    setIsOpen(false);
    
    // Set the Google Translate cookie
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${lang.gtCode}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/en/${lang.gtCode}; path=/`; // Fallback for some browsers
    
    // Reload to apply translation smoothly over React
    window.location.reload();
  };

  const activeLang = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className={styles.wrapper}>
      <button 
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className={styles.desktopText}>Language: {activeLang.title}</span>
        <span className={styles.mobileText}>{activeLang.label}</span>
      </button>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.dropdown}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`${styles.option} ${currentLang === lang.code ? styles.active : ""}`}
                onClick={() => handleSelect(lang)}
                title={lang.title}
              >
                {lang.title}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
