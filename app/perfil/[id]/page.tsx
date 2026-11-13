import PublicProfilePage from "@/components/perfil/PublicProfilePage";

export default async function PerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PublicProfilePage identifier={id} lookup="id" />;
}
