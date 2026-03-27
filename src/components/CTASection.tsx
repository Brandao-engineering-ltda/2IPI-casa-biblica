"use client";

import Link from "next/link";
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
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export function CTASection() {
  return (
    <motion.section
      id="inscreva-se"
      className="bg-primary py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          className="text-3xl font-bold text-white md:text-4xl"
          variants={fadeUp}
        >
          Comece sua jornada bíblica
        </motion.h2>
        <motion.p
          className="mt-6 text-lg leading-relaxed text-white/85"
          variants={fadeUp}
        >
          As inscrições para os próximos cursos estão abertas. Junte-se à
          comunidade do Instituto Casa Bíblica e aprofunde-se na Palavra.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          variants={fadeUp}
        >
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(255,255,255,0.25)" }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            className="w-full rounded-full sm:w-auto"
          >
            <Link
              href="/login"
              className="block w-full rounded-full bg-white px-8 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-cream sm:w-auto"
            >
              Inscreva-se Agora
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            className="w-full sm:w-auto"
          >
            <a
              href="https://api.whatsapp.com/send?phone=5544999999999&text=Olá! Gostaria de saber mais sobre os cursos do Instituto Casa Bíblica."
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/40 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-white sm:w-auto"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Fale Conosco
            </a>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
