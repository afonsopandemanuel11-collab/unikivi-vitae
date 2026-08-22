// components/layout/Footer.tsx
const columns = [
  {
    title: "Plataforma",
    links: [
      { label: "Início", href: "/" },
      { label: "Pesquisa", href: "#" },
      { label: "Entrar", href: "#" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Portal da Universidade", href: "#" },
      { label: "Suporte Académico", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidade", href: "#" },
      { label: "Termos de Uso", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest border-t border-outline-variant w-full mt-section-gap">
      <div className="max-w-container-max mx-auto px-margin-desktop py-16 grid grid-cols-1 md:grid-cols-5 gap-gutter">
        <div className="md:col-span-2">
          <span className="text-headline-md font-headline-md font-extrabold text-primary">
            UNIKIVI Vitae
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant mt-3 max-w-xs">
            A plataforma central de gestão de percursos académicos e científicos.
          </p>
        </div>
        <div>
  <h4 className="font-headline-md text-headline-md text-primary text-sm mb-4">
    Créditos
  </h4>
  <ul className="flex flex-col gap-2 font-body-md text-body-md text-on-surface-variant text-sm">
    <li>Desenvolvedores: Afonso Pande Manuel e Celeste Maquiesse Bengui Canga</li>
    <li>Sob orientação de: Nkanga Pedro</li>
  </ul>
</div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-headline-md text-headline-md text-primary text-sm mb-4">
              {col.title}
            </h4>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-outline-variant py-6 text-center">
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          © 2026 Universidade Kimpa Vita. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}