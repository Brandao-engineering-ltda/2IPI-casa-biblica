"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/Skeleton";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate dashboard data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Show skeleton for 1 second

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-dark">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-center gap-4">
          <Image
            src="/logo-2ipi.jpg"
            alt="Logo Instituto Casa Bíblica"
            width={48}
            height={48}
            className="rounded-xl"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">
              Painel do Aluno
            </h1>
            <p className="text-sm text-cream-dark">
              Instituto Casa Bíblica
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-cream-dark/10 bg-navy p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white">Meus Cursos</h3>
            <p className="mt-2 text-sm text-cream-dark">
              Você ainda não está matriculado em nenhum curso.
            </p>
            <Link
              href="/#cursos"
              className="mt-4 inline-block text-sm font-medium text-primary-light transition-colors hover:text-primary"
            >
              Explorar cursos →
            </Link>
          </div>

          <div className="rounded-2xl border border-cream-dark/10 bg-navy p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white">Progresso</h3>
            <p className="mt-2 text-sm text-cream-dark">
              Acompanhe seu progresso nos cursos aqui.
            </p>
          </div>

          <div className="rounded-2xl border border-cream-dark/10 bg-navy p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white">Certificados</h3>
            <p className="mt-2 text-sm text-cream-dark">
              Seus certificados de conclusão aparecerão aqui.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
          >
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </section>
  );
}
