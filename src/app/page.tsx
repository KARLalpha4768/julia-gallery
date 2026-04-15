import { HeroSection } from "@/components/gallery/HeroSection";
import { CreativeStream } from "@/components/gallery/CreativeStream";
import { RecentlyViewed } from "@/components/gallery/RecentlyViewed";
import { ConceptsSection } from "@/components/gallery/ConceptsSection";
import { ArtistFilm } from "@/components/gallery/ArtistFilm";
import { AboutSection } from "@/components/gallery/AboutSection";
import { ExhibitionTimeline } from "@/components/gallery/ExhibitionTimeline";
import { NovelReader } from "@/components/novel/NovelReader";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CreativeStream />
      <RecentlyViewed />
      <ConceptsSection />
      <ArtistFilm />
      <AboutSection />
      <ExhibitionTimeline />
      <NovelReader />
    </>
  );
}
