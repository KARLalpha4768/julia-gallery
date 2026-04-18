import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ArtistChat } from "@/components/chat/ArtistChat";
import { BackToTop } from "@/components/layout/BackToTop";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://julia-gallery.vercel.app"),
  title: "Julia Art — Indo-Pacific Contemporary Art",
  description:
    "Discover original contemporary artworks from the Indo-Pacific region. Museum-grade paintings inspired by Mauritius, shipped worldwide including South Africa. Curated collections and exclusive artist editions.",
  applicationName: "Julia Art",
  keywords: [
    "contemporary art",
    "Indo-Pacific art",
    "original paintings",
    "art gallery",
    "art commerce",
    "abstract art",
    "modern art",
    "Julia Art",
    "Mauritius art",
    "South Africa art for sale",
    "contemporary art Cape Town",
    "original paintings Johannesburg",
    "Indian Ocean art",
    "African contemporary art",
    "kunst te koop",
    "hedendaagse kuns",
  ],
  openGraph: {
    title: "Julia Art — Indo-Pacific Contemporary Art",
    siteName: "Julia Art",
    description:
      "Original contemporary paintings inspired by Mauritius and the Indo-Pacific region. Museum-grade works shipped worldwide including South Africa, Europe, and the Americas.",
    type: "website",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Julia Art — Indo-Pacific Contemporary Art Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Julia Art — Indo-Pacific Contemporary Art",
    description:
      "Original contemporary paintings inspired by Mauritius and the Indo-Pacific region. Museum-grade works shipped worldwide including South Africa, Europe, and the Americas.",
    images: ["/og-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <CartProvider>
        <FavoritesProvider>
          <div id="google_translate_element" style={{ display: "none" }} aria-hidden="true"></div>
          <Script
            src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            strategy="afterInteractive"
          />
          <Script id="google-translate-init" strategy="afterInteractive">
            {`
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  autoDisplay: false
                }, 'google_translate_element');
              }
            `}
          </Script>

          {/* Google Analytics — add NEXT_PUBLIC_GA_MEASUREMENT_ID to .env.local to activate */}
          {GA_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `}
              </Script>
            </>
          )}

          <Header />
          <CartDrawer />
          <main id="main-content" style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
          <ArtistChat />
          <BackToTop />
        </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
