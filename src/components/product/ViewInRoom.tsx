"use client";

import { useRef, useEffect } from "react";
import styles from "./ViewInRoom.module.css";

interface ViewInRoomProps {
  src: string;
  title: string;
  dimensions: string;
  onClose: () => void;
}

/** Parse a dimension string like '18 × 24"' into { w, h } in inches */
function parseDimensions(dim: string): { w: number; h: number } {
  const nums = dim.match(/[\d.]+/g);
  if (!nums || nums.length < 2) return { w: 24, h: 18 };
  // First number = width or height — check for "x" separator
  const a = parseFloat(nums[0]);
  const b = parseFloat(nums[1]);
  return { w: Math.max(a, b), h: Math.min(a, b) };
}

export function ViewInRoom({ src, title, dimensions, onClose }: ViewInRoomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1200;
    const H = 800;
    canvas.width = W;
    canvas.height = H;

    const { w: artW, h: artH } = parseDimensions(dimensions);

    // Scale: 1 inch = ~12px at this canvas size (room is ~100" wide)
    const pxPerInch = 12;
    const paintW = artW * pxPerInch;
    const paintH = artH * pxPerInch;

    // Room background
    ctx.fillStyle = "#f5f3ee";
    ctx.fillRect(0, 0, W, H);

    // Wall shadow/depth gradient
    const wallGrad = ctx.createLinearGradient(0, 0, 0, H);
    wallGrad.addColorStop(0, "#ece9e2");
    wallGrad.addColorStop(0.7, "#f5f3ee");
    wallGrad.addColorStop(1, "#e8e5de");
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, W, H * 0.72);

    // Baseboard
    ctx.fillStyle = "#d4d0c8";
    ctx.fillRect(0, H * 0.72, W, 6);

    // Floor
    const floorGrad = ctx.createLinearGradient(0, H * 0.72, 0, H);
    floorGrad.addColorStop(0, "#c7bfa8");
    floorGrad.addColorStop(1, "#b8af96");
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, H * 0.72 + 6, W, H * 0.28);

    // Floor wood grain lines
    ctx.strokeStyle = "rgba(0,0,0,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      const y = H * 0.72 + 20 + i * 18;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Furniture: subtle sofa shape
    const sofaY = H * 0.55;
    ctx.fillStyle = "#8a8276";
    // Sofa seat
    const sofaW = 400;
    const sofaX = (W - sofaW) / 2;
    ctx.beginPath();
    ctx.roundRect(sofaX, sofaY, sofaW, 80, [8, 8, 0, 0]);
    ctx.fill();
    // Sofa back
    ctx.fillStyle = "#7a756a";
    ctx.beginPath();
    ctx.roundRect(sofaX + 10, sofaY - 50, sofaW - 20, 55, [12, 12, 0, 0]);
    ctx.fill();
    // Sofa cushion line
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sofaX + sofaW / 2, sofaY + 5);
    ctx.lineTo(sofaX + sofaW / 2, sofaY + 75);
    ctx.stroke();

    // Artwork shadow
    const artX = (W - paintW) / 2;
    const artY = (sofaY - 70 - paintH) / 2 + 30;
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = "#fff";
    ctx.fillRect(artX - 6, artY - 6, paintW + 12, paintH + 12);
    ctx.shadowColor = "transparent";

    // Load and draw artwork
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.drawImage(img, artX, artY, paintW, paintH);

      // Frame border
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 2;
      ctx.strokeRect(artX - 1, artY - 1, paintW + 2, paintH + 2);

      // Dimension label
      ctx.fillStyle = "#666";
      ctx.font = "13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(dimensions, W / 2, artY + paintH + 28);
    };
    img.src = src;
  }, [src, dimensions]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h3 className={styles.title}>
          <em>{title}</em> — View in Room
        </h3>

        <div className={styles.canvasWrapper}>
          <canvas ref={canvasRef} className={styles.canvas} />
        </div>

        <p className={styles.note}>Approximate scale based on artwork dimensions ({dimensions})</p>
      </div>
    </div>
  );
}
