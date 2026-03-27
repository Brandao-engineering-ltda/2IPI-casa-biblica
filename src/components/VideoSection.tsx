"use client";

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

export function VideoSection() {
  return (
    <motion.section
      className="bg-white py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={stagger}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <motion.h2
            className="text-3xl font-bold text-navy md:text-4xl"
            variants={fadeUp}
          >
            Conheça o Instituto
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-navy-light"
            variants={fadeUp}
          >
            Assista e descubra como o Instituto Casa Bíblica pode transformar
            sua caminhada com a Palavra
          </motion.p>
        </div>

        <motion.div
          className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl shadow-lg"
          variants={fadeUp}
          whileHover={{ scale: 1.015, boxShadow: "0 30px 60px rgba(43,48,68,0.15)", transition: spring }}
        >
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/uPJlTDGiVtw"
              title="Instituto Casa Bíblica — 2ª IPI de Maringá"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
