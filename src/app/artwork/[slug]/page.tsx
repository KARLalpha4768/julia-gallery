import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { artworks, getArtworkBySlug, getArtworksBySeries } from "@/lib/data";
import { ArtworkActions } from "@/components/product/ArtworkActions";
import { CurrencyConverter } from "@/components/product/CurrencyConverter";
import { ShippingCalculator } from "@/components/product/ShippingCalculator";
import { ArtworkCarousel } from "@/components/product/ArtworkCarousel";
import { SocialShare } from "@/components/product/SocialShare";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { RecordArtworkView } from "@/components/product/RecordArtworkView";
import type { Metadata } from "next";
import styles from "./page.module.css";

const SITE_URL = "https://erze-art.vercel.app";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return artworks.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);
  if (!artwork) return { title: "Artwork Not Found" };

  return {
    title: `${artwork.title} — Julia Art`,
    description: artwork.description,
    openGraph: {
      title: `${artwork.title} — Julia Art`,
      description: artwork.description,
      images: [{ url: artwork.src }],
    },
  };
}

export default async function ArtworkPage({ params }: { params: Params }) {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);

  if (!artwork) notFound();

  const relatedWorks = getArtworksBySeries(artwork.series)
    .filter((a) => a.id !== artwork.id)
    .slice(0, 3);

  /* JSON-LD Product structured data for Google rich results */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: artwork.title,
    description: artwork.description,
    image: `${SITE_URL}${artwork.src}`,
    url: `${SITE_URL}/artwork/${artwork.slug}`,
    brand: {
      "@type": "Brand",
      name: "Julia Art",
    },
    creator: {
      "@type": "Person",
      name: "Julia Andrasy",
    },
    material: artwork.materials.join(", "),
    artMedium: artwork.medium,
    artworkSurface: artwork.materials[1] || "Archival paper",
    dateCreated: String(artwork.year),
    offers: {
      "@type": "Offer",
      price: artwork.price,
      priceCurrency: "USD",
      availability: artwork.available
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      seller: {
        "@type": "Organization",
        name: "Julia Gallery",
      },
    },
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <Link href="/#collection">Collection</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{artwork.title}</span>
      </nav>

      {/* Record this view */}
      <RecordArtworkView artworkId={artwork.id} />

      {/* Main Content */}
      <div className={styles.layout}>
        {/* Image Column — Carousel */}
        <div className={styles.imageCol}>
          <ArtworkCarousel
            images={artwork.images && artwork.images.length > 0 ? artwork.images : [artwork.src]}
            title={artwork.title}
          />
        </div>

        {/* Details Column */}
        <div className={styles.detailsCol}>
          <div className={styles.seriesBadge}>{artwork.series}</div>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{artwork.title}</h1>
            <FavoriteButton artworkId={artwork.id} />
          </div>

          {artwork.locationUrl && (
            <a 
              href={artwork.locationUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.locationLink}
              title={`View ${artwork.locationName} on map`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Inspired by {artwork.locationName} — View Map
            </a>
          )}

          <div className={styles.priceBlock}>
            <span className={styles.price}>{artwork.priceFormatted}</span>
            <span className={styles.priceNote}>USD</span>
          </div>

          <CurrencyConverter usdPrice={artwork.price} />
          
          <ShippingCalculator basePrice={artwork.price} />

          <p className={styles.description}>{artwork.description}</p>

          {/* Specifications */}
          <div className={styles.specs}>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Medium</span>
              <span className={styles.specValue}>{artwork.medium}</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Dimensions</span>
              <span className={styles.specValue}>{artwork.dimensions}</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Year</span>
              <span className={styles.specValue}>{artwork.year}</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Framing</span>
              <span className={styles.specValue}>{artwork.framed ? "Framed" : "Unframed — ships flat"}</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Provenance</span>
              <span className={styles.specValue}>{artwork.provenance}</span>
            </div>
          </div>

          {/* Materials */}
          <div className={styles.materialsSection}>
            <h3 className={styles.materialsTitle}>Materials</h3>
            <ul className={styles.materialsList}>
              {artwork.materials.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <ArtworkActions artwork={artwork} />

          {/* Trust Signals */}
          <div className={styles.trust}>
            <div className={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Certificate of Authenticity included
            </div>
            <div className={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>
                White-glove door-to-door airfreight powered by <a href="https://www.agsmovers.com/additional-services/fine-art/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>AGS Fine Art</a>
              </span>
            </div>
            <div className={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              14-day return guarantee
            </div>
          </div>

          {/* Social Share */}
          <SocialShare
            url={`${SITE_URL}/artwork/${artwork.slug}`}
            title={artwork.title}
            image={`${SITE_URL}${artwork.src}`}
            description={artwork.description}
          />
        </div>
      </div>

      {/* Related Works */}
      {relatedWorks.length > 0 && (
        <section className={styles.related}>
          <h2 className={styles.relatedHeading}>
            More from <em>{artwork.series}</em>
          </h2>
          <div className={styles.relatedGrid}>
            {relatedWorks.map((work) => (
              <Link
                href={`/artwork/${work.slug}`}
                key={work.id}
                className={styles.relatedCard}
              >
                <div className={styles.relatedImage}>
                  <Image
                    src={work.src}
                    alt={work.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    quality={80}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h3 className={styles.relatedTitle}>{work.title}</h3>
                <span className={styles.relatedPrice}>{work.priceFormatted}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
