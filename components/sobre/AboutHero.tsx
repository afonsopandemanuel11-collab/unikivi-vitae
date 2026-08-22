// components/sobre/AboutHero.tsx
export default function AboutHero() {
  return (
    <header className="max-w-container-max mx-auto px-margin-desktop pt-16 pb-20">
      <span className="inline-flex items-center gap-2 bg-secondary-container/20 text-secondary px-3 py-1 rounded-full text-label-sm font-label-sm mb-6 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
        Sobre a Plataforma
      </span>

      <h1 className="font-headline-lg text-headline-lg text-primary mb-8">
        Sobre a UNIKIVI Vitae
      </h1>

      <p className="border-l-2 border-primary pl-6 font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
        A infraestrutura digital de confiança para a gestão do percurso
        académico e científico na Universidade Kimpa Vita.
      </p>
    </header>
  );
}