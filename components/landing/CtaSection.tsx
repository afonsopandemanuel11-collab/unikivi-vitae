// components/landing/CtaSection.tsx
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="bg-primary text-white py-16 sm:py-20 md:py-24 mt-16 sm:mt-24">
      <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
          O seu percurso merece um lugar único.
        </h2>
        <p className="font-body-lg text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          Junte-se à comunidade académica da Universidade Kimpa Vita e potencie
          a visibilidade do seu trabalho e produção científica.
        </p>

        <Link
          href="/registo"
          className="inline-block bg-white text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-slate-100 transition-all text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        >
          Criar meu perfil institucional
        </Link>
      </div>
    </section>
  );
}