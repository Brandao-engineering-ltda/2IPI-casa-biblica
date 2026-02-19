"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCourses, deleteCourse, saveCourse, type CourseData } from "@/lib/courses";
import { seedDefaultCourses } from "@/lib/seed-courses";
import { useAuth } from "@/contexts/AuthContext";

interface ModalState {
  open: boolean;
  title: string;
  message: string;
  type: "confirm" | "success" | "error";
  onConfirm?: () => void;
}

export default function AdminCursosPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    title: "",
    message: "",
    type: "confirm",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch {
      // Firestore unavailable
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePublish(course: CourseData) {
    if (!user) return;
    try {
      await saveCourse(
        { id: course.id, published: !course.published },
        user.uid,
        user.email || "",
        course.published ? "Despublicar curso" : "Publicar curso"
      );
      await fetchCourses();
    } catch {
      // Error toggling
    }
  }

  function handleDelete(course: CourseData) {
    setModal({
      open: true,
      title: "Arquivar Curso",
      message: `Tem certeza que deseja arquivar "${course.title}"?`,
      type: "confirm",
      onConfirm: async () => {
        setModal((m) => ({ ...m, open: false }));
        try {
          await deleteCourse(course.id);
          await fetchCourses();
        } catch {
          setModal({
            open: true,
            title: "Erro",
            message: "Erro ao arquivar o curso. Tente novamente.",
            type: "error",
          });
        }
      },
    });
  }

  function handleSeed() {
    if (!user) return;
    setModal({
      open: true,
      title: "Re-seed Cursos",
      message:
        "Isso vai adicionar (ou atualizar) os 6 cursos padrão com todos os módulos e aulas no Firestore. Deseja continuar?",
      type: "confirm",
      onConfirm: async () => {
        setModal((m) => ({ ...m, open: false }));
        setSeeding(true);
        try {
          const count = await seedDefaultCourses(user.uid, user.email || "");
          await fetchCourses();
          setModal({
            open: true,
            title: "Sucesso",
            message: `${count} cursos foram adicionados/atualizados com seus módulos e aulas.`,
            type: "success",
          });
        } catch {
          setModal({
            open: true,
            title: "Erro",
            message: "Erro ao adicionar os cursos. Verifique o console para mais detalhes.",
            type: "error",
          });
        } finally {
          setSeeding(false);
        }
      },
    });
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:gap-0 sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-navy sm:text-2xl">Cursos</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="rounded-full border-2 border-navy-light/20 px-4 py-2 text-xs font-semibold text-navy-light transition-colors hover:border-navy hover:text-navy disabled:opacity-50 sm:px-5 sm:text-sm"
          >
            {seeding ? "Atualizando..." : "Re-seed"}
          </button>
          <Link
            href="/admin/courses/new"
            className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark sm:px-6 sm:py-2.5 sm:text-sm"
          >
            + Novo Curso
          </Link>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-navy-light/20 bg-white p-12 text-center">
          <p className="text-navy-light mb-4">Nenhum curso cadastrado</p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-dark disabled:opacity-50"
          >
            {seeding ? "Adicionando..." : "Adicionar Cursos Padrão"}
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl bg-white shadow-md md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-light/10 bg-cream">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navy-light">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navy-light">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navy-light">
                    Publicado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navy-light">
                    Nivel
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-navy-light">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-navy-light/5 transition-colors hover:bg-cream/50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-navy">{course.title}</p>
                        <p className="text-xs text-navy-light">{course.instructor}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={course.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                          course.published
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {course.published ? "Sim" : "Nao"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-light">{course.level}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                        >
                          Editar
                        </Link>
                        <Link
                          href={`/admin/courses/${course.id}/modules`}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-navy-light transition-colors hover:bg-cream"
                        >
                          Modulos
                        </Link>
                        <Link
                          href={`/admin/courses/${course.id}/history`}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-navy-light transition-colors hover:bg-cream"
                        >
                          Historico
                        </Link>
                        <button
                          onClick={() => handleDelete(course)}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                        >
                          Arquivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {courses.map((course) => (
              <div key={course.id} className="rounded-2xl bg-white p-4 shadow-md">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-navy">{course.title}</p>
                    <p className="text-xs text-navy-light">{course.instructor}</p>
                  </div>
                  <StatusBadge status={course.status} />
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-navy-light">{course.level}</span>
                  <button
                    onClick={() => handleTogglePublish(course)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      course.published
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {course.published ? "Sim" : "Nao"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-navy-light/10 pt-3">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/admin/courses/${course.id}/modules`}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-navy-light transition-colors hover:bg-cream"
                  >
                    Modulos
                  </Link>
                  <Link
                    href={`/admin/courses/${course.id}/history`}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-navy-light transition-colors hover:bg-cream"
                  >
                    Historico
                  </Link>
                  <button
                    onClick={() => handleDelete(course)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                  >
                    Arquivar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            {/* Icon */}
            <div className="mb-4 flex justify-center">
              {modal.type === "confirm" && (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              {modal.type === "success" && (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {modal.type === "error" && (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="mb-2 text-center text-lg font-bold text-navy">
              {modal.title}
            </h3>

            {/* Message */}
            <p className="mb-6 text-center text-sm text-navy-light">
              {modal.message}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              {modal.type === "confirm" ? (
                <>
                  <button
                    onClick={() => setModal((m) => ({ ...m, open: false }))}
                    className="flex-1 rounded-full border-2 border-navy-light/20 px-5 py-2.5 text-sm font-semibold text-navy-light transition-colors hover:border-navy hover:text-navy"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={modal.onConfirm}
                    className="flex-1 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                  >
                    Confirmar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModal((m) => ({ ...m, open: false }))}
                  className="flex-1 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
                >
                  Fechar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: CourseData["status"] }) {
  const config = {
    "em-andamento": { label: "Em Andamento", color: "bg-green-100 text-green-700" },
    proximo: { label: "Proximo", color: "bg-primary/10 text-primary" },
    "em-breve": { label: "Em Breve", color: "bg-navy-light/10 text-navy-light" },
  }[status];

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
}
