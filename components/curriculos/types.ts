// components/curriculos/types.ts
import { CurriculumSnapshot } from "@/app/dashboard/curriculos/actions";

export type FullCurriculumData = {
  profile: {
    id: string;
    full_name: string;
    professional_name: string | null;
    bio: string | null;
    photo_url: string | null;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
    country?: string | null;
    faculty?: { name: string } | null;
    department?: { name: string } | null;
    position?: { name: string } | null;
  };
  education: Array<{
    id: string;
    degree: string;
    course: string;
    institution: string;
    institution_country?: string | null;
    start_year?: number | null;
    end_year?: number | null;
    field_of_study?: string | null;
    description?: string | null;
  }>;
  experiences: Array<{
    id: string;
    position: string;
    organization: string;
    location?: string | null;
    employment_type?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    is_current: boolean;
    description?: string | null;
  }>;
  skills: Array<{
    id: string;
    name: string;
    category_name?: string | null;
  }>;
  projects: Array<{
    id: string;
    title: string;
    role: string;
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    status: string;
    funding_source?: string | null;
  }>;
  publications: Array<{
    id: string;
    title: string;
    journal?: string | null;
    year?: number | null;
    doi?: string | null;
    url?: string | null;
    publication_type: string;
    authors?: string[];
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issue_date?: string | null;
    expiry_date?: string | null;
    credential_id?: string | null;
    credential_url?: string | null;
    description?: string | null;
  }>;
  awards: Array<{
    id: string;
    title: string;
    issuer: string;
    year?: number | null;
    url?: string | null;
    description?: string | null;
  }>;
  languages: Array<{
    id: string;
    name: string;
    proficiency: string;
  }>;
  identifiers: Array<{
    id: string;
    identifier_type: string;
    identifier_value: string;
    url?: string | null;
  }>;
};

export type TemplateProps = {
  data: FullCurriculumData;
  snapshot: CurriculumSnapshot;
};
