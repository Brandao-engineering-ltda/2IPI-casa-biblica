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
      <div className="mb-6 flex flex-col gap-1 sm:mb-8 sm:flex-row sm:items-center sm:gap-4">
        <Link
          href="/admin/courses"
          className="self-start text-sm text-navy-light hover:text-primary transition-colors sm:self-auto"
        >
          ← Voltar
        </Link>
        <h1 className="text-xl font-bold text-navy sm:text-2xl">Novo Curso</h1>
      </div>
      <CourseForm onSubmit={handleSubmit} isNew />
    </div>
  );
}
