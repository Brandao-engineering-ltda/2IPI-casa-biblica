"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCourse, saveCourse, type CourseData } from "@/lib/courses";
import { useAuth } from "@/contexts/AuthContext";
import CourseForm from "../CourseForm";

export default function EditarCursoPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCourse(courseId);
        setCourse(data);
      } catch {
        // Firestore unavailable
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  async function handleSubmit(data: Parameters<typeof saveCourse>[0], changeDescription: string) {
    if (!user) return;
    await saveCourse(data, user.uid, user.email || "", changeDescription);
    // Reload to reflect saved changes
    const updated = await getCourse(courseId);
    if (updated) setCourse(updated);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-navy mb-2">Curso nao encontrado</h2>
        <Link href="/admin/courses" className="text-primary hover:text-primary-dark">
          ← Voltar para cursos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/courses"
          className="text-sm text-navy-light hover:text-primary transition-colors"
        >
          ← Voltar
        </Link>
        <h1 className="text-2xl font-bold text-navy">Editar: {course.title}</h1>
      </div>
      <CourseForm initialData={course} onSubmit={handleSubmit} />
    </div>
  );
}
