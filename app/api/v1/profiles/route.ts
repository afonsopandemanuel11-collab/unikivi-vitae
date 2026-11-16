import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { API_PROFILE_TYPES, parseApiScopes, type ApiField } from "@/lib/api/scopes";
import type { Tables } from "@/lib/supabase/database.types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROFILE_TYPE_SET = new Set<string>(API_PROFILE_TYPES);
const REQUEST_LIMIT = 120;
const NO_STORE = { "Cache-Control": "no-store", Vary: "Authorization" };

type ApiProfile = Pick<
  Tables<"profiles">,
  | "id"
  | "profile_type"
  | "full_name"
  | "professional_name"
  | "bio"
  | "faculty_id"
  | "department_id"
  | "position_id"
  | "status"
  | "visibility"
  | "field_visibility"
  | "section_visibility"
>;

type Relation<T> = T | T[] | null;
type SkillRow = { profile_id: string; level: string | null; years_experience: number | null; skills: Relation<{ name: string }> };
type AuthorRow = { profile_id: string; publication_id: string; author_order: number; is_corresponding: boolean };
type MemberRow = { profile_id: string; project_id: string; role: string };

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

function relationValue<T>(value: Relation<T>): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function objectValue(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function sectionIsVisible(profile: ApiProfile, field: ApiField) {
  const visibilityKey = field === "competencies" || field === "research_areas" ? "skills" : field;
  return objectValue(profile.field_visibility)[visibilityKey] === true
    && objectValue(profile.section_visibility)[visibilityKey] === true;
}

function rateHeaders(remaining: number, resetAt: string) {
  return {
    "RateLimit-Policy": `${REQUEST_LIMIT};w=60`,
    "RateLimit-Limit": String(REQUEST_LIMIT),
    "RateLimit-Remaining": String(remaining),
    "RateLimit-Reset": String(Math.ceil(new Date(resetAt).getTime() / 1000)),
  };
}

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const match = /^Bearer (ukv_live_[A-Za-z0-9_-]{40,})$/.exec(authorization);
  if (!match) return json({ error: "unauthorized" }, 401, { "WWW-Authenticate": "Bearer" });

  const supabase = createAdminClient();
  const keyHash = createHash("sha256").update(match[1]).digest("hex");
  const { data: key, error: keyError } = await supabase
    .from("api_keys")
    .select("id, client_id, status, expires_at")
    .eq("key_hash", keyHash)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (keyError) return json({ error: "service_unavailable" }, 503);
  if (!key || (key.expires_at && new Date(key.expires_at).getTime() <= Date.now())) {
    return json({ error: "unauthorized" }, 401, { "WWW-Authenticate": "Bearer" });
  }

  const { data: client, error: clientError } = await supabase
    .from("api_clients")
    .select("status, scopes")
    .eq("id", key.client_id)
    .maybeSingle();
  if (clientError) return json({ error: "service_unavailable" }, 503);
  if (!client || client.status !== "ACTIVE") return json({ error: "unauthorized" }, 401);

  const scopeSelection = parseApiScopes(client.scopes);
  if (scopeSelection.profileTypes.length === 0 || scopeSelection.fields.length === 0) {
    return json({ error: "integration_scopes_not_configured" }, 403);
  }

  const url = new URL(request.url);
  const requestedType = url.searchParams.get("type");
  if (requestedType && !PROFILE_TYPE_SET.has(requestedType)) {
    return json({ error: "invalid_profile_type" }, 400);
  }
  if (requestedType && !scopeSelection.profileTypes.includes(requestedType as (typeof API_PROFILE_TYPES)[number])) {
    return json({ error: "profile_type_not_authorized" }, 403);
  }

  const limit = Number(url.searchParams.get("limit") ?? 20);
  const offset = Number(url.searchParams.get("offset") ?? 0);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isInteger(offset) || offset < 0 || offset > 100000) {
    return json({ error: "invalid_pagination" }, 400);
  }

  const { data: rateLimitRows, error: rateLimitError } = await supabase.rpc("consume_api_key_request", {
    p_api_key_id: key.id,
    p_limit: REQUEST_LIMIT,
  });
  if (rateLimitError || !rateLimitRows?.[0]) return json({ error: "service_unavailable" }, 503);
  const rateLimit = rateLimitRows[0];
  const headers = rateHeaders(rateLimit.remaining, rateLimit.reset_at);
  if (!rateLimit.allowed) {
    const retrySeconds = Math.max(1, Math.ceil((new Date(rateLimit.reset_at).getTime() - Date.now()) / 1000));
    return json({ error: "rate_limit_exceeded", retry_after_seconds: retrySeconds }, 429, {
      ...headers,
      "Retry-After": String(retrySeconds),
    });
  }

  const query = supabase
    .from("profiles")
    .select("id, profile_type, full_name, professional_name, bio, faculty_id, department_id, position_id, status, visibility, field_visibility, section_visibility", { count: "exact" })
    .in("profile_type", requestedType ? [requestedType as (typeof API_PROFILE_TYPES)[number]] : scopeSelection.profileTypes)
    .eq("status", "ACTIVE")
    .in("visibility", ["PUBLIC", "INSTITUTIONAL"])
    .order("full_name", { ascending: true })
    .range(offset, offset + limit - 1);

  const { data: rows, error: profilesError, count } = await query;
  if (profilesError) return json({ error: "service_unavailable" }, 503);

  const profiles = (rows ?? []) as ApiProfile[];
  const payload = new Map<string, Record<string, unknown>>();
  for (const profile of profiles) {
    const item: Record<string, unknown> = { id: profile.id, profile_type: profile.profile_type };
    if (scopeSelection.fields.includes("full_name")) item.full_name = profile.full_name;
    if (scopeSelection.fields.includes("professional_name") && profile.professional_name) item.professional_name = profile.professional_name;
    if (scopeSelection.fields.includes("bio") && profile.bio) item.bio = profile.bio;
    payload.set(profile.id, item);
  }

  const selected = (field: ApiField) => scopeSelection.fields.includes(field);
  const visible = (field: ApiField) => profiles.filter((profile) => sectionIsVisible(profile, field));
  const records = (field: ApiField) => visible(field).map((profile) => payload.get(profile.id)!);

  if (selected("faculty")) {
    const ids = [...new Set(profiles.filter((profile) => profile.faculty_id).map((profile) => profile.faculty_id!))];
    if (ids.length) {
      const { data, error } = await supabase.from("faculties").select("id, name").in("id", ids);
      if (error) return json({ error: "service_unavailable" }, 503);
      const names = new Map((data ?? []).map((row) => [row.id, row.name]));
      for (const profile of profiles) if (profile.faculty_id && names.has(profile.faculty_id)) payload.get(profile.id)!.faculty = names.get(profile.faculty_id);
    }
  }
  if (selected("department")) {
    const ids = [...new Set(profiles.filter((profile) => profile.department_id).map((profile) => profile.department_id!))];
    if (ids.length) {
      const { data, error } = await supabase.from("departments").select("id, name").in("id", ids);
      if (error) return json({ error: "service_unavailable" }, 503);
      const names = new Map((data ?? []).map((row) => [row.id, row.name]));
      for (const profile of profiles) if (profile.department_id && names.has(profile.department_id)) payload.get(profile.id)!.department = names.get(profile.department_id);
    }
  }
  if (selected("position")) {
    const ids = [...new Set(profiles.filter((profile) => profile.position_id).map((profile) => profile.position_id!))];
    if (ids.length) {
      const { data, error } = await supabase.from("positions").select("id, name").in("id", ids);
      if (error) return json({ error: "service_unavailable" }, 503);
      const names = new Map((data ?? []).map((row) => [row.id, row.name]));
      for (const profile of profiles) if (profile.position_id && names.has(profile.position_id)) payload.get(profile.id)!.position = names.get(profile.position_id);
    }
  }

  if (selected("education")) {
    const ids = visible("education").map((profile) => profile.id);
    if (ids.length) {
      const { data, error } = await supabase.from("education").select("profile_id, degree, course, institution, institution_country, start_year, end_year, field_of_study, description, verified").in("profile_id", ids);
      if (error) return json({ error: "service_unavailable" }, 503);
      for (const item of records("education")) item.education = (data ?? []).filter((row) => row.profile_id === item.id).map((row) => ({ degree: row.degree, course: row.course, institution: row.institution, institution_country: row.institution_country, start_year: row.start_year, end_year: row.end_year, field_of_study: row.field_of_study, description: row.description, verified: row.verified }));
    }
  }
  if (selected("experience")) {
    const ids = visible("experience").map((profile) => profile.id);
    if (ids.length) {
      const { data, error } = await supabase.from("experiences").select("profile_id, organization, position, description, start_date, end_date, is_current, location, employment_type").in("profile_id", ids);
      if (error) return json({ error: "service_unavailable" }, 503);
      for (const item of records("experience")) item.experience = (data ?? []).filter((row) => row.profile_id === item.id).map((row) => ({ organization: row.organization, position: row.position, description: row.description, start_date: row.start_date, end_date: row.end_date, is_current: row.is_current, location: row.location, employment_type: row.employment_type }));
    }
  }
  if (selected("competencies")) {
    const ids = visible("competencies").map((profile) => profile.id);
    if (ids.length) {
      const { data, error } = await supabase.from("profile_skills").select("profile_id, level, years_experience, skills(name)").in("profile_id", ids);
      if (error) return json({ error: "service_unavailable" }, 503);
      const skills = (data ?? []) as unknown as SkillRow[];
      for (const item of records("competencies")) item.competencies = skills.filter((row) => row.profile_id === item.id).map((row) => ({ name: relationValue(row.skills)?.name ?? null, level: row.level, years_experience: row.years_experience }));
    }
  }
  if (selected("research_areas")) {
    const ids = visible("research_areas").map((profile) => profile.id);
    if (ids.length) {
      const { data, error } = await supabase
        .from("profile_research_areas")
        .select("profile_id, relevance, research_areas(name)")
        .in("profile_id", ids);
      if (error) return json({ error: "service_unavailable" }, 503);
      const researchAreas = (data ?? []) as unknown as Array<{
        profile_id: string;
        relevance: number | null;
        research_areas: Relation<{ name: string }>;
      }>;
      for (const item of records("research_areas")) {
        item.research_areas = researchAreas
          .filter((row) => row.profile_id === item.id)
          .map((row) => ({ name: relationValue(row.research_areas)?.name ?? null, relevance: row.relevance }));
      }
    }
  }
  if (selected("publications")) {
    const ids = visible("publications").map((profile) => profile.id);
    if (ids.length) {
      const { data: authors, error: authorsError } = await supabase.from("publication_authors").select("profile_id, publication_id, author_order, is_corresponding").in("profile_id", ids);
      if (authorsError) return json({ error: "service_unavailable" }, 503);
      const authorRows = (authors ?? []) as AuthorRow[];
      const publicationIds = [...new Set(authorRows.map((row) => row.publication_id))];
      if (publicationIds.length) {
        const { data: publications, error: publicationsError } = await supabase.from("publications").select("id, title, abstract, publication_type, year, journal, doi, url, status").in("id", publicationIds).in("status", ["PUBLISHED", "IN_PRESS"]);
        if (publicationsError) return json({ error: "service_unavailable" }, 503);
        const byId = new Map((publications ?? []).map((publication) => [publication.id, publication]));
        for (const item of records("publications")) item.publications = authorRows.filter((row) => row.profile_id === item.id).map((row) => byId.get(row.publication_id)).filter((publication) => publication !== undefined);
      }
    }
  }
  if (selected("projects")) {
    const ids = visible("projects").map((profile) => profile.id);
    if (ids.length) {
      const { data: members, error: membersError } = await supabase.from("project_members").select("profile_id, project_id, role").in("profile_id", ids);
      if (membersError) return json({ error: "service_unavailable" }, 503);
      const memberRows = (members ?? []) as MemberRow[];
      const projectIds = [...new Set(memberRows.map((row) => row.project_id))];
      if (projectIds.length) {
        const { data: projects, error: projectsError } = await supabase.from("projects").select("id, title, description, start_date, end_date, status, funding_source").in("id", projectIds);
        if (projectsError) return json({ error: "service_unavailable" }, 503);
        const byId = new Map((projects ?? []).map((project) => [project.id, project]));
        for (const item of records("projects")) item.projects = memberRows.filter((row) => row.profile_id === item.id).flatMap((row) => {
          const project = byId.get(row.project_id);
          return project && ["ACTIVE", "COMPLETED"].includes(project.status) ? [{ ...project, role: row.role }] : [];
        });
      }
    }
  }

  return json({ data: [...payload.values()], pagination: { limit, offset, total: count ?? 0, returned: profiles.length } }, 200, headers);
}
