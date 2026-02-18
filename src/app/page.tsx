import { HeroSection } from "@/components/HeroSection";
import { VideoSection } from "@/components/VideoSection";
import { CoursesSection } from "@/components/CoursesSection";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <VideoSection />
      <CoursesSection />
      <AboutSection />
      <CTASection />
    </>
  );
}
