"use client";

import { useState } from "react";
import styles from "./InquiryForm.module.css";

interface InquiryFormProps {
  artworkTitle?: string;
  onClose?: () => void;
}

export function InquiryForm({ artworkTitle, onClose }: InquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: artworkTitle
      ? `I am interested in "${artworkTitle}". Please provide more information about this work, including availability and shipping options.`
      : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, artworkTitle }),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (status === "sent") {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className={styles.successTitle}>Inquiry Sent</h3>
        <p className={styles.successText}>
          Thank you for your interest. We will respond within 24 hours with
          detailed information about this work.
        </p>
        {onClose && (
          <button className={styles.successBtn} onClick={onClose}>
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} id="inquiry-form">
      <h3 className={styles.title}>
        {artworkTitle ? `Inquire About "${artworkTitle}"` : "Get in Touch"}
      </h3>
      <p className={styles.subtitle}>
        Request pricing, availability, or commission information.
      </p>

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label htmlFor="inquiry-name" className={styles.label}>Full Name</label>
          <input
            id="inquiry-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="Your name"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="inquiry-email" className={styles.label}>Email</label>
          <input
            id="inquiry-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="inquiry-phone" className={styles.label}>
          Phone <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="inquiry-phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className={styles.input}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="inquiry-message" className={styles.label}>Message</label>
        <textarea
          id="inquiry-message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Tell us about your interest..."
        />
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <span className={styles.spinner} />
            Sending...
          </>
        ) : (
          "Send Inquiry"
        )}
      </button>
      {status === "error" && (
        <p style={{ color: "#c0392b", fontSize: "0.875rem", marginTop: "0.5rem" }}>
          Something went wrong. Please try again or email us directly.
        </p>
      )}
    </form>
  );
}
