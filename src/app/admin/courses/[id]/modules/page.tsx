"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getCourse,
  getCourseModules,
  saveModule,
  deleteModule,
  saveLesson,
  deleteLesson,
  type CourseData,
  type ModuleWithLessons,
  type LessonData,
  type ModuleData,
} from "@/lib/courses";

export default function ModulosPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<CourseData | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingModule, setEditingModule] = useState<ModuleData | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lesson: LessonData } | null>(null);
  const [showNewModule, setShowNewModule] = useState(false);
  const [showNewLesson, setShowNewLesson] = useState<string | null>(null);

  async function loadData() {
    try {
      const [courseData, modulesData] = await Promise.all([
        getCourse(courseId),
        getCourseModules(courseId),
      ]);
      setCourse(courseData);
      setModules(modulesData);
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

  async function handleSaveModule(data: ModuleData) {
    await saveModule(courseId, data);
    setEditingModule(null);
    setShowNewModule(false);
    await loadData();
  }

  async function handleDeleteModule(moduleId: string) {
    if (!confirm("Tem certeza que deseja excluir este modulo e todas as suas aulas?")) return;
    await deleteModule(courseId, moduleId);
    await loadData();
  }

  async function handleSaveLesson(moduleId: string, data: LessonData) {
    await saveLesson(courseId, moduleId, data);
    setEditingLesson(null);
    setShowNewLesson(null);
    await loadData();
  }

  async function handleDeleteLesson(moduleId: string, lessonId: string) {
    if (!confirm("Tem certeza que deseja excluir esta aula?")) return;
    await deleteLesson(courseId, moduleId, lessonId);
    await loadData();
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
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/admin/courses"
            className="self-start text-sm text-navy-light hover:text-primary transition-colors sm:self-auto"
          >
            ← Voltar
          </Link>
          <h1 className="text-xl font-bold text-navy sm:text-2xl">
            Modulos: {course.title}
          </h1>
        </div>
        <button
          onClick={() => setShowNewModule(true)}
          className="self-start rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark sm:self-auto sm:px-6 sm:py-2.5 sm:text-sm"
        >
          + Novo Modulo
        </button>
      </div>

      {/* New Module Form */}
      {showNewModule && (
        <ModuleForm
          initialData={{ id: `modulo-${modules.length + 1}`, title: "", order: modules.length + 1 }}
          onSave={handleSaveModule}
          onCancel={() => setShowNewModule(false)}
        />
      )}

      {/* Modules List */}
      <div className="space-y-6">
        {modules.map((mod) => (
          <div key={mod.id} className="rounded-2xl bg-white p-4 shadow-md sm:p-6">
            {/* Module Header */}
            {editingModule?.id === mod.id ? (
              <ModuleForm
                initialData={editingModule}
                onSave={handleSaveModule}
                onCancel={() => setEditingModule(null)}
              />
            ) : (
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-navy">{mod.title}</h3>
                  <p className="text-xs text-navy-light">
                    {mod.lessons.length} aula(s) • Ordem: {mod.order}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingModule(mod)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteModule(mod.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            )}

            {/* Lessons */}
            <div className="space-y-2">
              {mod.lessons.map((lesson) => (
                <div key={lesson.id}>
                  {editingLesson?.lesson.id === lesson.id && editingLesson.moduleId === mod.id ? (
                    <LessonForm
                      initialData={lesson}
                      onSave={(data) => handleSaveLesson(mod.id, data)}
                      onCancel={() => setEditingLesson(null)}
                    />
                  ) : (
                    <div className="flex flex-col gap-2 rounded-lg bg-cream px-4 py-3 sm:flex-row sm:gap-0 sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <TypeIcon type={lesson.type} />
                        <div>
                          <p className="text-sm font-medium text-navy">{lesson.title}</p>
                          <p className="text-xs text-navy-light">{lesson.duration} • {lesson.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => setEditingLesson({ moduleId: mod.id, lesson })}
                          className="rounded px-2 py-1 text-xs text-primary hover:bg-primary/10"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(mod.id, lesson.id)}
                          className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* New Lesson */}
            {showNewLesson === mod.id ? (
              <div className="mt-3">
                <LessonForm
                  initialData={{
                    id: `aula-${mod.lessons.length + 1}`,
                    title: "",
                    duration: "",
                    type: "video",
                    url: "",
                    description: "",
                    order: mod.lessons.length + 1,
                  }}
                  onSave={(data) => handleSaveLesson(mod.id, data)}
                  onCancel={() => setShowNewLesson(null)}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowNewLesson(mod.id)}
                className="mt-3 text-sm font-semibold text-primary hover:text-primary-dark"
              >
                + Adicionar Aula
              </button>
            )}
          </div>
        ))}

        {modules.length === 0 && !showNewModule && (
          <div className="rounded-2xl border-2 border-dashed border-navy-light/20 bg-white p-12 text-center">
            <p className="text-navy-light">Nenhum modulo cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sub-components ---

function ModuleForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData: ModuleData;
  onSave: (data: ModuleData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initialData);

  return (
    <div className="mb-4 rounded-lg border border-primary/20 bg-cream p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-navy">ID</label>
          <input
            type="text"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="w-full rounded border border-navy-light/20 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy">Titulo</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded border border-navy-light/20 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy">Ordem</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
            className="w-full rounded border border-navy-light/20 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onSave(form)}
          className="rounded bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark"
        >
          Salvar
        </button>
        <button
          onClick={onCancel}
          className="rounded bg-navy-light/10 px-4 py-1.5 text-xs font-semibold text-navy-light hover:bg-navy-light/20"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function LessonForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData: LessonData;
  onSave: (data: LessonData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initialData);

  return (
    <div className="rounded-lg border border-primary/20 bg-cream/50 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-navy">ID</label>
          <input
            type="text"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="w-full rounded border border-navy-light/20 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy">Titulo</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded border border-navy-light/20 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy">Duracao</label>
          <input
            type="text"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            placeholder="30 min"
            className="w-full rounded border border-navy-light/20 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy">Tipo</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as LessonData["type"] })}
            className="w-full rounded border border-navy-light/20 px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="text">Texto</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-navy">URL</label>
          <input
            type="text"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://..."
            className="w-full rounded border border-navy-light/20 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-navy">Descricao</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full rounded border border-navy-light/20 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy">Ordem</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
            className="w-full rounded border border-navy-light/20 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onSave(form)}
          className="rounded bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark"
        >
          Salvar
        </button>
        <button
          onClick={onCancel}
          className="rounded bg-navy-light/10 px-4 py-1.5 text-xs font-semibold text-navy-light hover:bg-navy-light/20"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function TypeIcon({ type }: { type: LessonData["type"] }) {
  if (type === "video") {
    return (
      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (type === "pdf") {
    return (
      <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5 text-navy-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
