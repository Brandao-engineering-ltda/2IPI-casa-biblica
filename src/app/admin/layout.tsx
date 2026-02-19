"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/admin", label: "Painel", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/courses", label: "Cursos", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { href: "/admin/enrollments", label: "Matrículas", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { href: "/admin/settings", label: "Configuracoes", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

function NavItem({ item, pathname }: { item: typeof navItems[number]; pathname: string }) {
  const isActive =
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-primary/10 text-primary"
          : "text-navy-light hover:bg-cream hover:text-navy"
      }`}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={item.icon}
        />
      </svg>
      {item.label}
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/admin");
    }
  }, [loading, user, router]);

  // Close sidebar on route change (React recommended pattern for derived state)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setSidebarOpen(false);
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-navy-light">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-navy">Acesso Negado</h1>
          <p className="mb-6 text-navy-light">
            Voce nao tem permissao para acessar esta area.
          </p>
          <Link
            href="/dashboard"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-navy-light/10 bg-white px-4 py-3 md:hidden">
        <div>
          <h2 className="text-sm font-bold text-navy">Admin</h2>
          <p className="text-[10px] text-navy-light">Instituto Casa Biblica</p>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex flex-col gap-1.5"
          aria-label="Abrir menu admin"
        >
          <span className={`block h-0.5 w-6 bg-navy transition-transform ${sidebarOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-navy transition-opacity ${sidebarOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-navy transition-transform ${sidebarOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown nav */}
      {sidebarOpen && (
        <nav className="border-b border-navy-light/10 bg-white px-4 py-3 md:hidden">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.href} item={item} pathname={pathname} />
            ))}
          </div>
        </nav>
      )}

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 border-r border-navy-light/10 bg-white md:block">
          <div className="p-6">
            <h2 className="text-lg font-bold text-navy">Admin</h2>
            <p className="text-xs text-navy-light">Instituto Casa Biblica</p>
          </div>
          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <NavItem key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-background p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
