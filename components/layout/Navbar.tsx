"use client";

import { useState } from "react";
import Link from "next/link";
import NavDropdown from "./NavDropdown";

const navGroups = [
  {
    label: "Públicos",
    items: [
      { label: "Investigadores", href: "/pesquisa?tipo=RESEARCHER" },
      { label: "Docentes", href: "/pesquisa?tipo=TEACHER" },
      { label: "Estudantes", href: "/pesquisa?tipo=STUDENT" },
    ],
  },
  {
    label: "Plataforma",
    items: [
      { label: "Funcionalidades", href: "/#funcionalidades" },
      { label: "Pesquisa Institucional", href: "/pesquisa" },
      { label: "Sobre a Plataforma", href: "/sobre" },
    ],
  },
  {
    label: "Recursos",
    items: [
      { label: "Portal da Universidade", href: "https://unikivi.ao" },
      { label: "Pesquisa de Perfis", href: "/pesquisa" },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant sticky top-0 z-50 w-full transition-all">
      <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="text-xl sm:text-2xl font-headline-md font-extrabold text-primary tracking-tight">
            UNIKIVI <span className="text-primary/70">Vitae</span>
          </Link>

          <div className="hidden md:flex gap-4 lg:gap-6 items-center">
            <Link href="/" className="text-primary font-bold text-xs uppercase tracking-wider">
              Início
            </Link>
            <Link
              href="/sobre"
              className="text-on-surface-variant font-medium hover:text-primary transition-colors text-xs uppercase tracking-wider"
            >
              Sobre
            </Link>
            {navGroups.map((group) => (
              <NavDropdown key={group.label} group={group} />
            ))}
          </div>
        </div>

        {/* Right Desktop Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="text-primary font-bold hover:text-primary-container transition-colors text-xs uppercase tracking-wider hidden sm:block px-3 py-2"
          >
            Entrar
          </Link>

          <Link
            href="/registo"
            className="bg-primary text-white px-3.5 sm:px-4 py-2 rounded-xl font-bold hover:bg-primary-container transition-all text-xs shadow-xs shrink-0"
          >
            Criar perfil
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            className="md:hidden p-2 rounded-xl text-primary hover:bg-surface-container transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-container-lowest border-b border-outline-variant px-4 py-6 space-y-4 shadow-xl animate-fade-in">
          <div className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg font-bold text-primary hover:bg-surface-container transition-colors text-sm"
            >
              Início
            </Link>
            <Link
              href="/sobre"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg font-medium text-on-surface hover:bg-surface-container transition-colors text-sm"
            >
              Sobre a Plataforma
            </Link>
            <Link
              href="/pesquisa"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg font-medium text-on-surface hover:bg-surface-container transition-colors text-sm"
            >
              Pesquisa Institucional
            </Link>
          </div>

          <div className="pt-3 border-t border-outline-variant/60">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Públicos & Navegação
            </span>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              <Link
                href="/pesquisa?tipo=RESEARCHER"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container"
              >
                Investigadores
              </Link>
              <Link
                href="/pesquisa?tipo=TEACHER"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container"
              >
                Docentes
              </Link>
              <Link
                href="/pesquisa?tipo=STUDENT"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container"
              >
                Estudantes
              </Link>
              <Link
                href="/#funcionalidades"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container"
              >
                Funcionalidades
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-outline-variant/60 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-outline-variant font-bold text-primary hover:bg-surface-container transition-colors text-xs uppercase tracking-wider"
            >
              Entrar na Conta
            </Link>
            <Link
              href="/registo"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors text-xs uppercase tracking-wider shadow-xs"
            >
              Criar Novo Perfil
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}