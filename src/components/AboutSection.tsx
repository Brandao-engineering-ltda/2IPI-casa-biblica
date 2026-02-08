import Image from "next/image";

export function AboutSection() {
  return (
    <section id="sobre" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-navy md:text-4xl">
              Sobre o Instituto
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-navy-light">
              O <strong className="text-navy">Instituto Casa Bíblica</strong>{" "}
              é o ministério de formação bíblica da 2ª Igreja Presbiteriana
              Independente de Maringá. Nosso propósito é equipar cada membro da
              Casa com conhecimento sólido das Escrituras.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-navy-light">
              Acreditamos que o estudo da Palavra de Deus é essencial para o
              crescimento espiritual, o serviço na comunidade e a vida em missão.
              Nossos cursos são ministrados por pastores e professores
              comprometidos com a fidelidade bíblica.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="text-center">
                <span className="block text-3xl font-extrabold text-primary">
                  6+
                </span>
                <span className="mt-1 block text-sm text-navy-light">
                  Cursos
                </span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-extrabold text-primary">
                  50+
                </span>
                <span className="mt-1 block text-sm text-navy-light">
                  Anos de história
                </span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-extrabold text-primary">
                  1000+
                </span>
                <span className="mt-1 block text-sm text-navy-light">
                  Membros
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Image
              src="/somos-casa.png"
              alt="SOMOS CASA — 2 IPI de Maringá"
              width={400}
              height={400}
              className="rounded-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
