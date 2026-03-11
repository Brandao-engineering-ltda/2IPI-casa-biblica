import { HeroSection } from "@/components/HeroSection";
import { VideoSection } from "@/components/VideoSection";
import { CoursesSection } from "@/components/CoursesSection";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { FadeInSection } from "@/components/FadeInSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FadeInSection>
        <VideoSection />
      </FadeInSection>
      <FadeInSection>
        <CoursesSection />
      </FadeInSection>
      <FadeInSection>
        <AboutSection />
      </FadeInSection>
      <FadeInSection>
        <CTASection />
      </FadeInSection>
    </>
  );
}
