"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegistroSucessoPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-navy-dark">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-cream-dark/10 bg-navy p-8 text-center shadow-xl md:p-12">
          <div className="flex flex-col items-center">
            <div className="mb-6 rounded-full bg-primary/20 p-4">
              <svg
                className="h-16 w-16 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="mb-4 text-3xl font-bold text-white">
              Cadastro Realizado com Sucesso!
            </h1>

            <p className="mb-6 text-cream-dark">
              Obrigado por se inscrever no Instituto Casa Bíblica. Sua conta foi criada e em breve você receberá um e-mail de confirmação com mais informações.
            </p>

            <div className="mb-8 rounded-lg border border-primary/20 bg-navy-dark p-6">
              <h2 className="mb-3 text-lg font-semibold text-white">
                Próximos Passos
              </h2>
              <ul className="space-y-2 text-left text-sm text-cream-dark">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verifique seu e-mail para ativar sua conta</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Faça login para acessar os cursos disponíveis</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Explore nosso catálogo de cursos e comece sua jornada</span>
                </li>
              </ul>
            </div>

            <div className="mb-6 text-sm text-cream-dark">
              Redirecionando para o login em{" "}
              <span className="font-bold text-primary">{countdown}</span> segundos...
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Fazer Login Agora
              </Link>
              <Link
                href="/"
                className="rounded-full border border-cream-dark/20 px-8 py-3.5 text-base font-semibold text-cream-dark transition-colors hover:border-primary hover:text-primary"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
