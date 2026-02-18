"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveCourse } from "@/lib/courses";
import { useAuth } from "@/contexts/AuthContext";
import CourseForm from "../CourseForm";

export default function NovoCursoPage() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleSubmit(data: Parameters<typeof saveCourse>[0], changeDescription: string) {
    if (!user) return;
    await saveCourse(data, user.uid, user.email || "", changeDescription);
    router.push("/admin/courses");
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
        <h1 className="text-2xl font-bold text-navy">Novo Curso</h1>
      </div>
      <CourseForm onSubmit={handleSubmit} isNew />
    </div>
  );
}
