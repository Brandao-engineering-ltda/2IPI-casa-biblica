"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCourse, getCourseHistory, restoreCourseVersion, type CourseData, type CourseHistory } from "@/lib/courses";
import { useAuth } from "@/contexts/AuthContext";

export default function HistoricoPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [history, setHistory] = useState<CourseHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);

  async function loadData() {
    try {
      const [courseData, historyData] = await Promise.all([
        getCourse(courseId),
        getCourseHistory(courseId),
      ]);
      setCourse(courseData);
      setHistory(historyData);
    } catch {
      // Firestore unavailable
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  async function handleRestore(historyId: string) {
    if (!user) return;
    if (!confirm("Tem certeza que deseja restaurar esta versao? O estado atual sera salvo no historico.")) return;

    setRestoring(historyId);
    try {
      await restoreCourseVersion(courseId, historyId, user.uid, user.email || "");
      await loadData();
    } catch {
      // Error restoring
    } finally {
      setRestoring(null);
    }
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
      <div className="mb-6 flex flex-col gap-1 sm:mb-8 sm:flex-row sm:items-center sm:gap-4">
        <Link
          href="/admin/courses"
          className="self-start text-sm text-navy-light hover:text-primary transition-colors sm:self-auto"
        >
          ← Voltar
        </Link>
        <h1 className="text-xl font-bold text-navy sm:text-2xl">
          Historico: {course.title}
        </h1>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-navy-light/20 bg-white p-12 text-center">
          <p className="text-navy-light">Nenhum historico de alteracoes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => {
            const date = entry.timestamp?.toDate?.();
            const formattedDate = date
              ? date.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Data indisponivel";

            return (
              <div
                key={entry.id}
                className="rounded-2xl bg-white p-4 shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-0 sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-navy">{entry.changeDescription}</p>
                    <p className="mt-1 text-sm text-navy-light">
                      Por: {entry.editedByEmail} • {formattedDate}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestore(entry.id)}
                    disabled={restoring === entry.id}
                    className="self-start rounded-full border-2 border-primary px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
                  >
                    {restoring === entry.id ? "Restaurando..." : "Restaurar"}
                  </button>
                </div>

                {/* Snapshot preview */}
                {entry.snapshot && (
                  <div className="mt-4 rounded-lg bg-cream p-3 sm:p-4">
                    <p className="mb-2 text-xs font-semibold uppercase text-navy-light">Dados nesta versao:</p>
                    <div className="grid gap-2 text-xs text-navy-light sm:grid-cols-2">
                      {entry.snapshot.title && (
                        <div><span className="font-medium">Titulo:</span> {entry.snapshot.title}</div>
                      )}
                      {entry.snapshot.status && (
                        <div><span className="font-medium">Status:</span> {entry.snapshot.status}</div>
                      )}
                      {entry.snapshot.published !== undefined && (
                        <div><span className="font-medium">Publicado:</span> {entry.snapshot.published ? "Sim" : "Nao"}</div>
                      )}
                      {entry.snapshot.instructor && (
                        <div><span className="font-medium">Professor:</span> {entry.snapshot.instructor}</div>
                      )}
                      {entry.snapshot.pricePix !== undefined && (
                        <div><span className="font-medium">Preco PIX:</span> R$ {entry.snapshot.pricePix?.toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
