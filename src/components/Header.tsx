"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-2ipi.jpg"
            alt="Logo 2ª IPI de Maringá"
            width={44}
            height={44}
            className="rounded-md"
          />
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-cream leading-tight">
              Instituto Casa Bíblica
            </span>
            <span className="block text-xs text-cream-dark">
              2ª IPI de Maringá
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#cursos"
            className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
          >
            Cursos
          </Link>
          <Link
            href="#sobre"
            className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
          >
            Sobre
          </Link>
          <Link
            href="#contato"
            className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
          >
            Contato
          </Link>
          <Link
            href="#inscreva-se"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Inscreva-se
          </Link>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Abrir menu"
        >
          <span
            className={`block h-0.5 w-6 bg-cream transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-cream transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-cream transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-navy-light bg-navy px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="#cursos"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
            >
              Cursos
            </Link>
            <Link
              href="#sobre"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
            >
              Sobre
            </Link>
            <Link
              href="#contato"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
            >
              Contato
            </Link>
            <Link
              href="#inscreva-se"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Inscreva-se
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
