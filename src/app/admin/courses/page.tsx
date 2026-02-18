"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCourses, deleteCourse, saveCourse, type CourseData } from "@/lib/courses";
import { seedDefaultCourses } from "@/lib/seed-courses";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminCursosPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

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

  async function handleDelete(course: CourseData) {
    if (!confirm(`Tem certeza que deseja arquivar "${course.title}"?`)) return;
    try {
      await deleteCourse(course.id);
      await fetchCourses();
    } catch {
      // Error deleting
    }
  }

  async function handleSeed() {
    if (!user) return;
    if (!confirm("Adicionar os 6 cursos padrão ao Firestore?")) return;
    setSeeding(true);
    try {
      await seedDefaultCourses(user.uid, user.email || "");
      await fetchCourses();
    } catch {
      // Error seeding
    } finally {
      setSeeding(false);
    }
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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Cursos</h1>
        <Link
          href="/admin/courses/new"
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          + Novo Curso
        </Link>
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
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
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
