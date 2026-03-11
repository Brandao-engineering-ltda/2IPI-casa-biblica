"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import type { CourseData } from "@/lib/courses";

/* ------------------------------------------------------------------ */
/*  Shadow colors mapped by card index (loops)                        */
/* ------------------------------------------------------------------ */
const SHADOW_COLORS = [
  "rgba(217, 106, 59, 0.45)",  // primary orange
  "rgba(43, 48, 68, 0.40)",    // navy
  "rgba(181, 84, 31, 0.40)",   // primary-dark
  "rgba(102, 153, 255, 0.35)", // blue accent
  "rgba(34, 197, 94, 0.35)",   // green
  "rgba(217, 106, 59, 0.45)",  // primary orange
  "rgba(139, 92, 246, 0.35)",  // purple
  "rgba(244, 63, 94, 0.35)",   // rose
];

const MAX_VISIBLE = 6;
const ANIMATION_DURATION = 500;

/* ------------------------------------------------------------------ */
/*  Inline keyframe style (injected once)                             */
/* ------------------------------------------------------------------ */
const KEYFRAME_CSS = `
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export function CoursesStackedCarousel({
  courses,
  onCourseClick,
}: {
  courses: CourseData[];
  onCourseClick: (course: CourseData) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [titleKey, setTitleKey] = useState(0);
  const isAnimatingRef = useRef(false);
  const touchStartYRef = useRef(0);
  const stackRef = useRef<HTMLDivElement>(null);
  const total = courses.length;

  /* ---------- Navigate ---------- */
  const goTo = useCallback(
    (index: number) => {
      if (isAnimatingRef.current || total === 0) return;
      const target = ((index % total) + total) % total;
      if (target === currentIndex) return;

      isAnimatingRef.current = true;
      setExitingIndex(currentIndex);

      setTimeout(() => {
        setCurrentIndex(target);
        setExitingIndex(null);
        setTitleKey((k) => k + 1);
        isAnimatingRef.current = false;
      }, ANIMATION_DURATION);
    },
    [currentIndex, total],
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  /* ---------- Wheel ---------- */
  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 15) return;
      if (e.deltaY > 0) goNext();
      else goPrev();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [goNext, goPrev]);

  /* ---------- Touch ---------- */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const diff = touchStartYRef.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 40) return;
      if (diff > 0) goNext();
      else goPrev();
    },
    [goNext, goPrev],
  );

  /* ---------- Build visible stack ---------- */
  const getStackOrder = () => {
    const items: { course: CourseData; stackPos: number; realIndex: number }[] = [];
    for (let i = 0; i < Math.min(MAX_VISIBLE, total); i++) {
      const realIndex = (currentIndex + i) % total;
      items.push({ course: courses[realIndex], stackPos: i, realIndex });
    }
    return items;
  };

  const stackItems = getStackOrder();
  const activeCourse = courses[currentIndex];
  const shadowColor = SHADOW_COLORS[currentIndex % SHADOW_COLORS.length];

  const statusBadgeClass = (status: CourseData["status"]) => {
    switch (status) {
      case "em-andamento": return "bg-green-500 text-white";
      case "proximo": return "bg-primary text-white";
      case "em-breve": return "bg-navy-light text-white";
    }
  };

  const statusLabel = (status: CourseData["status"]) => {
    switch (status) {
      case "em-andamento": return "Em Andamento";
      case "proximo": return "Próximo";
      case "em-breve": return "Em Breve";
    }
  };

  const levelBadgeClass = (level: string) => {
    switch (level) {
      case "Iniciante": return "bg-green-100 text-green-800";
      case "Intermediário": return "bg-amber-100 text-amber-800";
      case "Avançado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (total === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAME_CSS }} />

      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-14">
        {/* Left: Stack */}
        <div className="flex w-full flex-col items-center lg:w-[55%]">
          {/* Perspective wrapper */}
          <div
            style={{
              perspective: "1200px",
              perspectiveOrigin: "50% 100%",
              width: "100%",
              maxWidth: "580px",
            }}
          >
            {/* Stack container — needs explicit height + room for upward offsets */}
            <div
              ref={stackRef}
              className="relative cursor-pointer select-none"
              style={{
                width: "100%",
                paddingTop: `${MAX_VISIBLE * 16 + 8}px`, // room for stacked cards peeking above
                transformStyle: "preserve-3d",
              }}
              onClick={goNext}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Card area with fixed aspect ratio */}
              <div
                className="relative"
                style={{ aspectRatio: "16 / 10", width: "100%" }}
              >
                {/* Floating shadow beneath stack */}
                <div
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2"
                  style={{
                    bottom: "-28px",
                    width: "90%",
                    height: "56px",
                    background:
                      "radial-gradient(ellipse 50% 45% at center, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.10) 40%, transparent 80%)",
                    filter: "blur(6px)",
                  }}
                />

                {/* Cards */}
                {stackItems
                  .slice()
                  .reverse()
                  .map(({ course, stackPos, realIndex }) => {
                    const isExiting = exitingIndex !== null && realIndex === exitingIndex;
                    const isTop = stackPos === 0 && !isExiting;

                    const baseTransform = `
                      translateY(${-16 * stackPos}px)
                      translateZ(${-20 * stackPos}px)
                      rotateX(${2.5 * stackPos}deg)
                      scale(${1 - 0.04 * stackPos})
                    `;

                    const exitTransform = `
                      translateY(-180px)
                      translateZ(80px)
                      rotateX(-8deg)
                      scale(0.9)
                    `;

                    const brightness = stackPos === 0 ? 1 : Math.max(0.5, 1 - 0.12 * stackPos);

                    return (
                      <div
                        key={`${realIndex}-${course.id}`}
                        className="absolute inset-0"
                        style={{
                          transform: isExiting ? exitTransform : baseTransform,
                          opacity: isExiting ? 0 : 1,
                          transition: isExiting
                            ? `all ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
                            : `all ${ANIMATION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                          zIndex: MAX_VISIBLE - stackPos,
                          filter: `brightness(${brightness})`,
                          transformStyle: "preserve-3d",
                          borderRadius: "14px",
                          ...(isTop
                            ? { boxShadow: `0 20px 50px -10px ${shadowColor}` }
                            : {}),
                        }}
                        onClick={(e) => {
                          if (isTop) {
                            e.stopPropagation();
                            onCourseClick(course);
                          }
                        }}
                      >
                        <div
                          className="relative h-full w-full overflow-hidden"
                          style={{ borderRadius: "14px" }}
                        >
                          <Image
                            src={course.image}
                            alt={course.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 90vw, 580px"
                            priority={stackPos === 0}
                          />
                          {/* Subtle gradient overlay on front card */}
                          {isTop && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="mt-10 flex items-center justify-center gap-2">
            {courses.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(i);
                }}
                className="h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: i === currentIndex ? "24px" : "10px",
                  backgroundColor:
                    i === currentIndex
                      ? "#D96A3B"
                      : "rgba(43, 48, 68, 0.25)",
                }}
                aria-label={`Ir para curso ${i + 1}`}
              />
            ))}
          </div>

          {/* Counter + hint */}
          <div className="mt-3 flex w-full max-w-[580px] items-center justify-between px-1">
            <p className="text-[11px] uppercase tracking-[0.15em] text-navy-light/50">
              Role ou clique para navegar
            </p>
            <p
              className="text-sm font-medium text-navy-light/60"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Right: Course info */}
        <div
          key={titleKey}
          className="flex w-full flex-col lg:w-[45%] lg:pt-4"
          style={{ animation: "fadeSlideUp 0.4s ease-out both" }}
        >
          {/* Status + level badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusBadgeClass(activeCourse.status)}`}>
              {statusLabel(activeCourse.status)}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${levelBadgeClass(activeCourse.level)}`}>
              {activeCourse.level}
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-4 text-2xl font-bold text-navy sm:text-3xl">
            {activeCourse.title}
          </h3>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed text-navy-light line-clamp-3">
            {activeCourse.description}
          </p>

          {/* Info grid */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <InfoItem
              icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              label="Início"
              value={activeCourse.startDate}
            />
            <InfoItem
              icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              label="Término"
              value={activeCourse.endDate}
            />
            <InfoItem
              icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Duração"
              value={activeCourse.duration}
            />
            <InfoItem
              icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              label="Instrutor"
              value={activeCourse.instructor || "A definir"}
            />
          </div>

          {/* CTA */}
          <button
            onClick={() => onCourseClick(activeCourse)}
            className="mt-8 inline-flex w-fit items-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Ver Detalhes
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Info item sub-component                                            */
/* ------------------------------------------------------------------ */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-navy/5 px-4 py-3">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-light/60">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-navy">{value}</p>
      </div>
    </div>
  );
}
