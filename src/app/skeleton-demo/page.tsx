"use client";

import { useState } from "react";
import { HeroSkeleton, CoursesSkeleton, AboutSkeleton, CTASkeleton, CourseCardSkeleton, Skeleton } from "@/components/Skeleton";
import { HeroSection } from "@/components/HeroSection";
import { CoursesSection } from "@/components/CoursesSection";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { SkeletonExample } from "@/components/SkeletonExample";

export default function SkeletonDemoPage() {
  const [showSkeletons, setShowSkeletons] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            Skeleton Loading Demo
          </h1>
          <button
            onClick={() => setShowSkeletons(!showSkeletons)}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {showSkeletons ? "Show Content" : "Show Skeletons"}
          </button>
        </div>

        {/* Practical Skeleton Loading Example */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">
            Practical Loading Example
          </h2>
          <SkeletonExample />
        </section>

        {/* Individual Skeleton Components Demo */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">
            Individual Skeleton Components
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-cream-dark/10 bg-navy p-4">
              <h3 className="mb-4 text-lg font-medium text-cream">Text Skeleton</h3>
              <Skeleton variant="text" width={200} height={16} className="mb-2" />
              <Skeleton variant="text" width={150} height={16} />
            </div>

            <div className="rounded-lg border border-cream-dark/10 bg-navy p-4">
              <h3 className="mb-4 text-lg font-medium text-cream">Rectangular Skeleton</h3>
              <Skeleton variant="rectangular" width={120} height={120} />
            </div>

            <div className="rounded-lg border border-cream-dark/10 bg-navy p-4">
              <h3 className="mb-4 text-lg font-medium text-cream">Circular Skeleton</h3>
              <Skeleton variant="circular" width={80} height={80} />
            </div>

            <div className="rounded-lg border border-cream-dark/10 bg-navy p-4">
              <h3 className="mb-4 text-lg font-medium text-cream">Course Card Skeleton</h3>
              <CourseCardSkeleton />
            </div>
          </div>
        </section>

        {/* Full Section Skeletons Demo */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">
            Section Skeletons
          </h2>

          {showSkeletons ? (
            <>
              <HeroSkeleton className="mb-8" />
              <CoursesSkeleton className="mb-8" />
              <AboutSkeleton className="mb-8" />
              <CTASkeleton />
            </>
          ) : (
            <>
              <HeroSection />
              <CoursesSection />
              <AboutSection />
              <CTASection />
            </>
          )}
        </section>
      </div>
    </div>
  );
}