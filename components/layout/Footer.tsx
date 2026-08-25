// components/layout/Footer.tsx
import Link from "next/link";

const columns = [
  {
    title: "Plataforma",
    links: [
      { label: "Início", href: "/" },
      { label: "Pesquisa", href: "/pesquisa" },
      { label: "Entrar", href: "/login" },
      { label: "Criar Perfil", href: "/registo" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Sobre", href: "/sobre" },
      { label: "Portal da Universidade", href: "https://unikivi.ao" },
      { label: "Suporte Académico", href: "/sobre" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidade", href: "/sobre" },
      { label: "Termos de Uso", href: "/sobre" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest border-t border-outline-variant w-full mt-16 sm:mt-24">
      <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-2 space-y-3">
          <span className="text-xl sm:text-2xl font-headline-md font-extrabold text-primary">
            UNIKIVI <span className="text-primary/70">Vitae</span>
          </span>
          <p className="font-body-md text-on-surface-variant text-sm max-w-sm leading-relaxed">
            A plataforma central de gestão de percursos académicos e científicos da Universidade Kimpa Vita.
          </p>
        </div>

        {/* Credits column */}
        <div className="space-y-3">
          <h4 className="font-headline-md text-primary text-sm font-bold">
            Créditos
          </h4>
          <ul className="flex flex-col gap-2 font-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed">
            <li>Desenvolvedores: Afonso Pande Manuel e Celeste Maquiesse Bengui Canga</li>
            <li>Sob orientação de: Nkanga Pedro</li>
          </ul>
        </div>

        {/* Links columns */}
        {columns.map((col) => (
          <div key={col.title} className="space-y-3">
            <h4 className="font-headline-md text-primary text-sm font-bold">
              {col.title}
            </h4>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body-md text-on-surface-variant hover:text-primary transition-colors text-xs sm:text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="font-body-md text-on-surface-variant hover:text-primary transition-colors text-xs sm:text-sm"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-outline-variant/60 py-6 px-4 text-center">
        <p className="font-label-sm text-xs text-on-surface-variant">
          © 2026 Universidade Kimpa Vita. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}