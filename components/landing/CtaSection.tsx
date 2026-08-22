// components/landing/CtaSection.tsx
export default function CtaSection() {
  return (
    <section className="bg-primary text-white py-section-gap mt-section-gap">
      <div className="max-w-container-max mx-auto px-margin-desktop text-center">
        <h2 className="font-headline-lg text-headline-lg mb-4">
          O seu percurso merece um lugar único.
        </h2>
        <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mx-auto mb-10">
          Junte-se à comunidade académica da Universidade Kimpa Vita e potencie
          a visibilidade do seu trabalho.
        </p>

        <a
          href="#"
          className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-surface-container-high transition-colors duration-200 text-label-sm font-label-sm"
        >
          Criar meu perfil institucional
        </a>
      </div>
    </section>
  );
}