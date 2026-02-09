"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserData, getPurchasedCourses } from "@/lib/storage";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "pdf" | "text";
  url?: string;
  description: string;
  completed?: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseContent {
  id: string;
  titulo: string;
  descricao: string;
  professor: string;
  imagem: string;
  duracao: string;
  nivel: string;
  dataInicio: string;
  dataFim: string;
  modules: Module[];
}

const coursesContent: Record<string, CourseContent> = {
  "fundamentos-da-fe": {
    id: "fundamentos-da-fe",
    titulo: "Fundamentos da Fé",
    descricao: "Estudo das doutrinas essenciais da fé cristã reformada. Base sólida para o crescimento espiritual.",
    professor: "Rev. João Silva",
    imagem: "/images/cursos/fundamentos-da-fe.jpg",
    duracao: "8 semanas",
    nivel: "Iniciante",
    dataInicio: "11 Mai 2026",
    dataFim: "6 Jul 2026",
    modules: [
      {
        id: "modulo-1",
        title: "Módulo 1: Introdução à Teologia",
        lessons: [
          {
            id: "aula-1",
            title: "O que é Teologia?",
            duration: "25 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Introdução ao estudo da teologia e sua importância para a vida cristã.",
            completed: false
          },
          {
            id: "aula-2",
            title: "As Fontes da Teologia",
            duration: "30 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Compreendendo as fontes primárias e secundárias da teologia.",
            completed: false
          },
          {
            id: "pdf-1",
            title: "Apostila: Conceitos Básicos",
            duration: "15 páginas",
            type: "pdf",
            url: "/materials/fundamentos-modulo1.pdf",
            description: "Material complementar com definições e conceitos fundamentais.",
            completed: false
          }
        ]
      },
      {
        id: "modulo-2",
        title: "Módulo 2: A Doutrina de Deus",
        lessons: [
          {
            id: "aula-3",
            title: "Os Atributos de Deus",
            duration: "35 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Estudo dos atributos comunicáveis e incomunicáveis de Deus.",
            completed: false
          },
          {
            id: "aula-4",
            title: "A Trindade",
            duration: "40 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Compreendendo a doutrina trinitariana nas Escrituras.",
            completed: false
          },
          {
            id: "pdf-2",
            title: "Leitura: Confissão de Fé",
            duration: "20 páginas",
            type: "pdf",
            url: "/materials/fundamentos-modulo2.pdf",
            description: "Trechos selecionados da Confissão de Fé sobre Deus.",
            completed: false
          }
        ]
      },
      {
        id: "modulo-3",
        title: "Módulo 3: A Doutrina da Salvação",
        lessons: [
          {
            id: "aula-5",
            title: "O Pecado e suas Consequências",
            duration: "30 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Entendendo a queda da humanidade e suas implicações.",
            completed: false
          },
          {
            id: "aula-6",
            title: "A Obra de Cristo",
            duration: "45 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "A pessoa e obra redentora de Jesus Cristo.",
            completed: false
          },
          {
            id: "aula-7",
            title: "Justificação pela Fé",
            duration: "35 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Como somos justificados diante de Deus.",
            completed: false
          }
        ]
      }
    ]
  },
  "teologia-sistematica": {
    id: "teologia-sistematica",
    titulo: "Teologia Sistemática",
    descricao: "Estudo aprofundado das principais doutrinas cristãs de forma organizada e sistemática.",
    professor: "Dr. Maria Santos",
    imagem: "/images/cursos/panorama-biblico.jpg",
    duracao: "12 semanas",
    nivel: "Intermediário",
    dataInicio: "14 Abr 2026",
    dataFim: "6 Jul 2026",
    modules: [
      {
        id: "modulo-1",
        title: "Módulo 1: Introdução à Teologia Sistemática",
        lessons: [
          {
            id: "aula-1",
            title: "Método Teológico",
            duration: "40 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "Como fazer teologia de forma sistemática.",
            completed: false
          }
        ]
      }
    ]
  },
  "hermeneutica-biblica": {
    id: "hermeneutica-biblica",
    titulo: "Hermenêutica Bíblica",
    descricao: "Princípios e métodos para interpretação correta das Escrituras Sagradas.",
    professor: "Prof. Pedro Costa",
    imagem: "/images/cursos/hermeneutica.jpg",
    duracao: "10 semanas",
    nivel: "Intermediário",
    dataInicio: "20 Jun 2026",
    dataFim: "29 Ago 2026",
    modules: [
      {
        id: "modulo-1",
        title: "Módulo 1: Princípios de Interpretação",
        lessons: [
          {
            id: "aula-1",
            title: "Contexto Histórico",
            duration: "35 min",
            type: "video",
            url: "https://www.youtube.com/embed/eAvYmE2YYIU",
            description: "A importância do contexto histórico na interpretação.",
            completed: false
          }
        ]
      }
    ]
  }
};

export default function CourseContentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const course = coursesContent[courseId];

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has purchased this course
    const purchases = getPurchasedCourses();
    const purchased = purchases.some(p => p.courseId === courseId);
    
    if (!purchased) {
      // Redirect to course preview if not purchased
      router.push(`/curso/${courseId}`);
      return;
    }

    setIsPurchased(true);
    setIsLoading(false);

    // Expand first module by default
    if (course?.modules.length > 0) {
      setExpandedModules(new Set([course.modules[0].id]));
      setSelectedLesson(course.modules[0].lessons[0]);
    }
  }, [courseId, course, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-navy-light">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy mb-4">Curso não encontrado</h1>
          <Link href="/dashboard" className="text-primary hover:text-primary-dark">
            ← Voltar para o dashboard
          </Link>
        </div>
      </div>
    );
  }

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = course.modules.reduce((acc, module) => 
    acc + module.lessons.filter(l => l.completed).length, 0
  );
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-navy-light/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-sm text-navy-light hover:text-primary transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar ao Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-navy-light">Progresso do Curso</p>
                <p className="text-lg font-bold text-navy">{progressPercentage}%</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-cream flex items-center justify-center">
                <span className="text-xs font-bold text-navy">{completedLessons}/{totalLessons}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar - Course Modules */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Course Info */}
              <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">
                <div className="relative mb-4 h-32 overflow-hidden rounded-lg">
                  <Image
                    src={course.imagem}
                    alt={course.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
                <h1 className="mb-2 text-xl font-bold text-navy">{course.titulo}</h1>
                <p className="mb-3 text-sm text-navy-light">{course.descricao}</p>
                <div className="flex items-center gap-2 text-xs text-navy-light">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{course.professor}</span>
                </div>
              </div>

              {/* Modules List */}
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-bold text-navy">Conteúdo do Curso</h2>
                <div className="space-y-2">
                  {course.modules.map((module) => (
                    <div key={module.id} className="border-b border-navy-light/10 pb-2 last:border-0">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="flex w-full items-center justify-between py-2 text-left transition-colors hover:text-primary"
                      >
                        <span className="font-semibold text-sm text-navy">{module.title}</span>
                        <svg
                          className={`h-5 w-5 text-navy-light transition-transform ${
                            expandedModules.has(module.id) ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {expandedModules.has(module.id) && (
                        <div className="ml-2 mt-2 space-y-1">
                          {module.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={`flex w-full items-start gap-2 rounded-lg p-2 text-left text-sm transition-colors ${
                                selectedLesson?.id === lesson.id
                                  ? "bg-primary/10 text-primary"
                                  : "text-navy-light hover:bg-cream"
                              }`}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                {lesson.type === "video" && (
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {lesson.type === "pdf" && (
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                                )}
                                {lesson.completed && (
                                  <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="truncate font-medium">{lesson.title}</p>
                                <p className="text-xs opacity-75">{lesson.duration}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold text-navy">{selectedLesson.title}</h2>
                    <p className="text-sm text-navy-light">{selectedLesson.description}</p>
                  </div>
                  <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-navy">
                    {selectedLesson.duration}
                  </span>
                </div>

                {/* Video Player */}
                {selectedLesson.type === "video" && selectedLesson.url && (
                  <div className="mb-6">
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-navy">
                      <iframe
                        src={selectedLesson.url}
                        title={selectedLesson.title}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* PDF Viewer */}
                {selectedLesson.type === "pdf" && selectedLesson.url && (
                  <div className="mb-6">
                    <div className="rounded-lg border-2 border-dashed border-navy-light/20 bg-cream/30 p-8 text-center">
                      <svg className="mx-auto mb-4 h-16 w-16 text-navy-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <h3 className="mb-2 text-lg font-semibold text-navy">Material em PDF</h3>
                      <p className="mb-4 text-sm text-navy-light">Baixe o material para estudar</p>
                      <a
                        href={selectedLesson.url}
                        download
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                      </a>
                    </div>
                  </div>
                )}

                {/* Mark as Complete Button */}
                <div className="flex items-center justify-between border-t border-navy-light/10 pt-6">
                  <button
                    className={`rounded-full px-6 py-3 text-sm font-semibold transition-colors ${
                      selectedLesson.completed
                        ? "bg-green-600 text-white"
                        : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                  >
                    {selectedLesson.completed ? "✓ Concluído" : "Marcar como Concluído"}
                  </button>
                  <div className="flex gap-2">
                    <button className="rounded-full border-2 border-navy-light/20 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-primary hover:text-primary">
                      Aula Anterior
                    </button>
                    <button className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-dark">
                      Próxima Aula
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-2xl bg-white shadow-md">
                <div className="text-center">
                  <svg className="mx-auto mb-4 h-16 w-16 text-navy-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="text-lg font-semibold text-navy">Selecione uma aula</h3>
                  <p className="text-sm text-navy-light">Escolha uma aula no menu lateral para começar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
