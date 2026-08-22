// components/sobre/PurposeSection.tsx
import Image from "next/image";

export default function PurposeSection() {
  return (
    <section className="max-w-container-max mx-auto px-margin-desktop py-section-gap grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-6">
          O Nosso Propósito
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-4">
          Historicamente, o conhecimento e o percurso dos investigadores da
          Universidade Kimpa Vita encontravam-se fragmentados em múltiplos
          sistemas isolados. A UNIKIVI Vitae nasceu da necessidade urgente de
          consolidar esta riqueza intelectual numa única plataforma
          institucional de alta fiabilidade.
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant mb-4">
          Ao centralizar informações académicas, desde publicações a
          orientações, criamos um repositório que não só preserva a memória
          institucional, mas que também a torna acionável. A nossa
          infraestrutura visa eliminar redundâncias administrativas,
          permitindo que a comunidade académica se foque na sua verdadeira
          missão: a inovação e o ensino.
        </p>
        <p className="font-body-md text-body-md text-secondary">
          Através da integração de Inteligência Artificial avançada, a
          plataforma não atua apenas como um arquivo, mas como um curador
          ativo. Auxilia na estruturação de perfis, otimiza a visibilidade
          internacional da investigação e assegura a rigorosa validação
          institucional dos dados submetidos.
        </p>
      </div>

      <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden border border-outline-variant shadow-sm">
        <Image
          src="/images/sobre/frende (4).jpg"
          alt="Rede de conhecimento científico visualizada digitalmente"
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}