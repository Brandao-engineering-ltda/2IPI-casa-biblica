import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer id="contato" className="bg-navy-dark text-cream">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo-3d.png"
                alt="Logo 2ª IPI de Maringá"
                width={40}
                height={40}
                className="rounded-md"
              />
              <div>
                <span className="text-lg font-bold text-white">
                  Instituto Casa Bíblica
                </span>
                <span className="block text-xs text-cream-dark">
                  2ª IPI de Maringá
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream-dark">
              Formação bíblica acessível para todos. Somos mais que um lugar
              para frequentar, somos Casa para você pertencer.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#cursos"
                  className="text-sm text-cream-dark transition-colors hover:text-primary-light"
                >
                  Cursos
                </Link>
              </li>
              <li>
                <Link
                  href="/#sobre"
                  className="text-sm text-cream-dark transition-colors hover:text-primary-light"
                >
                  Sobre o Instituto
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-cream-dark transition-colors hover:text-primary-light"
                >
                  Inscreva-se
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contato
            </h3>
            <ul className="space-y-3 text-sm text-cream-dark">
              <li>Av. Mauá, 1988 - Zona 09</li>
              <li>Maringá - PR</li>
              <li>
                <a
                  href="https://www.instagram.com/2ipimaringa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary-light"
                >
                  @2ipimaringa
                </a>
              </li>
              <li>
                <a
                  href="https://ipimaringa.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary-light"
                >
                  ipimaringa.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-navy-light pt-8 text-center text-xs text-navy-light">
          &copy; {new Date().getFullYear()} Instituto Casa Bíblica — 2ª Igreja
          Presbiteriana Independente de Maringá. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
