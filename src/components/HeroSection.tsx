"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const spring = { type: "spring" as const, stiffness: 120, damping: 24, mass: 0.4 };

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring, delay },
  }),
};

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play()?.catch(() => {});
    }
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-navy-dark">
      {/* Background video */}
      <video
        ref={videoRef}
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-navy-dark/70" />

      <motion.div
        className="relative mx-auto flex flex-1 max-w-7xl flex-col items-center justify-center px-6 py-24 text-center lg:py-36"
        initial="hidden"
        animate="visible"
      >
        {/* Logo — spring entrance */}
        <motion.div variants={fadeUp} custom={0.1}>
          <Image
            src="/logo-3d.png"
            alt="Logo Instituto Casa Bíblica"
            width={80}
            height={80}
            className="mb-8 rounded-xl"
          />
        </motion.div>

        {/* Heading — staggered spring */}
        <motion.h1
          className="max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl"
          variants={fadeUp}
          custom={0.25}
        >
          Instituto{" "}
          <span className="text-primary">Casa Bíblica</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-cream-dark md:text-xl"
          variants={fadeUp}
          custom={0.4}
        >
          Formação bíblica para todos os membros da Casa. Conheça nossos cursos
          e aprofunde-se na Palavra de Deus com a comunidade da 2ª IPI de
          Maringá.
        </motion.p>

        {/* Buttons — with hover scale micro-interactions */}
        <motion.div
          className="mt-10 flex flex-col gap-4 sm:flex-row"
          variants={fadeUp}
          custom={0.55}
        >
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(217,106,59,0.35)" }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            className="rounded-full"
          >
            <Link
              href="#courses"
              className="block rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Explorar Cursos
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            className="rounded-full"
          >
            <Link
              href="#sobre"
              className="block rounded-full border-2 border-cream-dark/30 px-8 py-3.5 text-base font-semibold text-cream transition-colors hover:border-cream hover:text-white"
            >
              Saiba Mais
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature badges — with individual hover interactions */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-cream-dark"
          variants={fadeUp}
          custom={0.7}
        >
          {[
            {
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              ),
              label: "Cursos Bíblicos",
            },
            {
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              ),
              label: "Comunidade SOMOS CASA",
            },
            {
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ),
              label: "Certificado de Conclusão",
            },
          ].map((feat) => (
            <motion.div
              key={feat.label}
              className="flex items-center gap-2"
              whileHover={{ scale: 1.08, color: "#ffffff" }}
              transition={spring}
            >
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {feat.icon}
              </svg>
              <span>{feat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
