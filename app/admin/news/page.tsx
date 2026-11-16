import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import NewsTable from "@/components/admin/NewsTable";

export default async function AdminNewsPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("news")
    .select("id, title, category, status, published_at, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = data ?? [];
  const publishedCount = rows.filter((item) => item.status === "PUBLISHED").length;
  const draftsCount = rows.filter((item) => item.status === "DRAFT").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            News &amp; Announcements
          </h1>
          <p className="mt-2 max-w-2xl font-body-md text-sm text-on-surface-variant sm:text-base">
            Manage institutional updates, platform announcements, and community highlights.
            Ensure content aligns with editorial guidelines before publishing.
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-headline-md text-sm font-semibold text-white shadow-sm transition hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
          New News
        </Link>
      </div>

      {/* Bento Grid Layout for Stats & Main Table */}
      <div className="grid grid-cols-12 gap-6">
        {/* Summary Cards (Left Column - 3 Cols) */}
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-3">
          {/* Stat Card 1: Total Published */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-label-sm text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Total Published
              </span>
              <span className="material-symbols-outlined text-secondary text-2xl">
                check_circle
              </span>
            </div>
            <div className="font-display-xl text-4xl font-extrabold text-primary sm:text-5xl">
              {publishedCount}
            </div>
            <div className="mt-3 flex items-center gap-1 font-label-sm text-xs font-medium text-secondary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+12 this month</span>
            </div>
          </div>

          {/* Stat Card 2: Drafts Pending */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-label-sm text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Drafts Pending
              </span>
              <span className="material-symbols-outlined text-tertiary-fixed-variant text-2xl">
                edit_note
              </span>
            </div>
            <div className="font-display-xl text-4xl font-extrabold text-primary sm:text-5xl">
              {draftsCount}
            </div>
            <div className="mt-3 font-label-sm text-xs text-on-surface-variant">
              Requires editorial review
            </div>
          </div>
        </div>

        {/* Main Data Table (Right Column - 9 Cols) */}
        <div className="col-span-12 lg:col-span-9">
          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
            >
              Não foi possível carregar as notícias. Confirme a tabela de notícias.
            </div>
          ) : (
            <NewsTable items={rows} />
          )}
        </div>
      </div>
    </div>
  );
}

