import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy-dark">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center lg:py-36">
        <Image
          src="/logo-3d.png"
          alt="Logo Instituto Casa Bíblica"
          width={80}
          height={80}
          className="mb-8 rounded-xl"
        />

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
          Instituto{" "}
          <span className="text-primary">Casa Bíblica</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream-dark md:text-xl">
          Formação bíblica para todos os membros da Casa. Conheça nossos cursos
          e aprofunde-se na Palavra de Deus com a comunidade da 2ª IPI de
          Maringá.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="#cursos"
            className="rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Explorar Cursos
          </Link>
          <Link
            href="#sobre"
            className="rounded-full border-2 border-cream-dark/30 px-8 py-3.5 text-base font-semibold text-cream transition-colors hover:border-cream hover:text-white"
          >
            Saiba Mais
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-cream-dark">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>Cursos Gratuitos</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Comunidade SOMOS CASA</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Certificado de Conclusão</span>
          </div>
        </div>
      </div>
    </section>
  );
}
