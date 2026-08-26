"use client";

import { useState } from "react";
import Link from "next/link";

export interface NetworkMember {
  id: string;
  full_name: string;
  photo_url?: string | null;
  position_title?: string | null;
  department_name?: string | null;
  location?: string | null;
  isOnline?: boolean;
}

interface NetworkSidebarProps {
  members?: NetworkMember[];
  suggestions?: NetworkMember[];
}

export default function NetworkSidebar({
  members = [],
  suggestions = [],
}: NetworkSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

  // Dados de fallback caso ainda haja poucos utilizadores registados na BD
  const defaultMembers: NetworkMember[] = [
    {
      id: "demo-1",
      full_name: "Márcia Lima",
      photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      position_title: "Engenharia Informática",
      location: "Luanda",
      isOnline: true,
    },
    {
      id: "demo-2",
      full_name: "Victor Manuel",
      photo_url: null,
      position_title: "Investigador",
      location: "Uíge",
      isOnline: true,
    },
    {
      id: "demo-3",
      full_name: "Justino Manuel",
      photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      position_title: "Docente Universitário",
      location: "Uíge",
      isOnline: false,
    },
    {
      id: "demo-4",
      full_name: "Dra. Ana Silva",
      photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      position_title: "Investigadora Principal",
      location: "Uíge",
      isOnline: true,
    },
  ];

  const defaultSuggestions: NetworkMember[] = [
    {
      id: "sug-1",
      full_name: "Carlos Santos",
      photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      position_title: "3 conexões em comum",
      location: "Uíge",
    },
    {
      id: "sug-2",
      full_name: "Maria João",
      photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      position_title: "Engenharia Informática",
      location: "Luanda",
    },
  ];

  const displayMembers = members.length > 0 ? members : defaultMembers;
  const displaySuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions;

  const filteredMembers = displayMembers.filter((m) =>
    m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.position_title && m.position_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (m.location && m.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleConnect = (id: string) => {
    setConnectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside className="w-full xl:w-[330px] 2xl:w-[360px] shrink-0 bg-white rounded-3xl border border-outline-variant p-6 sm:p-7 shadow-xs flex flex-col gap-6 self-start xl:sticky xl:top-24">
      {/* ── Título do Card ── */}
      <div className="flex items-center gap-3 text-primary">
        <span className="material-symbols-outlined text-2xl sm:text-3xl font-bold text-primary">
          hub
        </span>
        <h2 className="font-headline-md font-black text-lg sm:text-xl tracking-tight text-primary">
          Membros da Rede
        </h2>
      </div>

      {/* ── Campo de Pesquisa ── */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Procurar membros..."
          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-outline-variant rounded-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-2xs"
        />
      </div>

      {/* ── Lista de Membros com Scroll ── */}
      <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
        {filteredMembers.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">Nenhum membro encontrado.</p>
        ) : (
          filteredMembers.map((member) => (
            <Link
              key={member.id}
              href={`/perfil/${member.id}`}
              className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors group"
            >
              {/* Avatar com status online */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-cyan-400 text-white flex items-center justify-center font-extrabold text-base shadow-xs">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{member.full_name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                    member.isOnline !== false ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
              </div>

              {/* Informação do Membro */}
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-primary transition-colors">
                  {member.full_name}
                </h4>
                <p className="text-xs text-slate-500 truncate leading-tight mt-0.5">
                  {member.position_title || member.department_name || "Membro UNIKIVI"}
                </p>
                {member.location && (
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                    <span>📍</span>
                    <span>{member.location}</span>
                  </p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* ── Divisor ── */}
      <hr className="border-outline-variant/60" />

      {/* ── Pessoas que podes conhecer ── */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900">
          Pessoas que podes conhecer
        </h3>

        <div className="space-y-3">
          {displaySuggestions.map((person) => {
            const isConnected = connectedIds.has(person.id);
            return (
              <div
                key={person.id}
                className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50/50 transition-colors"
              >
                <Link
                  href={`/perfil/${person.id}`}
                  className="flex items-center gap-3 min-w-0 flex-1 group"
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center font-bold text-sm text-primary shadow-xs">
                    {person.photo_url ? (
                      <img
                        src={person.photo_url}
                        alt={person.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{person.full_name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-primary transition-colors">
                      {person.full_name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {person.position_title}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => toggleConnect(person.id)}
                  title={isConnected ? "Conexão enviada" : "Conectar"}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    isConnected
                      ? "bg-primary text-white border-primary"
                      : "border-outline-variant text-slate-600 hover:border-primary hover:text-primary hover:bg-primary/5 shadow-2xs"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {isConnected ? "check" : "person_add"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Link Inferior ── */}
      <div className="pt-3 text-center border-t border-outline-variant/60">
        <Link
          href="/pesquisa"
          className="text-sm font-bold text-primary hover:text-primary-container transition-colors inline-block"
        >
          Ver todas as recomendações →
        </Link>
      </div>
    </aside>
  );
}
