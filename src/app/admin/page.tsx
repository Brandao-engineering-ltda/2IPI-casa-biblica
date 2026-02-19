"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCourses, type CourseData } from "@/lib/courses";
import { getEnrollmentsByCourse, type CourseEnrollments } from "@/lib/admin";

export default function AdminDashboardPage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollments[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesData, enrollmentsData] = await Promise.all([
          getAllCourses(),
          getEnrollmentsByCourse(),
        ]);
        setCourses(coursesData);
        setEnrollments(enrollmentsData);
      } catch {
        // Firestore unavailable
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const published = courses.filter((c) => c.published);
  const unpublished = courses.filter((c) => !c.published);
  const statuses = {
    "em-andamento": courses.filter((c) => c.status === "em-andamento").length,
    proximo: courses.filter((c) => c.status === "proximo").length,
    "em-breve": courses.filter((c) => c.status === "em-breve").length,
  };

  const enrollmentMap = new Map(enrollments.map((e) => [e.courseId, e.enrollments.length]));
  const totalEnrollments = enrollments.reduce((sum, e) => sum + e.enrollments.length, 0);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-navy sm:mb-8 sm:text-2xl">Painel Administrativo</h1>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <StatCard label="Total de Cursos" value={courses.length} color="bg-navy" />
        <StatCard label="Publicados" value={published.length} color="bg-green-600" />
        <StatCard label="Nao Publicados" value={unpublished.length} color="bg-navy-light" />
        <StatCard label="Total de Alunos" value={totalEnrollments} color="bg-primary" />
      </div>

      {/* Status Breakdown */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-md sm:mb-8 sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-navy">Status dos Cursos</h2>
        <div className="space-y-3">
          <StatusRow label="Em Andamento" count={statuses["em-andamento"]} color="bg-green-600" />
          <StatusRow label="Proximo" count={statuses.proximo} color="bg-primary" />
          <StatusRow label="Em Breve" count={statuses["em-breve"]} color="bg-navy-light" />
        </div>
      </div>

      {/* Enrollments per Course */}
      <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">Alunos por Curso</h2>
          <Link
            href="/admin/enrollments"
            className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            Ver detalhes
          </Link>
        </div>
        {courses.length === 0 ? (
          <p className="text-sm italic text-navy-light">Nenhum curso cadastrado</p>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => {
              const count = enrollmentMap.get(course.id) || 0;
              return (
                <div key={course.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        course.published ? "bg-green-500" : "bg-navy-light/30"
                      }`}
                    />
                    <span className="text-sm text-navy">{course.title}</span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                      count > 0
                        ? "bg-primary/10 text-primary"
                        : "bg-navy-light/10 text-navy-light"
                    }`}
                  >
                    {count} aluno{count !== 1 ? "s" : ""}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6">
      <p className="mb-1 text-sm text-navy-light">{label}</p>
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center`}>
          <span className="text-lg font-bold text-white">{value}</span>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${color}`} />
        <span className="text-sm text-navy">{label}</span>
      </div>
      <span className="text-sm font-semibold text-navy">{count}</span>
    </div>
  );
}
