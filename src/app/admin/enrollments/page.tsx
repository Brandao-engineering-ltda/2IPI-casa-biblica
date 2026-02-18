"use client";

import { useState, useEffect } from "react";
import {
  getEnrollmentsByCourse,
  type CourseEnrollments,
} from "@/lib/admin";
import { exportEnrollmentsCSV } from "@/lib/csv-export";

export default function EnrollmentsPage() {
  const [data, setData] = useState<CourseEnrollments[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const enrollments = await getEnrollmentsByCourse();
        setData(enrollments);
        // Expand all courses by default
        setExpanded(new Set(enrollments.map((e) => e.courseId)));
      } catch (err) {
        console.error("Failed to fetch enrollments:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function toggleExpanded(courseId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const totalEnrollments = data.reduce(
    (sum, c) => sum + c.enrollments.length,
    0
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            Matrículas por Curso
          </h1>
          <p className="mt-1 text-sm text-navy-light">
            {totalEnrollments} matrícula{totalEnrollments !== 1 ? "s" : ""} em{" "}
            {data.length} curso{data.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-navy-light/20 bg-white p-12 text-center">
          <p className="text-navy-light">Nenhuma matrícula encontrada</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((course) => (
            <div
              key={course.courseId}
              className="overflow-hidden rounded-2xl bg-white shadow-md"
            >
              {/* Course Header */}
              <button
                onClick={() => toggleExpanded(course.courseId)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-cream/50"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`h-5 w-5 text-navy-light transition-transform ${
                      expanded.has(course.courseId) ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <h2 className="text-lg font-bold text-navy">
                    {course.courseTitle}
                  </h2>
                  <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                    {course.enrollments.length} aluno
                    {course.enrollments.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    exportEnrollmentsCSV(
                      course.courseTitle,
                      course.enrollments
                    );
                  }}
                  className="rounded-lg border border-navy-light/20 px-4 py-1.5 text-xs font-semibold text-navy-light transition-colors hover:border-navy hover:text-navy"
                >
                  Exportar CSV
                </button>
              </button>

              {/* Enrollments Table */}
              {expanded.has(course.courseId) && (
                <div className="border-t border-navy-light/10">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-navy-light/10 bg-cream">
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navy-light">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navy-light">
                          E-mail
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navy-light">
                          Telefone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navy-light">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navy-light">
                          Pagamento
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-navy-light">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navy-light">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.enrollments.map((user, i) => (
                        <tr
                          key={`${user.uid}-${i}`}
                          className="border-b border-navy-light/5 transition-colors hover:bg-cream/50"
                        >
                          <td className="px-6 py-3 text-sm font-medium text-navy">
                            {user.fullName || "—"}
                          </td>
                          <td className="px-6 py-3 text-sm text-navy-light">
                            {user.email || "—"}
                          </td>
                          <td className="px-6 py-3 text-sm text-navy-light">
                            {user.phone || "—"}
                          </td>
                          <td className="px-6 py-3 text-sm text-navy-light">
                            {user.purchaseDate
                              ? new Date(user.purchaseDate).toLocaleDateString(
                                  "pt-BR"
                                )
                              : "—"}
                          </td>
                          <td className="px-6 py-3 text-sm text-navy-light">
                            {user.paymentMethod === "pix"
                              ? "PIX"
                              : user.paymentMethod === "cartao"
                                ? "Cartão"
                                : user.paymentMethod || "—"}
                          </td>
                          <td className="px-6 py-3 text-right text-sm text-navy-light">
                            {user.amount
                              ? `R$ ${user.amount.toFixed(2).replace(".", ",")}`
                              : "—"}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                user.status === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {user.status === "paid" ? "Pago" : user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
