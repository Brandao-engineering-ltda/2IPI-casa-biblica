"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getCourse, type CourseData } from "@/lib/courses";

export default function CoursePageClient() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const courseId = params.id as string;
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const data = await getCourse(courseId);
        setCourse(data);
      } catch {
        // Firestore unavailable
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  const handleBack = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-navy-light">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy">Curso não encontrado</h1>
          <button
            onClick={handleBack}
            className="mt-4 text-primary hover:text-primary-dark"
          >
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = {
    "em-andamento": { label: "Em Andamento", color: "bg-green-600" },
    "proximo": { label: "Próximo", color: "bg-primary" },
    "em-breve": { label: "Em Breve", color: "bg-navy-light" },
  }[course.status];

  const handleEnroll = async () => {
    router.push(`/course/${courseId}/enrollment`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Course Image */}
      <div className="relative h-[400px] overflow-hidden bg-navy">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-12">
          <div className="mb-4">
            <span className={`rounded-full px-4 py-1.5 text-sm font-semibold text-white ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            {course.title}
          </h1>
          <p className="max-w-3xl text-xl text-cream-dark">
            {course.description}
          </p>
        </div>
      </div>

      {/* Course Content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image of Jesus */}
            <div className="mb-12 overflow-hidden rounded-2xl bg-white p-8 shadow-lg">
              <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image
                  src="/images/jesus-teaching.jpg"
                  alt="Jesus Cristo ensinando"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center italic text-navy-light">
                &ldquo;Ensinando-os a observar todas as coisas que vos tenho ordenado&rdquo; - Mateus 28:20
              </p>
            </div>

            {/* About Course */}
            <div className="mb-8 rounded-2xl bg-white p-8 shadow-md">
              <h2 className="mb-4 text-2xl font-bold text-navy">Sobre o Curso</h2>
              <p className="leading-relaxed text-navy-light">
                {course.fullDescription}
              </p>
            </div>

            {/* Objectives */}
            <div className="mb-8 rounded-2xl bg-white p-8 shadow-md">
              <h2 className="mb-4 text-2xl font-bold text-navy">Objetivos do Curso</h2>
              <ul className="space-y-3">
                {course.objectives.map((objetivo, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="mt-1 h-5 w-5 flex-shrink-0 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-navy-light">{objetivo}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Program Content */}
            <div className="mb-8 rounded-2xl bg-white p-8 shadow-md">
              <h2 className="mb-4 text-2xl font-bold text-navy">Conteúdo Programático</h2>
              <div className="space-y-4">
                {course.syllabus.map((conteudo, index) => (
                  <div
                    key={index}
                    className="flex gap-4 border-l-4 border-primary pl-4"
                  >
                    <span className="text-lg font-bold text-primary">{index + 1}</span>
                    <p className="text-navy-light">{conteudo}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image of Jesus 2 */}
            <div className="mb-8 overflow-hidden rounded-2xl bg-white p-8 shadow-lg">
              <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image
                  src="/images/jesus-praying.jpg"
                  alt="Jesus Cristo orando"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center italic text-navy-light">
                &ldquo;Vinde a mim, todos os que estais cansados e oprimidos&rdquo; - Mateus 11:28
              </p>
            </div>

            {/* Requirements */}
            <div className="rounded-2xl bg-white p-8 shadow-md">
              <h2 className="mb-4 text-2xl font-bold text-navy">Requisitos</h2>
              <ul className="space-y-2">
                {course.requirements.map((requisito, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-navy-light">{requisito}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Enrollment Card */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-navy-light/10 pb-4">
                    <span className="text-sm font-semibold text-navy-light">Nível</span>
                    <span className="font-bold text-navy">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-navy-light/10 pb-4">
                    <span className="text-sm font-semibold text-navy-light">Duração</span>
                    <span className="font-bold text-navy">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-navy-light/10 pb-4">
                    <span className="text-sm font-semibold text-navy-light">Carga Horária</span>
                    <span className="font-bold text-navy">{course.totalHours}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-navy-light/10 pb-4">
                    <span className="text-sm font-semibold text-navy-light">Início</span>
                    <span className="font-bold text-navy">{course.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4">
                    <span className="text-sm font-semibold text-navy-light">Formato</span>
                    <span className="text-right text-sm font-bold text-navy">
                      {course.format}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleEnroll}
                  className="w-full rounded-full bg-primary px-8 py-4 text-base font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg"
                >
                  Inscrever-se Agora
                </button>

                <button
                  onClick={handleBack}
                  className="mt-4 w-full rounded-full border-2 border-navy-light/20 px-8 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy-light hover:bg-cream"
                >
                  ← Voltar
                </button>
              </div>

              {/* Professor Card */}
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <h3 className="mb-4 text-lg font-bold text-navy">Professor</h3>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/images/professor-placeholder.jpg"
                      alt={course.instructor}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-navy">{course.instructor}</p>
                    <p className="text-sm text-navy-light">Instrutor</p>
                  </div>
                </div>
              </div>

              {/* Jesus Image Card */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src="/images/jesus-shepherd.jpg"
                    alt="Jesus o Bom Pastor"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-center text-sm italic text-navy-light">
                    &ldquo;Eu sou o bom pastor; conheço as minhas ovelhas&rdquo; - João 10:14
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
