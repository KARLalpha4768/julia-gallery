import styles from "./ArtCollageBorder.module.css";

interface ArtCollageBorderProps {
  thin?: boolean;
}

export function ArtCollageBorder({ thin = false }: ArtCollageBorderProps) {
  return (
    <div
      className={`${styles.border} ${thin ? styles.thin : ""}`}
      role="separator"
      aria-hidden="true"
    >
      <div className={styles.gradient} />
      <div className={styles.noise} />
      <div className={styles.brushStroke} />
      <div className={styles.shimmer} />
    </div>
  );
}
