"use client";

import { useState } from "react";
import { type CourseData, isoToPortugueseDate } from "@/lib/courses";

type CourseFormData = Omit<CourseData, "createdAt" | "updatedAt">;

const defaultCourse: CourseFormData = {
  id: "",
  title: "",
  description: "",
  fullDescription: "",
  duration: "",
  level: "Iniciante",
  startDate: "",
  startDateISO: "",
  endDate: "",
  endDateISO: "",
  status: "em-breve",
  image: "/images/courses/default.jpg",
  instructor: "",
  totalHours: "",
  format: "Online ao vivo",
  objectives: [],
  syllabus: [],
  requirements: [],
  pricePix: 0,
  priceCard: 0,
  installments: 3,
  order: 0,
  published: false,
};

interface CourseFormProps {
  initialData?: CourseData;
  onSubmit: (data: CourseFormData, changeDescription: string) => Promise<void>;
  isNew?: boolean;
}

export default function CourseForm({ initialData, onSubmit, isNew }: CourseFormProps) {
  const [form, setForm] = useState<CourseFormData>(initialData ?? defaultCourse);
  const [changeDescription, setChangeDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Array field helpers
  const [newObjective, setNewObjective] = useState("");
  const [newSyllabus, setNewSyllabus] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  function updateField<K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addToArray(field: "objectives" | "syllabus" | "requirements", value: string) {
    if (!value.trim()) return;
    setForm((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
  }

  function removeFromArray(field: "objectives" | "syllabus" | "requirements", index: number) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.id || !form.title) {
      setMessage({ type: "error", text: "ID e Titulo sao obrigatorios" });
      return;
    }
    if (!isNew && !changeDescription) {
      setMessage({ type: "error", text: "Descreva as alteracoes realizadas" });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      await onSubmit(form, isNew ? "Novo curso criado" : changeDescription);
      setMessage({ type: "success", text: isNew ? "Curso criado com sucesso!" : "Curso atualizado com sucesso!" });
      if (isNew) {
        setForm(defaultCourse);
        setChangeDescription("");
      }
    } catch {
      setMessage({ type: "error", text: "Erro ao salvar o curso" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Info Basica */}
      <Section title="Informacoes Basicas">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ID (slug)" required>
            <input
              type="text"
              value={form.id}
              onChange={(e) => updateField("id", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              disabled={!isNew}
              placeholder="ex: fundamentos-da-fe"
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            />
          </Field>
          <Field label="Titulo" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Nome do curso"
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            />
          </Field>
        </div>
        <Field label="Descricao Curta">
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={2}
            placeholder="Resumo do curso em 1-2 frases"
            className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
          />
        </Field>
        <Field label="Descricao Completa">
          <textarea
            value={form.fullDescription}
            onChange={(e) => updateField("fullDescription", e.target.value)}
            rows={4}
            placeholder="Descricao detalhada do curso"
            className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Professor">
            <input
              type="text"
              value={form.instructor}
              onChange={(e) => updateField("instructor", e.target.value)}
              placeholder="Nome do professor"
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            />
          </Field>
          <Field label="Imagem (caminho)">
            <input
              type="text"
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              placeholder="/images/courses/nome.jpg"
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Nivel">
            <select
              value={form.level}
              onChange={(e) => updateField("level", e.target.value)}
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            >
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediario">Intermediario</option>
              <option value="Avancado">Avancado</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value as CourseData["status"])}
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            >
              <option value="em-breve">Em Breve</option>
              <option value="proximo">Proximo</option>
              <option value="em-andamento">Em Andamento</option>
            </select>
          </Field>
          <Field label="Ordem">
            <input
              type="number"
              value={form.order}
              onChange={(e) => updateField("order", parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            />
          </Field>
        </div>
      </Section>

      {/* Cronograma */}
      <Section title="Cronograma">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Data de Inicio">
            <input
              type="date"
              value={form.startDateISO}
              onChange={(e) => {
                const iso = e.target.value;
                updateField("startDateISO", iso);
                updateField("startDate", isoToPortugueseDate(iso));
              }}
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            />
          </Field>
          <Field label="Data de Termino">
            <input
              type="date"
              value={form.endDateISO}
              onChange={(e) => {
                const iso = e.target.value;
                updateField("endDateISO", iso);
                updateField("endDate", isoToPortugueseDate(iso));
              }}
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            />
          </Field>
          <Field label="Duracao">
            <input
              type="text"
              value={form.duration}
              onChange={(e) => updateField("duration", e.target.value)}
              placeholder="8 semanas"
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            />
          </Field>
          <Field label="Carga Horaria">
            <input
              type="text"
              value={form.totalHours}
              onChange={(e) => updateField("totalHours", e.target.value)}
              placeholder="32h de conteudo"
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            />
          </Field>
        </div>
        <Field label="Formato">
          <input
            type="text"
            value={form.format}
            onChange={(e) => updateField("format", e.target.value)}
            placeholder="Online ao vivo"
            className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
          />
        </Field>
      </Section>

      {/* Precos */}
      <Section title="Precos">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Preco PIX (R$)">
            <input
              type="number"
              step="0.01"
              value={form.pricePix}
              onChange={(e) => updateField("pricePix", parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            />
          </Field>
          <Field label="Preco Cartao (R$)">
            <input
              type="number"
              step="0.01"
              value={form.priceCard}
              onChange={(e) => updateField("priceCard", parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            />
          </Field>
          <Field label="Parcelas">
            <input
              type="number"
              value={form.installments}
              onChange={(e) => updateField("installments", parseInt(e.target.value) || 1)}
              className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            />
          </Field>
        </div>
      </Section>

      {/* Conteudo */}
      <Section title="Conteudo">
        <ArrayField
          label="Objetivos"
          items={form.objectives}
          newValue={newObjective}
          onNewValueChange={setNewObjective}
          onAdd={() => { addToArray("objectives", newObjective); setNewObjective(""); }}
          onRemove={(i) => removeFromArray("objectives", i)}
          placeholder="Adicionar objetivo..."
        />
        <ArrayField
          label="Ementa / Syllabus"
          items={form.syllabus}
          newValue={newSyllabus}
          onNewValueChange={setNewSyllabus}
          onAdd={() => { addToArray("syllabus", newSyllabus); setNewSyllabus(""); }}
          onRemove={(i) => removeFromArray("syllabus", i)}
          placeholder="Adicionar topico..."
        />
        <ArrayField
          label="Pre-requisitos"
          items={form.requirements}
          newValue={newRequirement}
          onNewValueChange={setNewRequirement}
          onAdd={() => { addToArray("requirements", newRequirement); setNewRequirement(""); }}
          onRemove={(i) => removeFromArray("requirements", i)}
          placeholder="Adicionar pre-requisito..."
        />
      </Section>

      {/* Publicacao */}
      <Section title="Publicacao">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => updateField("published", e.target.checked)}
            className="h-5 w-5 rounded border-navy-light/30 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-navy">Publicar curso (visivel para alunos)</span>
        </label>
      </Section>

      {/* Change Description (edit only) */}
      {!isNew && (
        <Section title="Descricao da Alteracao">
          <textarea
            value={changeDescription}
            onChange={(e) => setChangeDescription(e.target.value)}
            rows={2}
            placeholder="Descreva brevemente o que foi alterado..."
            className="w-full rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
            required
          />
        </Section>
      )}

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
      >
        {saving ? "Salvando..." : isNew ? "Criar Curso" : "Salvar Alteracoes"}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-lg font-bold text-navy">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function ArrayField({
  label,
  items,
  newValue,
  onNewValueChange,
  onAdd,
  onRemove,
  placeholder,
}: {
  label: string;
  items: string[];
  newValue: string;
  onNewValueChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
      <div className="mb-2 space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg bg-cream px-3 py-2 text-sm text-navy">
            <span className="flex-1">{item}</span>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => onNewValueChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }}
          placeholder={placeholder}
          className="input flex-1"
        />
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white hover:bg-navy-dark"
        >
          +
        </button>
      </div>
    </div>
  );
}
