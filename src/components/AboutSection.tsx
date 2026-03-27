"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 120, damping: 24, mass: 0.4 };

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring, delay },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

export function AboutSection() {
  return (
    <motion.section
      id="sobre"
      className="bg-white py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={stagger}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <motion.h2
              className="text-3xl font-bold text-navy md:text-4xl"
              variants={fadeUp}
            >
              Sobre o Instituto
            </motion.h2>
            <motion.p
              className="mt-6 text-lg leading-relaxed text-navy-light"
              variants={fadeUp}
              custom={0.1}
            >
              O <strong className="text-navy">Instituto Casa Bíblica</strong>{" "}
              é o ministério de formação bíblica da 2ª Igreja Presbiteriana
              Independente de Maringá. Nosso propósito é equipar cada membro da
              Casa com conhecimento sólido das Escrituras.
            </motion.p>
            <motion.p
              className="mt-4 text-lg leading-relaxed text-navy-light"
              variants={fadeUp}
              custom={0.2}
            >
              Acreditamos que o estudo da Palavra de Deus é essencial para o
              crescimento espiritual, o serviço na comunidade e a vida em missão.
              Nossos cursos são ministrados por pastores e professores
              comprometidos com a fidelidade bíblica.
            </motion.p>

            <motion.div className="mt-10 grid grid-cols-3 gap-6" variants={stagger}>
              {[
                { value: "6+", label: "Cursos" },
                { value: "50+", label: "Anos de história" },
                { value: "1000+", label: "Membros" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  variants={fadeUp}
                  whileHover={{ scale: 1.08, transition: spring }}
                >
                  <span className="block text-3xl font-extrabold text-primary">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-sm text-navy-light">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="flex items-center justify-center"
            variants={fadeUp}
            custom={0.2}
          >
            <motion.div
              className="overflow-hidden rounded-3xl"
              whileHover={{ scale: 1.03, transition: spring }}
            >
              <Image
                src="/2IPI-logo.jpg"
                alt="SOMOS CASA — 2 IPI de Maringá"
                width={400}
                height={400}
                className="rounded-3xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
