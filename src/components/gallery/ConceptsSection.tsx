import styles from "./ConceptsSection.module.css";

const concepts = [
  {
    id: "chromatic-territories",
    title: "Chromatic Territories",
    count: 5,
    description:
      "Explorations of color as geography — where hue becomes landscape and saturation defines altitude. Each work maps a territory that exists only in pigment.",
    lineage: "Color Field · Lyrical Abstraction",
    accent: "linear-gradient(135deg, #2d8a4e 0%, #b8860b 100%)",
  },
  {
    id: "boundary-lines",
    title: "Boundary Lines",
    count: 4,
    description:
      "Investigations into edges, frontiers, and the liminal spaces where opposing forces meet. These works examine the tension between color fields — where they clash, merge, and negotiate.",
    lineage: "Lyrical Abstraction · Abstract Expressionism",
    accent: "linear-gradient(135deg, #b8860b 0%, #c75b2f 100%)",
  },
  {
    id: "oceanic-studies",
    title: "Oceanic Studies",
    count: 5,
    description:
      "A meditative series drawn from the chromatic vocabulary of the Indo-Pacific waters. Deep ceruleans, volcanic indigos, and translucent aquamarines create an immersive experience of depth and light.",
    lineage: "Color Field · Frankenthaler / Sam Francis lineage",
    accent: "linear-gradient(135deg, #1e6091 0%, #2d8a8a 100%)",
  },
  {
    id: "cyclone-studies",
    title: "Cyclone Studies",
    count: 9,
    description:
      "The newest and most ambitious works in the collection. Nine large-scale canvases — including three diptychs — capturing the raw meteorological energy of the Mauritian storm season in heavy impasto and layered texture.",
    lineage: "Neo-Expressionist Impasto · The Sublime",
    accent: "linear-gradient(135deg, #1a6b8a 0%, #0d3b52 100%)",
  },
];

export function ConceptsSection() {
  return (
    <section className={styles.section} id="concepts">
      <div className={styles.inner}>
        <span className={styles.label}>Series</span>
        <h2 className={styles.heading}>
          Four Conceptual Threads
        </h2>
        <p className={styles.description}>
          The collection is organized into four interconnected series, each
          exploring a different dimension of the relationship between color,
          place, and memory — from intimate works on paper to large-scale
          canvas.
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
                <span className={styles.lineageTag}>{concept.lineage}</span>
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

        {/* Art Historical Context */}
        <div className={styles.tradition}>
          <span className={styles.traditionLabel}>In the Tradition</span>
          <blockquote className={styles.traditionQuote}>
            &ldquo;Working in the lineage of Lyrical Abstraction &mdash; but from a vantage point
            10,000 miles from the movement&rsquo;s New York and Paris origins &mdash; Julia brings
            a new chromatography to one of contemporary painting&rsquo;s most enduring
            conversations. Her works on paper recall the luminous transparency of Sam Francis;
            her large-scale canvases carry the meteorological weight of Turner and the material
            intensity of Kiefer. What anchors both is a single geography: the Indian Ocean,
            as seen from Mauritius.&rdquo;
          </blockquote>
          <div className={styles.traditionComparators}>
            <span>Sam Francis</span>
            <span>Helen Frankenthaler</span>
            <span>J.M.W. Turner</span>
            <span>Anselm Kiefer</span>
            <span>Jean-Paul Riopelle</span>
          </div>
        </div>

        {/* What Makes It Original */}
        <div className={styles.original}>
          <span className={styles.traditionLabel}>What Makes This Work Singular</span>
          <div className={styles.originalGrid}>
            <div className={styles.originalItem}>
              <h4 className={styles.originalTitle}>Geography</h4>
              <p className={styles.originalText}>
                No major figure in Lyrical Abstraction or Color Field ever claimed the Indian
                Ocean as their visual territory. Frankenthaler was Connecticut; Sam Francis was
                Pacific California; Rothko was New York. Julia paints in Mauritian light —
                equatorial sun on volcanic soil, cyclone sky, coral lagoon — a palette and
                meteorology that has never been central to this tradition.
              </p>
            </div>
            <div className={styles.originalItem}>
              <h4 className={styles.originalTitle}>Timing</h4>
              <p className={styles.originalText}>
                The Indian Ocean is emerging as one of the most important conceptual geographies
                in contemporary art — shaped by climate urgency and the long-overdue recognition
                of postcolonial plural identity. Julia arrives before that discourse is fully
                codified in the Western art market.
              </p>
            </div>
          </div>
          <p className={styles.originalSignature}>
            &ldquo;She is not painting <em>about</em> Mauritius.
            She is painting <em>as</em> Mauritius.&rdquo;
          </p>
        </div>

      </div>
    </section>
  );
}
