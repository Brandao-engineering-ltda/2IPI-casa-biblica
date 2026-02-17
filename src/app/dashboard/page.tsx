"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/Skeleton";
import { getPurchasedCourses, getCompletedLessons } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { getTotalLessons, coursesContent } from "@/lib/courseContent";

type Status = "em-andamento" | "proximo" | "em-breve";
type CourseProgress = "not-started" | "in-progress" | "completed";

interface Course {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  nivel: string;
  dataInicio: string;
  dataFim: string;
  status: Status;
  imagem: string;
}

interface UserCourse extends Course {
  progress: CourseProgress;
  progressPercentage: number;
  enrolledAt: string;
  isPaid?: boolean;
}

// Sample data - replace with actual API calls
const allCourses: Record<string, Course> = {
  "fundamentos-da-fe": {
    id: "fundamentos-da-fe",
    titulo: "Fundamentos da Fé",
    descricao:
      "Estudo das doutrinas essenciais da fé cristã reformada. Base sólida para o crescimento espiritual.",
    duracao: "8 semanas",
    nivel: "Iniciante",
    dataInicio: "11 Mai 2026",
    dataFim: "6 Jul 2026",
    status: "proximo",
    imagem: "/images/cursos/fundamentos-da-fe.jpg",
  },
  "teologia-sistematica": {
    id: "teologia-sistematica",
    titulo: "Teologia Sistemática",
    descricao:
      "Estudo aprofundado das principais doutrinas cristãs de forma organizada e sistemática.",
    duracao: "12 semanas",
    nivel: "Intermediário",
    dataInicio: "14 Abr 2026",
    dataFim: "6 Jul 2026",
    status: "proximo",
    imagem: "/images/cursos/panorama-biblico.jpg",
  },
  "hermeneutica-biblica": {
    id: "hermeneutica-biblica",
    titulo: "Hermenêutica Bíblica",
    descricao:
      "Princípios e métodos para interpretação correta das Escrituras Sagradas.",
    duracao: "10 semanas",
    nivel: "Intermediário",
    dataInicio: "20 Jun 2026",
    dataFim: "29 Ago 2026",
    status: "em-breve",
    imagem: "/images/cursos/hermeneutica.jpg",
  },
  "hermeneutica": {
    id: "hermeneutica",
    titulo: "Hermenêutica Bíblica",
    descricao:
      "Aprenda princípios de interpretação bíblica para estudar as Escrituras com profundidade e fidelidade.",
    duracao: "10 semanas",
    nivel: "Intermediário",
    dataInicio: "13 Jul 2026",
    dataFim: "21 Set 2026",
    status: "em-breve",
    imagem: "/images/cursos/hermeneutica.jpg",
  },
  "antigo-testamento": {
    id: "antigo-testamento",
    titulo: "Antigo Testamento",
    descricao:
      "Estudo aprofundado dos livros do Antigo Testamento, seu contexto histórico e sua relevância hoje.",
    duracao: "16 semanas",
    nivel: "Intermediário",
    dataInicio: "28 Set 2026",
    dataFim: "18 Jan 2027",
    status: "em-breve",
    imagem: "/images/cursos/antigo-testamento.jpg",
  },
};

const upcomingCourses: Course[] = Object.values(allCourses);

function calculateCourseProgress(courseId: string): { progress: CourseProgress; percentage: number } {
  const total = getTotalLessons(courseId);
  if (total === 0) return { progress: "not-started", percentage: 0 };

  const completed = getCompletedLessons(courseId);
  const completedCount = completed.size;

  if (completedCount === 0) return { progress: "not-started", percentage: 0 };
  if (completedCount >= total) return { progress: "completed", percentage: 100 };
  return { progress: "in-progress", percentage: Math.round((completedCount / total) * 100) };
}

export default function DashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [certificateCourse, setCertificateCourse] = useState<UserCourse | null>(null);

  // Derive user name from auth state
  const fullName = userProfile?.fullName || user?.displayName || "";
  const userName = fullName ? fullName.split(" ")[0] : "";

  // Derive courses from localStorage (synchronous)
  const { userCourses, enrolledCourseIds } = useMemo(() => {
    if (authLoading) return { userCourses: [] as UserCourse[], enrolledCourseIds: new Set<string>() };

    const purchases = getPurchasedCourses();
    const courses: UserCourse[] = purchases
      .filter((purchase) => allCourses[purchase.courseId])
      .map((purchase) => {
        const courseData = allCourses[purchase.courseId];
        const { progress, percentage } = calculateCourseProgress(purchase.courseId);
        return {
          ...courseData,
          progress,
          progressPercentage: percentage,
          enrolledAt: new Date(purchase.purchaseDate).toLocaleDateString('pt-BR'),
          isPaid: true,
        };
      });

    return {
      userCourses: courses,
      enrolledCourseIds: new Set(purchases.map(p => p.courseId)),
    };
  }, [authLoading]);

  if (authLoading) {
    return <DashboardSkeleton />;
  }

  const currentCourses = userCourses.filter(c => c.progress === "in-progress");
  const completedCourses = userCourses.filter(c => c.progress === "completed");
  const upcomingEnrolledCourses = userCourses.filter(c => c.progress === "not-started");

  return (
    <section className="relative min-h-[calc(100vh-80px)] bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/logo-3d.png"
              alt="Logo Instituto Casa Bíblica"
              width={56}
              height={56}
              className="rounded-xl"
            />
            <div>
              <h1 className="text-3xl font-bold text-navy">
                {userName ? `Olá, ${userName}!` : "Meus Cursos"}
              </h1>
              <p className="text-sm text-navy-light">
                Instituto Casa Bíblica
              </p>
            </div>
          </div>
          {userName && (
            <p className="text-base text-navy-light ml-[72px]">
              Bem-vindo de volta! Continue sua jornada de formação bíblica.
            </p>
          )}
        </div>

        {/* User Courses Section */}
        <div className="mb-16">
          {userCourses.length === 0 ? (
            // Empty State
            <div className="rounded-2xl border-2 border-dashed border-navy-light/20 bg-white p-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cream">
                <svg
                  className="h-10 w-10 text-navy-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">
                Você ainda não está matriculado em nenhum curso
              </h3>
              <p className="text-navy-light mb-6">
                Explore os cursos disponíveis abaixo e comece sua jornada de formação bíblica
              </p>
            </div>
          ) : (
            <>
              {/* Current Courses */}
              {currentCourses.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-navy mb-6">Cursos em Andamento</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {currentCourses.map((course) => (
                      <UserCourseCard key={course.id} course={course} onViewCertificate={setCertificateCourse} />
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Enrolled Courses */}
              {upcomingEnrolledCourses.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-navy mb-6">Meus Próximos Cursos</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingEnrolledCourses.map((course) => (
                      <UserCourseCard key={course.id} course={course} onViewCertificate={setCertificateCourse} />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Courses */}
              {completedCourses.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-6">Cursos Concluídos</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {completedCourses.map((course) => (
                      <UserCourseCard key={course.id} course={course} onViewCertificate={setCertificateCourse} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Available Courses Section */}
        <div className="border-t border-navy-light/20 pt-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-navy mb-2">
              Cursos Disponíveis
            </h2>
            <p className="text-lg text-navy-light">
              Inscreva-se nos próximos cursos e continue sua formação bíblica
            </p>
          </div>

          {upcomingCourses.filter((course) => !enrolledCourseIds.has(course.id)).length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-navy-light/20 bg-white p-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cream">
                <svg
                  className="h-10 w-10 text-navy-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">
                Você já está matriculado em todos os cursos disponíveis
              </h3>
              <p className="text-navy-light">
                Continue acompanhando seus cursos acima. Novos cursos serão adicionados em breve!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcomingCourses
                .filter((course) => !enrolledCourseIds.has(course.id)) // Filter out purchased courses
                .map((course) => {
                  const isEnrolled = enrolledCourseIds.has(course.id);

                  return (
                    <AvailableCourseCard
                      key={course.id}
                      course={course}
                      isEnrolled={isEnrolled}
                    />
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      {certificateCourse && (
        <CertificateModal
          course={certificateCourse}
          userName={userName}
          onClose={() => setCertificateCourse(null)}
        />
      )}
    </section>
  );
}

function UserCourseCard({ course, onViewCertificate }: { course: UserCourse; onViewCertificate: (course: UserCourse) => void }) {
  const progressLabel = {
    "not-started": "Nao iniciado",
    "in-progress": "Em progresso",
    "completed": "Concluido",
  }[course.progress];

  const progressColor = {
    "not-started": "bg-navy-light",
    "in-progress": "bg-primary",
    "completed": "bg-green-600",
  }[course.progress];

  // If course is paid, link to content page, otherwise to preview page
  const courseLink = course.isPaid ? `/curso/${course.id}/conteudo` : `/curso/${course.id}`;

  return (
    <div className="group overflow-hidden rounded-2xl border border-navy-light/10 bg-white shadow-md transition-all hover:shadow-xl">
      <Link href={courseLink} className="block">
        <div className="relative h-48 overflow-hidden bg-navy">
          <Image
            src={course.imagem}
            alt={course.titulo}
            fill
            className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
          {course.progress === "completed" && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-900/40">
              <div className="rounded-full bg-green-600 p-3">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-navy">
              {course.nivel}
            </span>
            <div className="flex items-center gap-2">
              {course.isPaid && (
                <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                  ✓ Pago
                </span>
              )}
              <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${progressColor}`}>
                {progressLabel}
              </span>
            </div>
          </div>

          <h3 className="mb-2 text-xl font-bold text-navy">
            {course.titulo}
          </h3>

          {(course.progress === "in-progress" || course.progress === "completed") && (
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-navy-light">Progresso</span>
                <span className="font-semibold text-navy">{course.progressPercentage}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-cream">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    course.progress === "completed" ? "bg-green-600" : "bg-primary"
                  }`}
                  style={{ width: `${course.progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center gap-4 text-sm text-navy-light">
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{course.duracao}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{course.dataInicio}</span>
            </div>
          </div>

          <div className={`rounded-full px-6 py-2.5 text-center text-sm font-semibold text-white transition-colors ${
            course.progress === "completed"
              ? "bg-green-600 group-hover:bg-green-700"
              : "bg-navy group-hover:bg-navy-dark"
          }`}>
            {course.progress === "completed"
              ? "✓ Curso Concluido"
              : course.isPaid
                ? "Acessar Conteudo"
                : "Ver Detalhes"}
          </div>
        </div>
      </Link>

      {course.progress === "completed" && (
        <div className="px-6 pb-6">
          <button
            onClick={() => onViewCertificate(course)}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ver Certificado
          </button>
        </div>
      )}
    </div>
  );
}

function AvailableCourseCard({
  course,
  isEnrolled,
}: {
  course: Course;
  isEnrolled: boolean;
}) {
  const statusInfo = {
    "em-andamento": { label: "Em Andamento", color: "bg-green-600" },
    "proximo": { label: "Proximo", color: "bg-primary" },
    "em-breve": { label: "Em Breve", color: "bg-navy-light" },
  }[course.status];

  return (
    <div className="group overflow-hidden rounded-2xl border border-navy-light/10 bg-white shadow-md transition-all hover:shadow-xl">
      <Link href={`/curso/${course.id}`} className="block">
        <div className="relative h-48 overflow-hidden bg-navy">
          <Image
            src={course.imagem}
            alt={course.titulo}
            fill
            className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
          <div className="absolute right-4 top-4">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        <div className="p-6">
          <span className="mb-3 inline-block rounded-full bg-cream px-3 py-1 text-xs font-semibold text-navy">
            {course.nivel}
          </span>

          <h3 className="mb-2 text-xl font-bold text-navy">
            {course.titulo}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm text-navy-light">
            {course.descricao}
          </p>

          <div className="mb-4 flex flex-wrap gap-3 text-sm text-navy-light">
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{course.duracao}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{course.dataInicio}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-6 pb-6">
        <Link
          href={isEnrolled ? "#" : `/curso/${course.id}/inscricao`}
          onClick={(e) => {
            if (isEnrolled) {
              e.preventDefault();
            }
          }}
          className={`block w-full rounded-full px-6 py-2.5 text-center text-sm font-semibold transition-colors ${
            isEnrolled
              ? "bg-green-600 text-white cursor-default"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
        >
          {isEnrolled ? "✓ Inscrito" : "Inscrever-se"}
        </Link>
      </div>
    </div>
  );
}

function CertificateModal({
  course,
  userName,
  onClose,
}: {
  course: UserCourse;
  userName: string;
  onClose: () => void;
}) {
  const courseContent = coursesContent[course.id];
  const completionDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -right-2 -top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-cream"
        >
          <svg className="h-5 w-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Certificate */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Gold border effect */}
          <div className="border-8 border-double border-primary/30 m-2 rounded-xl">
            <div className="bg-gradient-to-b from-cream to-white px-8 py-10 sm:px-12 sm:py-14">
              {/* Header decorative element */}
              <div className="mb-6 flex justify-center">
                <div className="flex items-center gap-3">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
                  <Image
                    src="/logo-3d.png"
                    alt="Logo Instituto Casa Biblica"
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
                </div>
              </div>

              {/* Title */}
              <div className="mb-8 text-center">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Instituto Casa Biblica
                </p>
                <h2 className="mb-1 text-3xl font-bold text-navy sm:text-4xl">
                  Certificado de Conclusao
                </h2>
                <p className="text-sm text-navy-light">
                  2a Igreja Presbiteriana Independente de Maringa
                </p>
              </div>

              {/* Decorative line */}
              <div className="mx-auto mb-8 flex items-center justify-center gap-2">
                <div className="h-px w-20 bg-primary/30" />
                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="h-px w-20 bg-primary/30" />
              </div>

              {/* Body */}
              <div className="mb-8 text-center">
                <p className="mb-4 text-sm text-navy-light">
                  Certificamos que
                </p>
                <p className="mb-4 text-2xl font-bold text-navy sm:text-3xl" style={{ fontFamily: "serif" }}>
                  {userName || "Aluno(a)"}
                </p>
                <p className="mb-2 text-sm text-navy-light">
                  concluiu com exito o curso
                </p>
                <p className="mb-4 text-xl font-bold text-primary sm:text-2xl">
                  {course.titulo}
                </p>
                <p className="text-sm text-navy-light">
                  com carga horaria de <span className="font-semibold text-navy">{course.duracao}</span>,
                  ministrado pelo(a) <span className="font-semibold text-navy">{courseContent?.professor || "professor"}</span>.
                </p>
              </div>

              {/* Date */}
              <div className="mb-10 text-center">
                <p className="text-sm text-navy-light">
                  Maringa - PR, {completionDate}
                </p>
              </div>

              {/* Signatures */}
              <div className="flex items-end justify-around gap-8">
                <div className="flex-1 text-center">
                  <div className="mb-2 border-b border-navy-light/30 pb-1">
                    <p className="text-sm italic text-navy-light">{courseContent?.professor || "Professor"}</p>
                  </div>
                  <p className="text-xs text-navy-light/70">Professor(a)</p>
                </div>
                <div className="flex-1 text-center">
                  <div className="mb-2 border-b border-navy-light/30 pb-1">
                    <p className="text-sm italic text-navy-light">Coordenacao Academica</p>
                  </div>
                  <p className="text-xs text-navy-light/70">Instituto Casa Biblica</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-navy-light/50">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Certificado ID: ICB-{course.id.toUpperCase().slice(0, 8)}-{course.enrolledAt.replace(/\D/g, "").padStart(8, "0").slice(-8)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
