"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-navy-dark">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-md px-6 py-16">
        <div className="rounded-2xl border border-cream-dark/10 bg-navy p-8 shadow-xl">
          <div className="flex flex-col items-center">
            <Image
              src="/logo-3d.png"
              alt="Logo Instituto Casa Bíblica"
              width={64}
              height={64}
              className="mb-6 rounded-xl"
            />
            <h1 className="text-2xl font-bold text-white">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 text-sm text-cream-dark">
              Acesse sua conta do Instituto Casa Bíblica
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-cream-dark"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-cream-dark/20 bg-navy-dark px-4 py-3 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-cream-dark"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-cream-dark/20 bg-navy-dark px-4 py-3 text-sm text-cream placeholder:text-cream-dark/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
            >
              ← Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
