import { createAdminClient } from "@/lib/supabase/admin";
import UsersManagement from "@/components/admin/UsersManagement";

export const metadata = {
  title: "Gestão de Utilizadores - UNIKIVI Admin",
};

export default async function AdminUsersPage() {
  const supabase = createAdminClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, professional_name, profile_type, status, created_at, photo_url, institutional_email")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        Erro ao carregar a lista de utilizadores. Por favor verifique a base de dados.
      </div>
    );
  }

  const mappedProfiles = (profiles ?? []).map((p) => ({
    id: p.id,
    full_name: p.full_name,
    professional_name: p.professional_name,
    profile_type: p.profile_type,
    status: p.status,
    created_at: p.created_at,
    avatar_url: p.photo_url,
    email: p.institutional_email,
  }));

  return <UsersManagement initialUsers={mappedProfiles} />;
}

