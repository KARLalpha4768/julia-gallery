import styles from "./ArtCollageBorder.module.css";

interface ArtCollageBorderProps {
  thin?: boolean;
  vertical?: boolean;
}

export function ArtCollageBorder({ thin = false, vertical = false }: ArtCollageBorderProps) {
  const cls = [
    styles.border,
    thin ? styles.thin : "",
    vertical ? styles.vertical : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} role="separator" aria-hidden="true">
      <div className={styles.gradient} />
      <div className={styles.noise} />
      <div className={styles.brushStroke} />
      <div className={styles.shimmer} />
    </div>
  );
}
