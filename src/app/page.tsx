import { HeroSection } from "@/components/gallery/HeroSection";
import { CreativeStream } from "@/components/gallery/CreativeStream";
import { ConceptsSection } from "@/components/gallery/ConceptsSection";
import { ArtistFilm } from "@/components/gallery/ArtistFilm";
import { AboutSection } from "@/components/gallery/AboutSection";
import { NovelReader } from "@/components/novel/NovelReader";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CreativeStream />
      <ConceptsSection />
      <ArtistFilm />
      <AboutSection />
      <NovelReader />
    </>
  );
}
