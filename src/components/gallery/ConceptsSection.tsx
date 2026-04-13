import styles from "./ConceptsSection.module.css";

const concepts = [
  {
    id: "chromatic-territories",
    title: "Chromatic Territories",
    count: 5,
    description:
      "Explorations of color as geography — where hue becomes landscape and saturation defines altitude. Each work maps a territory that exists only in pigment.",
    accent: "linear-gradient(135deg, #2d8a4e 0%, #b8860b 100%)",
  },
  {
    id: "boundary-lines",
    title: "Boundary Lines",
    count: 4,
    description:
      "Investigations into edges, frontiers, and the liminal spaces where opposing forces meet. These works examine the tension between color fields — where they clash, merge, and negotiate.",
    accent: "linear-gradient(135deg, #b8860b 0%, #c75b2f 100%)",
  },
  {
    id: "oceanic-studies",
    title: "Oceanic Studies",
    count: 5,
    description:
      "A meditative series drawn from the chromatic vocabulary of the Indo-Pacific waters. Deep ceruleans, volcanic indigos, and translucent aquamarines create an immersive experience of depth and light.",
    accent: "linear-gradient(135deg, #1e6091 0%, #2d8a8a 100%)",
  },
];

export function ConceptsSection() {
  return (
    <section className={styles.section} id="concepts">
      <div className={styles.inner}>
        <span className={styles.label}>Series</span>
        <h2 className={styles.heading}>
          Three Conceptual Threads
        </h2>
        <p className={styles.description}>
          The collection is organized into three interconnected series, each
          exploring a different dimension of the relationship between color,
          place, and memory.
        </p>

        <div className={styles.grid}>
          {concepts.map((concept, i) => (
            <a
              href="/#collection"
              key={concept.id}
              className={styles.card}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className={styles.cardAccent} style={{ background: concept.accent }} />
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{concept.title}</h3>
                  <span className={styles.cardCount}>{concept.count} works</span>
                </div>
                <p className={styles.cardDescription}>{concept.description}</p>
                <span className={styles.exploreLink}>
                  Explore series
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
