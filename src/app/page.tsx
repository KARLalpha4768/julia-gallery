import { HeroSection } from "@/components/gallery/HeroSection";
import { CreativeStream } from "@/components/gallery/CreativeStream";
import { ConceptsSection } from "@/components/gallery/ConceptsSection";
import { AboutSection } from "@/components/gallery/AboutSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CreativeStream />
      <ConceptsSection />
      <AboutSection />
    </>
  );
}
