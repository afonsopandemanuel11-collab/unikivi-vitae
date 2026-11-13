import PublicProfilePage from "@/components/perfil/PublicProfilePage";

export default async function PublicProfileSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PublicProfilePage identifier={slug} lookup="slug" />;
}
