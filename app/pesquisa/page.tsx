import { createClient } from "@/lib/supabase/server";
import FilterSidebar from "@/components/pesquisa/FilterSidebar";
import SearchInput from "@/components/pesquisa/SearchInput";
import ProfileCard from "@/components/pesquisa/ProfileCard";
import PromoBanner from "@/components/pesquisa/PromoBanner";
import Link from "next/link";

const PAGE_SIZE = 24;

export default async function PesquisaPage({
  searchParams,
}: {
  searchParams: Promise<{ nome?: string; tipo?: string; area?: string; limit?: string }>;
}) {
  const { nome, tipo, area, limit } = await searchParams;
  const currentLimit = Number(limit) || PAGE_SIZE;
  const supabase = await createClient();

  const { data: areas } = await supabase
    .from("research_areas")
    .select("id, name")
    .eq("status", "ACTIVE")
    .order("name");

  const relationSelect = area
    ? "profile_research_areas!inner(research_area_id, research_areas(id, name))"
    : "profile_research_areas(research_area_id, research_areas(id, name))";

  let query = supabase
    .from("profiles")
    .select(
      `
      id, full_name, professional_name, photo_url, profile_type,
      position:positions(name),
      faculty:faculties(name),
      ${relationSelect}
      `,
      { count: "exact" }
    )
    .eq("visibility", "PUBLIC")
    .eq("status", "ACTIVE")
    .order("full_name")
    .range(0, currentLimit - 1);

  if (nome) query = query.ilike("full_name", `%${nome}%`);
  if (tipo) query = query.in("profile_type", tipo.split(","));
  if (area) query = query.eq("profile_research_areas.research_area_id", area);

  const { data: profiles, count, error } = await query;
  if (error) console.log("ERRO PESQUISA:", error);

  const params = new URLSearchParams();
  if (nome) params.set("nome", nome);
  if (tipo) params.set("tipo", tipo);
  if (area) params.set("area", area);
  params.set("limit", String(currentLimit + PAGE_SIZE));

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
      <FilterSidebar areas={areas ?? []} />

      <section className="md:col-span-8 lg:col-span-9 flex flex-col space-y-6">
        <SearchInput />

        <div className="flex justify-between items-center py-2">
          <div>
            <h1 className="font-headline-md text-primary inline text-2xl">
              {count ?? 0} perfis encontrados
            </h1>
            <span className="font-label-sm text-on-surface-variant/80 ml-2">
              (Exibindo {profiles?.length ?? 0} de {count ?? 0})
            </span>
          </div>
        </div>

        <PromoBanner />

        {profiles && profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <p className="font-body-md text-on-surface-variant text-center py-16">
            Nenhum perfil encontrado com estes critérios.
          </p>
        )}

        {count !== null && profiles && profiles.length < count && (
          <div className="flex justify-center py-8">
            <Link
              href={`/pesquisa?${params.toString()}`}
              className="border border-primary text-primary hover:bg-primary hover:text-on-primary px-8 py-3 rounded-lg font-label-sm transition-colors"
            >
              Carregar mais perfis
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}