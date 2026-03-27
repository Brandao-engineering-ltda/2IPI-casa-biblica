import { HeroSection } from "@/components/HeroSection";
import { GroupsSection } from "@/components/GroupsSection";
import { VideoSection } from "@/components/VideoSection";
import { CoursesSection } from "@/components/CoursesSection";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { MotionFadeIn } from "@/components/MotionFadeIn";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MotionFadeIn>
        <GroupsSection />
      </MotionFadeIn>
      <MotionFadeIn>
        <VideoSection />
      </MotionFadeIn>
      <MotionFadeIn>
        <CoursesSection />
      </MotionFadeIn>
      <MotionFadeIn>
        <AboutSection />
      </MotionFadeIn>
      <MotionFadeIn>
        <CTASection />
      </MotionFadeIn>
    </>
  );
}
