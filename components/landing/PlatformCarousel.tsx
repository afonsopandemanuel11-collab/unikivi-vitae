// components/landing/PlatformCarousel.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

const slides = [
  { image: "/images/carousel/frende (12).jpg", caption: "Tenha uma visão completa do seu percurso." },
  { image: "/images/carousel/c (6).jpg", caption: "Organize a sua identidade académica e profissional." },
  // ... continua até 7, com as tuas imagens reais
];

export default function PlatformCarousel() {
  const [current, setCurrent] = useState(0);

  function goPrev() {
    setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  }

  function goNext() {
    setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
  }

  return (
    <section className="py-section-gap bg-surface overflow-hidden relative">
      <div className="max-w-container-max mx-auto px-margin-desktop text-center mb-12">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-4">
          Conheça a UNIKIVI Vitae
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Uma visão da plataforma criada para organizar, valorizar e conectar
          o percurso académico, científico e profissional da comunidade UNIKIVI.
        </p>
      </div>

      <div className="max-w-container-max mx-auto px-margin-desktop">
        <div className="rounded-xl overflow-hidden border border-outline-variant shadow-sm">
          <Image
            src={slides[current].image}
            alt={slides[current].caption}
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
          />
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant text-center mt-4">
          {slides[current].caption}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={goPrev}
          aria-label="Slide anterior"
          className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>

        <button
          onClick={goNext}
          aria-label="Próximo slide"
          className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </section>
  );
}