"use client";

import { useState, useEffect } from "react";
import { getAdminEmails, updateAdminEmails } from "@/lib/admin";

export default function ConfiguracoesPage() {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminEmails();
        setEmails(data);
      } catch {
        setMessage({ type: "error", text: "Erro ao carregar configuracoes" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddEmail = () => {
    const email = newEmail.trim().toLowerCase();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: "error", text: "E-mail invalido" });
      return;
    }
    if (emails.includes(email)) {
      setMessage({ type: "error", text: "Este e-mail ja esta na lista" });
      return;
    }
    setEmails([...emails, email]);
    setNewEmail("");
    setMessage(null);
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateAdminEmails(emails);
      setMessage({ type: "success", text: "Configuracoes salvas com sucesso!" });
    } catch {
      setMessage({ type: "error", text: "Erro ao salvar configuracoes" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-navy sm:mb-8 sm:text-2xl">Configuracoes</h1>

      <div className="max-w-2xl rounded-2xl bg-white p-4 shadow-md sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-navy">Administradores</h2>
        <p className="mb-6 text-sm text-navy-light">
          Usuarios com estes e-mails terao acesso ao painel administrativo.
        </p>

        {/* Email List */}
        <div className="mb-6 space-y-2">
          {emails.map((email) => (
            <div
              key={email}
              className="flex items-center justify-between rounded-lg bg-cream px-4 py-3"
            >
              <span className="text-sm text-navy">{email}</span>
              <button
                onClick={() => handleRemoveEmail(email)}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Remover
              </button>
            </div>
          ))}
          {emails.length === 0 && (
            <p className="text-sm italic text-navy-light">Nenhum administrador configurado</p>
          )}
        </div>

        {/* Add Email */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
            placeholder="novo@email.com"
            className="flex-1 rounded-lg border border-navy-light/20 px-4 py-2.5 text-sm text-navy outline-none focus:border-primary"
          />
          <button
            onClick={handleAddEmail}
            className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
          >
            Adicionar
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar Configuracoes"}
        </button>
      </div>
    </div>
  );
}
