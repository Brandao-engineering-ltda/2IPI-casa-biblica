"use client";

import { useState, useEffect } from "react";
import { getAllCourses, type CourseData } from "@/lib/courses";

export default function AdminDashboardPage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllCourses();
        setCourses(data);
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

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-navy">Painel Administrativo</h1>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de Cursos" value={courses.length} color="bg-navy" />
        <StatCard label="Publicados" value={published.length} color="bg-green-600" />
        <StatCard label="Nao Publicados" value={unpublished.length} color="bg-navy-light" />
        <StatCard label="Em Andamento" value={statuses["em-andamento"]} color="bg-primary" />
      </div>

      {/* Status Breakdown */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-bold text-navy">Status dos Cursos</h2>
        <div className="space-y-3">
          <StatusRow label="Em Andamento" count={statuses["em-andamento"]} color="bg-green-600" />
          <StatusRow label="Proximo" count={statuses.proximo} color="bg-primary" />
          <StatusRow label="Em Breve" count={statuses["em-breve"]} color="bg-navy-light" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
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
