"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { VideoSection } from "@/components/VideoSection";
import { CoursesSection } from "@/components/CoursesSection";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { HeroSkeleton, VideoSkeleton, CoursesSkeleton, AboutSkeleton, CTASkeleton } from "@/components/Skeleton";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Show skeletons for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <>
        <HeroSkeleton />
        <VideoSkeleton />
        <CoursesSkeleton />
        <AboutSkeleton />
        <CTASkeleton />
      </>
    );
  }

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
