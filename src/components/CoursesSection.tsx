"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { getPublishedCourses, type CourseData } from "@/lib/courses";

function statusBadge(status: CourseData["status"]) {
  switch (status) {
    case "em-andamento":
      return {
        label: "Em Andamento",
        className: "bg-green-500 text-white",
      };
    case "proximo":
      return {
        label: "Próximo",
        className: "bg-primary text-white",
      };
    case "em-breve":
      return {
        label: "Em Breve",
        className: "bg-navy-light text-white",
      };
  }
}

function nivelColor(nivel: string) {
  switch (nivel) {
    case "Iniciante":
      return "bg-green-100 text-green-800";
    case "Intermediário":
      return "bg-amber-100 text-amber-800";
    case "Avançado":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function CourseDialog({
  course,
  onClose,
}: {
  course: CourseData;
  onClose: () => void;
}) {
  const badge = statusBadge(course.status);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-navy-dark shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover opacity-25"
            sizes="(max-width: 672px) 100vw, 672px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/90 to-navy-dark/60" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Fechar"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="relative flex flex-col items-center p-10 text-center md:p-14">
          {/* Logo */}
          <Image
            src="/logo-3d.png"
            alt="Logo 2ª IPI de Maringá"
            width={56}
            height={56}
            className="rounded-lg"
          />

          <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-cream-dark">
            Instituto Casa Bíblica
          </span>

          {/* Badges */}
          <div className="mt-6 flex items-center gap-3">
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${badge.className}`}
            >
              {badge.label}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${nivelColor(course.level)}`}
            >
              {course.level}
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-6 text-3xl font-extrabold text-white md:text-4xl">
            {course.title}
          </h3>

          {/* Description */}
          <p className="mt-5 max-w-lg text-base leading-relaxed text-cream-dark">
            {course.description}
          </p>

          {/* Dates & Duration */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-cream-dark">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary-light" />
              <span>Início: {course.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary-light" />
              <span>Término: {course.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-primary-light"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{course.duration}</span>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/login"
            onClick={() => onClose()}
            className="mt-10 inline-flex cursor-pointer items-center rounded-full bg-primary px-10 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Inscreva-se Agora
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeaturedCourse({
  course,
  onClick,
}: {
  course: CourseData;
  onClick: () => void;
}) {
  const badge = statusBadge(course.status);

  return (
    <article
      className="group relative col-span-full cursor-pointer overflow-hidden rounded-2xl bg-navy-dark shadow-lg lg:min-h-[360px]"
      onClick={onClick}
    >
      <div className="absolute inset-0">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover opacity-40 transition-opacity duration-500 group-hover:opacity-60"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/80 to-transparent" />
      </div>

      <div className="relative flex flex-col justify-center gap-6 p-10 lg:max-w-2xl lg:p-16">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${badge.className}`}
          >
            {badge.label}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${nivelColor(course.level)}`}
          >
            {course.level}
          </span>
        </div>

        <h3 className="text-3xl font-extrabold text-white md:text-4xl">
          {course.title}
        </h3>

        <p className="text-base leading-relaxed text-cream-dark md:text-lg">
          {course.description}
        </p>

        <div className="flex flex-wrap items-center gap-6 text-sm text-cream-dark">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary-light" />
            <span>
              {course.startDate} — {course.endDate}
            </span>
          </div>
          <span className="text-cream-dark/60">|</span>
          <span>{course.duration}</span>
        </div>

        <span className="mt-2 inline-flex w-fit items-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-primary-dark">
          Ver Detalhes
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </article>
  );
}

function CourseCard({
  course,
  onClick,
}: {
  course: CourseData;
  onClick: () => void;
}) {
  const badge = statusBadge(course.status);

  return (
    <article
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
      onClick={onClick}
    >
      {/* Image reveal on hover */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="course-image-reveal absolute inset-0 overflow-hidden">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/70 to-navy-dark/40" />
        </div>
      </div>

      {/* Hover overlay content */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <h3 className="text-xl font-bold text-white">{course.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cream-dark">
          {course.description}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-cream-dark">
          <CalendarIcon className="h-3.5 w-3.5 text-primary-light" />
          <span>
            {course.startDate} — {course.endDate}
          </span>
        </div>
        <span className="mt-4 inline-flex w-fit items-center rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white">
          Ver Detalhes
        </span>
      </div>

      {/* Default content */}
      <div className="relative z-0 flex flex-1 flex-col p-8 transition-opacity duration-300 group-hover:opacity-0">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${badge.className}`}
          >
            {badge.label}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${nivelColor(course.level)}`}
          >
            {course.level}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-bold text-navy">{course.title}</h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-light">
          {course.description}
        </p>

        <div className="mt-6 flex items-center gap-2 text-xs text-navy-light">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>
            {course.startDate} — {course.endDate}
          </span>
          <span className="text-navy-light/40">|</span>
          <span>{course.duration}</span>
        </div>

      </div>
    </article>
  );
}

export function CoursesSection() {
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getPublishedCourses();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section id="courses" className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-navy md:text-4xl">
              Nossos Cursos
            </h2>
            <p className="mt-4 text-lg text-navy-light">
              Trilhas de formação bíblica para cada etapa da sua caminhada
            </p>
          </div>
          <div className="mt-14 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section id="courses" className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold text-navy md:text-4xl">
            Nossos Cursos
          </h2>
          <p className="mt-4 text-lg text-navy-light">
            Em breve novos cursos serão disponibilizados.
          </p>
        </div>
      </section>
    );
  }

  const [currentCourse, ...upcomingCourses] = courses;

  return (
    <section id="courses" className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-navy md:text-4xl">
            Nossos Cursos
          </h2>
          <p className="mt-4 text-lg text-navy-light">
            Trilhas de formação bíblica para cada etapa da sua caminhada
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeaturedCourse
            course={currentCourse}
            onClick={() => setSelectedCourse(currentCourse)}
          />

          {upcomingCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => setSelectedCourse(course)}
            />
          ))}
        </div>
      </div>

      {selectedCourse && (
        <CourseDialog
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </section>
  );
}
