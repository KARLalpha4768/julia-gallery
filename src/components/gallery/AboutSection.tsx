import Image from "next/image";
import styles from "./AboutSection.module.css";

export function AboutSection() {
  return (
    <section className={styles.section} id="about">
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Image Column */}
          <div className={styles.imageCol}>
            <div className={styles.imageFrame}>
              <Image
                src="/artwork/piece-4.jpeg"
                alt="Artist studio — close-up of a painting in progress"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
                style={{ objectFit: "cover" }}
                className={styles.img}
              />
            </div>
            <div className={styles.floatingCard}>
              <span className={styles.floatingNumber}>24</span>
              <span className={styles.floatingLabel}>Original works<br/>available</span>
            </div>
          </div>

          {/* Text Column */}
          <div className={styles.textCol}>
            <span className={styles.label}>About the Artist</span>
            <h2 className={styles.heading}>
              Painting the Space
              <br />
              <em>Between Worlds</em>
            </h2>
            <div className={styles.body}>
              <p>
                The works in this collection emerge from a profound personal renaissance
                on the island of Mauritius. Fleeing chronic illness in Europe, Julia
                found healing in the monsoon light, the coral lagoons of Point d'Azur,
                and the raw volcanic energy of the Indian Ocean. Each piece explores
                the boundary between sheer survival and creative rebirth.
              </p>
              <p>
                Working primarily with acrylics on archival paper—reminiscent of the
                days she ground her own pigments from saffron, island earth, and
                burned wood—Julia builds layers of translucent washes that create
                depth impossible to reproduce digitally. Every original carries the
                texture of the hand, the discipline of <em>alla prima</em>, and the weight of intention.
              </p>
              <p>
                The Indo-Pacific region—whether it's the silhouette of Coin de Mire
                or the naked strata of the Seven Coloured Earth—provides her chromatic
                vocabulary. These are not merely landscapes, but translations of lived
                island experience into pure color and light.
              </p>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>4</span>
                <span className={styles.statLabel}>Series</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>24</span>
                <span className={styles.statLabel}>Artworks</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>2</span>
                <span className={styles.statLabel}>Years</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
