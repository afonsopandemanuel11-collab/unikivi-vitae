// components/layout/Navbar.tsx
import Link from "next/link";
import NavDropdown from "./NavDropdown";

const navGroups = [
  {
    label: "Públicos",
    items: [
      { label: "Investigadores", href: "#" },
      { label: "Docentes", href: "#" },
      { label: "Estudantes", href: "#" },
    ],
  },
  {
    label: "Plataforma",
    items: [
      { label: "Funcionalidades", href: "#funcionalidades" },
      { label: "Perfil Copilot", href: "#" },
      { label: "Validação", href: "#" },
    ],
  },
  {
    label: "Comunidade",
    items: [
      { label: "Pesquisa Institucional", href: "/pesquisa" },
      { label: "Rede", href: "#" },
      { label: "Impacto", href: "#" },
    ],
  },
  {
    label: "Recursos",
    items: [
      { label: "Documentação", href: "#" },
      { label: "Suporte", href: "#" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

export default function Navbar() {
  return (
    <nav className="bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center w-full px-margin-desktop h-16 max-w-container-max mx-auto sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-headline-md font-headline-md font-extrabold text-primary">
          UNIKIVI Vitae
        </Link>
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-primary font-bold text-label-sm font-label-sm">
            Início
          </Link>
          <Link
            href="/sobre"
            className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 text-label-sm font-label-sm"
          >
            Sobre
          </Link>
          {navGroups.map((group) => (
            <NavDropdown key={group.label} group={group} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-primary font-medium hover:text-primary-container transition-colors duration-200 text-label-sm font-label-sm hidden md:block"
        >
          Entrar
        </Link>

        <Link
          href="/registo"
          className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-container transition-colors duration-200 text-label-sm font-label-sm"
        >
          Criar perfil
        </Link>
      </div>
    </nav>
  );
}