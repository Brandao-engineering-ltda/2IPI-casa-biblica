"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/Skeleton";
import { getUserData, getPurchasedCourses } from "@/lib/storage";

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

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Simulate dashboard data loading
    const timer = setTimeout(() => {
      // Get user data
      const userData = getUserData();
      if (userData) {
        // Extract first name
        const firstName = userData.nomeCompleto.split(" ")[0];
        setUserName(firstName);
      }

      // Get purchased courses
      const purchases = getPurchasedCourses();
      const purchasedUserCourses: UserCourse[] = purchases.map((purchase) => {
        const courseData = allCourses[purchase.courseId];
        return {
          ...courseData,
          progress: "not-started" as CourseProgress,
          progressPercentage: 0,
          enrolledAt: new Date(purchase.purchaseDate).toLocaleDateString('pt-BR'),
          isPaid: true,
        };
      });
      
      setUserCourses(purchasedUserCourses);
      setEnrolledCourseIds(new Set(purchases.map(p => p.courseId)));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
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
                      <UserCourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Enrolled Courses */}
              {upcomingEnrolledCourses.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-navy mb-6">Próximos Cursos</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingEnrolledCourses.map((course) => (
                      <UserCourseCard key={course.id} course={course} />
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
                      <UserCourseCard key={course.id} course={course} />
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

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {upcomingCourses.map((course) => {
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
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-navy-light transition-colors hover:text-primary"
          >
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </section>
  );
}

function UserCourseCard({ course }: { course: UserCourse }) {
  const progressLabel = {
    "not-started": "Não iniciado",
    "in-progress": "Em progresso",
    "completed": "Concluído",
  }[course.progress];

  const progressColor = {
    "not-started": "bg-navy-light",
    "in-progress": "bg-primary",
    "completed": "bg-green-600",
  }[course.progress];

  // If course is paid, link to content page, otherwise to preview page
  const courseLink = course.isPaid ? `/curso/${course.id}/conteudo` : `/curso/${course.id}`;

  return (
    <Link href={courseLink} className="group block overflow-hidden rounded-2xl border border-navy-light/10 bg-white shadow-md transition-all hover:shadow-xl">
      <div className="relative h-48 overflow-hidden bg-navy">
        <Image
          src={course.imagem}
          alt={course.titulo}
          fill
          className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
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

        {course.progress === "in-progress" && (
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-navy-light">Progresso</span>
              <span className="font-semibold text-navy">{course.progressPercentage}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-cream">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
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

        <div className="rounded-full bg-navy px-6 py-2.5 text-center text-sm font-semibold text-white transition-colors group-hover:bg-navy-dark">
          {course.isPaid ? "Acessar Conteúdo" : "Ver Detalhes"}
        </div>
      </div>
    </Link>
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
    "proximo": { label: "Próximo", color: "bg-primary" },
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
