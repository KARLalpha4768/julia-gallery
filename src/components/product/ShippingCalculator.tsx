"use client";

import { useState } from "react";
import styles from "./ShippingCalculator.module.css";

interface ShippingCalculatorProps {
  basePrice: number;
}

const REGIONS = [
  { id: "default", name: "Select region to estimate shipping", cost: null },
  { id: "mauritius", name: "Local (Mauritius)", cost: 100 },
  { id: "southern_africa", name: "Southern Africa (SA, Namibia, Botswana)", cost: 450 },
  { id: "europe", name: "Europe / UK", cost: 500 },
  { id: "na", name: "North America", cost: 700 },
  { id: "asia_oceania", name: "Asia / Oceania", cost: 800 },
];

export function ShippingCalculator({ basePrice }: ShippingCalculatorProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string>("default");

  const selectedRegion = REGIONS.find((r) => r.id === selectedRegionId);
  const totalCost = selectedRegion?.cost ? basePrice + selectedRegion.cost : null;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <div className={styles.calculatorWrapper}>
      <div className={styles.inputGroup}>
        <label htmlFor="shipping-region" className={styles.label}>
          AGS Fine Art Logistics
          <span style={{ display: 'block', fontSize: '0.85em', color: '#666', marginTop: '4px', fontWeight: 'normal' }}>
            Includes custom crating, export clearance, and door-to-door airfreight.
          </span>
        </label>
        <div className={styles.selectWrapper}>
          <select
            id="shipping-region"
            className={styles.select}
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
          >
            {REGIONS.map((region) => (
              <option key={region.id} value={region.id} disabled={region.id === "default"}>
                {region.name} {region.cost ? `(+${formatter.format(region.cost)})` : ""}
              </option>
            ))}
          </select>
          <div className={styles.arrowIcon}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {totalCost && (
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Estimated Total (incl. shipping)</span>
          <span className={styles.totalAmount}>{formatter.format(totalCost)}</span>
        </div>
      )}
    </div>
  );
}
