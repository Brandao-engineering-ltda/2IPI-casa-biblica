"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { auth, signOut } from "@/lib/firebase";
import { clearLocalData } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const isLoggedIn = !!user;

  // Show nav links only on home page
  const showNavLinks = pathname === "/";
  // Show login button only on home page
  const showLoginButton = pathname === "/";
  // Show logout button on dashboard and other authenticated pages
  const showLogoutButton = pathname === "/dashboard";

  // Determine logo link based on login status
  const logoHref = isLoggedIn ? "/dashboard" : "/";

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch {
      // Ignore errors
    }
    clearLocalData();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={logoHref} className="flex items-center gap-3">
          <Image
            src="/logo-3d.png"
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
          {showNavLinks && (
            <>
              <Link
                href="/#cursos"
                className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
              >
                Cursos
              </Link>
              <Link
                href="/#sobre"
                className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
              >
                Sobre
              </Link>
              <Link
                href="/#contato"
                className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
              >
                Contato
              </Link>
            </>
          )}
          {showLoginButton && (
            <Link
              href="/login"
              className="rounded-full border-2 border-cream-dark/30 px-6 py-2 text-sm font-semibold text-cream transition-colors hover:border-cream hover:text-white"
            >
              Entrar
            </Link>
          )}
          {showLogoutButton && (
            <button
              onClick={handleLogout}
              className="rounded-full border-2 border-cream-dark/30 px-6 py-2 text-sm font-semibold text-cream transition-colors hover:border-cream hover:text-white"
            >
              Sair
            </button>
          )}
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
            {showNavLinks && (
              <>
                <Link
                  href="/#cursos"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
                >
                  Cursos
                </Link>
                <Link
                  href="/#sobre"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
                >
                  Sobre
                </Link>
                <Link
                  href="/#contato"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-cream-dark transition-colors hover:text-primary-light"
                >
                  Contato
                </Link>
              </>
            )}
            {showLoginButton && (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border-2 border-cream-dark/30 px-6 py-2 text-center text-sm font-semibold text-cream transition-colors hover:border-cream hover:text-white"
              >
                Entrar
              </Link>
            )}
            {showLogoutButton && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="rounded-full border-2 border-cream-dark/30 px-6 py-2 text-center text-sm font-semibold text-cream transition-colors hover:border-cream hover:text-white"
              >
                Sair
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
