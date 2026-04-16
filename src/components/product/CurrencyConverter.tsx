"use client";

import { useState, useEffect } from "react";
import styles from "./CurrencyConverter.module.css";

interface CurrencyConverterProps {
  usdPrice: number;
}

const CURRENCIES = [
  { code: "USD", label: "US Dollar (EN)" },
  { code: "GBP", label: "British Pound (EN)" },
  { code: "EUR", label: "Euro (FR, DE, ES, IT)" },
  { code: "MUR", label: "Mauritian Rupee (MFE)" },
  { code: "INR", label: "Indian Rupee (HI)" },
  { code: "CNY", label: "Chinese Yuan (ZH)" },
  { code: "HKD", label: "Hong Kong Dollar (YUE)" },
  { code: "JPY", label: "Japanese Yen (JA)" },
  { code: "MYR", label: "Malaysian Ringgit (MS)" },
  { code: "HUF", label: "Hungarian Forint (HU)" },
  { code: "BRL", label: "Brazilian Real (PT)" },
  { code: "AED", label: "UAE Dirham (AR)" },
  { code: "ZAR", label: "South African Rand (AF)" },
  { code: "KRW", label: "South Korean Won (KO)" },
];

export function CurrencyConverter({ usdPrice }: CurrencyConverterProps) {
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setRates(data.rates);
        }
      })
      .catch((err) => console.error("Failed to load exchange rates", err));
  }, []);

  if (!rates) return null; // Wait until rates are loaded to render

  const rate = rates[currency] || 1;
  const convertedPrice = usdPrice * rate;

  const formattedPrice = new Intl.NumberFormat(currency === "USD" ? "en-US" : 'en', {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(convertedPrice);

  return (
    <div className={styles.converter}>
      <label htmlFor="currency-select" className={styles.label}>
        View estimated price in regional currency:
      </label>
      <div className={styles.controls}>
        <select
          id="currency-select"
          className={styles.select}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.label}
            </option>
          ))}
        </select>
        <span className={styles.price}>{formattedPrice}</span>
      </div>
    </div>
  );
}
