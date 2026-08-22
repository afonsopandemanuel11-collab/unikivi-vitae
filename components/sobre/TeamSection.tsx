// components/sobre/TeamSection.tsx
import Image from "next/image";

const team = [
  {
    name: "Afonso Pande Manuel",
    role: "Developer",
    photo: "/images/sobre/afonso.jpg",
    bio: "Impulsionado pela necessidade de modernizar a infraestrutura universitária. Focado na arquitetura de sistemas e na construção de um ecossistema centralizado, seguro e escalável.",
  },
  {
    name: "Celeste Maquiesse Bengui Canga",
    role: "Developer",
    photo: "/images/sobre/celeste.jpg",
    bio: "Especialista em criar interfaces intuitivas. O seu trabalho foca-se em garantir que a complexidade dos dados académicos seja apresentada através de uma experiência de utilizador fluida e impactante.",
  },
  {
    name: "Nkanga Pedro",
    role: "Orientador",
    photo: "/images/sobre/nkanga.jpg",
    bio: "A visão estratégica por trás do projeto. Garante que a plataforma responde rigorosamente às necessidades da comunidade científica e cumpre os elevados padrões da instituição.",
  },
];

export default function TeamSection() {
  return (
    <section className="bg-surface-container-low py-section-gap">
      <div className="max-w-container-max mx-auto px-margin-desktop text-center">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-4">
          A Equipa por trás da Inovação
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-16">
          Um esforço conjunto entre engenharia de software de ponta e rigorosa
          orientação académica.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm flex flex-col items-center"
            >
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border border-outline-variant">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-headline-md text-headline-md text-primary text-lg mb-1">
                {member.name}
              </h3>
              <span
                className={`text-label-sm font-label-sm px-3 py-1 rounded-full mb-4 ${
                  member.role === "Orientador"
                    ? "bg-secondary-container/20 text-secondary"
                    : "bg-surface-container text-primary"
                }`}
              >
                {member.role}
              </span>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm text-center">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}