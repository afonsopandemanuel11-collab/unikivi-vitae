// components/landing/PlatformCarousel.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";

const slides = [
  { image: "/images/carousel/frende (12).jpg", caption: "Tenha uma visão completa e centralizada do seu percurso." },
  { image: "/images/carousel/c (6).jpg", caption: "Organize a sua identidade académica, científica e profissional." },
];

export default function PlatformCarousel() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function goPrev() {
    setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  }

  function goNext() {
    setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-surface overflow-hidden relative">
      <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-12">
        <h2 className="font-headline-lg text-primary text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Conheça a UNIKIVI Vitae
        </h2>
        <p className="font-body-lg text-on-surface-variant text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Uma visão da plataforma criada para organizar, valorizar e conectar
          o percurso académico, científico e profissional da comunidade UNIKIVI.
        </p>
      </div>

      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="rounded-2xl overflow-hidden border border-outline-variant shadow-lg bg-white">
          <Image
            src={slides[current].image}
            alt={slides[current].caption}
            width={1200}
            height={700}
            className="w-full h-auto object-cover select-none"
          />
        </div>
        <p className="font-body-md text-on-surface-variant text-center mt-4 text-xs sm:text-sm font-medium">
          {slides[current].caption}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
        <button
          onClick={goPrev}
          aria-label="Slide anterior"
          className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer text-primary"
        >
          <span className="material-symbols-outlined text-xl">chevron_left</span>
        </button>

        <span className="font-label-sm text-xs text-on-surface-variant font-bold">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>

        <button
          onClick={goNext}
          aria-label="Próximo slide"
          className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer text-primary"
        >
          <span className="material-symbols-outlined text-xl">chevron_right</span>
        </button>
      </div>
    </section>
  );
}