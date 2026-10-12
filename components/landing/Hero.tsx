// components/landing/Hero.tsx
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <header className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28 flex flex-col items-center text-center">
      <span className="bg-surface-container-high text-primary px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold mb-6 uppercase tracking-widest border border-outline-variant">
        Universidade Kimpa Vita
      </span>

      <h1 className="font-headline-lg text-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-4xl mb-6 tracking-tight leading-tight">
        O seu percurso académico, científico e profissional num único lugar.
      </h1>

      <p className="font-body-lg text-on-surface-variant text-base sm:text-lg md:text-xl max-w-2xl mb-8 sm:mb-10 leading-relaxed">
        Centralize as suas publicações, projetos e histórico académico numa
        plataforma oficial, validada institucionalmente e potenciada por IA
        para destacar o que realmente importa.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-14 sm:mb-20 w-full sm:w-auto justify-center px-4">
        <Link
          href="/registo"
          className="w-full sm:w-auto bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all text-xs sm:text-sm shadow-md text-center"
        >
          Criar meu perfil
        </Link>

        <Link
          href="/#funcionalidades"
          className="w-full sm:w-auto bg-surface-container text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-surface-container-high border border-outline-variant transition-all text-xs sm:text-sm text-center"
        >
          Explorar a plataforma
        </Link>
      </div>

      <div className="w-full max-w-4xl relative rounded-2xl border border-outline-variant bg-white p-2 sm:p-3 shadow-xl">
        <Image
          src="/c (16).jpg"
          alt="Pré-visualização do dashboard da UNIKIVI Vitae"
          width={1500}
          height={800}
          className="w-full h-auto rounded-xl object-cover"
          priority
        />
      </div>
    </header>
  );
}