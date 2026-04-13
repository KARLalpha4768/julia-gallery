"use client";

import { useState } from "react";
import styles from "./Footer.module.css";

export function MailingListForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className={styles.subscribeSuccess}>
        ✓ You&apos;re on the list. Thank you.
      </p>
    );
  }

  return (
    <form className={styles.subscribeForm} onSubmit={handleSubmit} id="mailing-list-form">
      <input
        type="email"
        id="subscribe-email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className={styles.subscribeInput}
        disabled={status === "sending"}
      />
      <button
        type="submit"
        className={styles.subscribeBtn}
        disabled={status === "sending"}
      >
        {status === "sending" ? "…" : "Subscribe"}
      </button>
      {status === "error" && (
        <p className={styles.subscribeError}>Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
