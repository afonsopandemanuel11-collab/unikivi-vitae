"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const heroImages = [
  "/images/carousel/c (10).jpg",
  "/images/carousel/c (6).jpg",
  "/images/carousel/c (9).jpg",
  "/images/carousel/c (4).jpg",
  "/images/carousel/c (15).jpg",
];

export default function Hero() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        {heroImages.map((image, index) => (
          <Image
            key={image}
            src={image}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover object-center transition-opacity duration-1000 ease-in-out ${
              activeImage === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white/35 via-white/15 to-primary/35"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <div className="rounded-2xl border border-white/60 bg-white/75 px-5 py-8 shadow-[0_20px_80px_rgba(0,17,58,0.16)] backdrop-blur-md sm:px-10 sm:py-11">
          <span className="mb-5 inline-flex items-center rounded-full border border-outline-variant bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">
            Universidade Kimpa Vita
          </span>
          <h1 className="mx-auto mb-5 max-w-4xl font-headline-lg text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl">
            O seu percurso académico, científico e profissional num único lugar.
          </h1>
          <p className="mx-auto mb-7 max-w-2xl font-body-md text-sm leading-relaxed text-on-surface-variant sm:text-base">
            Centralize as suas publicações, projetos e histórico académico numa
            plataforma oficial, validada institucionalmente e preparada para dar
            visibilidade ao seu percurso.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/registo"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-primary-container"
            >
              Criar meu perfil
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
            <Link
              href="/pesquisa"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant bg-white px-5 py-3 text-xs font-bold text-primary transition-colors hover:bg-surface-container"
            >
              Explorar a plataforma
            </Link>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2" aria-label="Imagens do hero">
          {heroImages.map((image, index) => (
            <span
              key={image}
              aria-current={activeImage === index ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeImage === index ? "w-8 bg-primary" : "w-1.5 bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
