import styles from "./ExhibitionTimeline.module.css";

interface Exhibition {
  year: string;
  title: string;
  venue: string;
  location: string;
  type: "solo" | "group" | "fair";
}

const exhibitions: Exhibition[] = [
  {
    year: "2025",
    title: "Chromatic Territories",
    venue: "Julia Gallery Online",
    location: "erze-art.vercel.app",
    type: "solo",
  },
  {
    year: "2024",
    title: "Island Colours — New Watercolours",
    venue: "Atelier Julia",
    location: "Budapest, Hungary",
    type: "solo",
  },
  {
    year: "2023",
    title: "Seven Coloured Earth — Art & Novel Launch",
    venue: "Book Fair & Exhibition",
    location: "Frankfurt, Germany",
    type: "fair",
  },
  {
    year: "2019",
    title: "Tropical Light — Indian Ocean Paintings",
    venue: "Caudan Waterfront Gallery",
    location: "Port Louis, Mauritius",
    type: "solo",
  },
  {
    year: "2018",
    title: "Point d'Azur — Plein Air Watercolours",
    venue: "Hibiscus Gallery",
    location: "Grand Bay, Mauritius",
    type: "solo",
  },
  {
    year: "2016",
    title: "International Art Fair",
    venue: "Selected Works Exhibition",
    location: "Vienna, Austria",
    type: "fair",
  },
  {
    year: "2010",
    title: "Flora & Fauna Studies",
    venue: "National Library Gallery",
    location: "Port Louis, Mauritius",
    type: "group",
  },
  {
    year: "2005",
    title: "European Watercolorists Abroad",
    venue: "Magyar Nemzeti Galéria",
    location: "Budapest, Hungary",
    type: "group",
  },
];

const typeLabels: Record<Exhibition["type"], string> = {
  solo: "Solo",
  group: "Group",
  fair: "Fair",
};

export function ExhibitionTimeline() {
  return (
    <section className={styles.section} id="exhibitions">
      <div className={styles.inner}>
        <span className={styles.eyebrow}>Exhibition History</span>
        <h2 className={styles.heading}>Selected Exhibitions</h2>

        <div className={styles.timeline}>
          {exhibitions.map((ex, i) => (
            <div key={i} className={styles.entry}>
              <div className={styles.yearCol}>
                <span className={styles.year}>{ex.year}</span>
                <span className={`${styles.badge} ${styles[ex.type]}`}>
                  {typeLabels[ex.type]}
                </span>
              </div>
              <div className={styles.line}>
                <div className={styles.dot} />
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{ex.title}</h3>
                <p className={styles.venue}>{ex.venue}</p>
                <p className={styles.location}>{ex.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
