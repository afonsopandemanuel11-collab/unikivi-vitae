import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import PublicationsForm from "@/components/Publications/PublicationsForm";
import PublicationsList from "@/components/Publications/PublicationsList";

export default async function PublicacoesPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!profile) redirect("/completar-perfil");

  const { data: authored } = await supabase
    .from("publication_authors")
    .select(
      "publications(id, title, journal, year, doi, url, publication_type), author_order"
    )
    .eq("profile_id", profile.id);

  const publicationIds = (authored ?? [])
    .map((a: any) => (Array.isArray(a.publications) ? a.publications[0]?.id : a.publications?.id))
    .filter(Boolean);

  const { data: allAuthors } = publicationIds.length
    ? await supabase
        .from("publication_authors")
        .select("publication_id, external_name, profile_id, profiles(full_name)")
        .in("publication_id", publicationIds)
        .order("author_order")
    : { data: [] };

  return (
    <DashboardShell profile={profile}>
      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
        Producao Academica e Cientifica
      </span>
      <h1 className="font-headline-lg text-headline-lg text-primary mt-2 mb-3">
        Producao Cientifica
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-2xl">
        Gerencie as suas publicacoes, artigos e contribuicoes academicas.
        Mantenha o seu portfolio atualizado para a comunidade de pesquisa.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PublicationsForm profileId={profile.id} />
        </div>
        <div className="lg:col-span-2">
          <PublicationsList authored={authored ?? []} allAuthors={allAuthors ?? []} />
        </div>
      </div>
    </DashboardShell>
  );
}