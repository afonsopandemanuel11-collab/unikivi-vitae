// components/landing/Hero.tsx
import Image from "next/image";

export default function Hero() {
  return (
    <header className="max-w-container-max mx-auto px-margin-desktop py-24 md:py-32 flex flex-col items-center text-center">
      <span className="bg-surface-container-high text-primary px-3 py-1 rounded-full text-label-sm font-label-sm mb-6 uppercase tracking-widest border border-outline-variant">
        Universidade Kimpa Vita
      </span>

      <h1 className="font-display-xl text-display-xl text-primary max-w-4xl mb-6">
        O seu percurso académico, científico e profissional num único lugar.
      </h1>

      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-10">
        Centralize as suas publicações, projetos e histórico académico numa
        plataforma oficial, validada institucionalmente e potenciada por IA
        para destacar o que realmente importa.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-20">
        <a
          href="#"
          className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-container transition-colors duration-200 text-label-sm font-label-sm"
        >
          Criar meu perfil
        </a>

        <a
          href="#explorar"
          className="bg-surface-container text-primary px-8 py-3 rounded-lg font-medium hover:bg-surface-container-high border border-outline-variant transition-colors duration-200 text-label-sm font-label-sm"
        >
          Explorar a plataforma
        </a>
      </div>

      <div className="w-full max-w-3xl relative rounded-xl border border-outline-variant bg-white p-2 shadow-sm">
        <Image
          src="/frende (2).jpg"
          alt="Pré-visualização do dashboard da UNIKIVI Vitae"
          width={1500}
          height={800}
          className="w-full h-auto rounded-lg object-cover"
          priority
        />
      </div>
    </header>
  );
}