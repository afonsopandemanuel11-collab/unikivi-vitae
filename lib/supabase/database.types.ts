export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_feedback: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          message_id: string
          rating: number | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          message_id: string
          rating?: number | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          message_id?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_feedback_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "ai_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          latency_ms: number | null
          metadata: Json | null
          model_name: string | null
          role: Database["public"]["Enums"]["ai_message_role_enum"]
          tokens_used: number | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          model_name?: string | null
          role: Database["public"]["Enums"]["ai_message_role_enum"]
          tokens_used?: number | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          model_name?: string | null
          role?: Database["public"]["Enums"]["ai_message_role_enum"]
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_response_sources: {
        Row: {
          created_at: string
          excerpt: string | null
          id: string
          message_id: string
          relevance: number | null
          source_id: string
          source_type: Database["public"]["Enums"]["semantic_entity_enum"]
        }
        Insert: {
          created_at?: string
          excerpt?: string | null
          id?: string
          message_id: string
          relevance?: number | null
          source_id: string
          source_type: Database["public"]["Enums"]["semantic_entity_enum"]
        }
        Update: {
          created_at?: string
          excerpt?: string | null
          id?: string
          message_id?: string
          relevance?: number | null
          source_id?: string
          source_type?: Database["public"]["Enums"]["semantic_entity_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "ai_response_sources_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "ai_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      api_clients: {
        Row: {
          contact: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          scopes: string[]
          status: string
          updated_at: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          scopes?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          scopes?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          client_id: string
          created_at: string
          expires_at: string | null
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          request_count: number
          status: string
        }
        Insert: {
          client_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          request_count?: number
          status?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          request_count?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "api_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Relationships: []
      }
      awards: {
        Row: {
          created_at: string
          description: string | null
          id: string
          issuer: string
          profile_id: string
          title: string
          url: string | null
          year: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          issuer: string
          profile_id: string
          title: string
          url?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          issuer?: string
          profile_id?: string
          title?: string
          url?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "awards_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          credential_id: string | null
          credential_url: string | null
          description: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string
          name: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer: string
          name: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string
          name?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      curricula: {
        Row: {
          created_at: string
          current_version: number
          file_url: string | null
          id: string
          is_default: boolean
          language: string
          objective: string | null
          profile_id: string
          status: Database["public"]["Enums"]["curriculum_status_enum"]
          summary: string | null
          template: Database["public"]["Enums"]["curriculum_template_enum"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_version?: number
          file_url?: string | null
          id?: string
          is_default?: boolean
          language?: string
          objective?: string | null
          profile_id: string
          status?: Database["public"]["Enums"]["curriculum_status_enum"]
          summary?: string | null
          template?: Database["public"]["Enums"]["curriculum_template_enum"]
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_version?: number
          file_url?: string | null
          id?: string
          is_default?: boolean
          language?: string
          objective?: string | null
          profile_id?: string
          status?: Database["public"]["Enums"]["curriculum_status_enum"]
          summary?: string | null
          template?: Database["public"]["Enums"]["curriculum_template_enum"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "curricula_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_versions: {
        Row: {
          change_note: string | null
          created_at: string
          curriculum_id: string
          id: string
          snapshot: Json
          version: number
        }
        Insert: {
          change_note?: string | null
          created_at?: string
          curriculum_id: string
          id?: string
          snapshot: Json
          version: number
        }
        Update: {
          change_note?: string | null
          created_at?: string
          curriculum_id?: string
          id?: string
          snapshot?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_versions_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "curricula"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string
          description: string | null
          faculty_id: string
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          faculty_id: string
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          faculty_id?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculties"
            referencedColumns: ["id"]
          },
        ]
      }
      education: {
        Row: {
          course: string
          created_at: string
          degree: string
          description: string | null
          document_url: string | null
          end_year: number | null
          field_of_study: string | null
          id: string
          institution: string
          institution_country: string | null
          profile_id: string
          start_year: number | null
          updated_at: string
          verified: boolean
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          course: string
          created_at?: string
          degree: string
          description?: string | null
          document_url?: string | null
          end_year?: number | null
          field_of_study?: string | null
          id?: string
          institution: string
          institution_country?: string | null
          profile_id: string
          start_year?: number | null
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          course?: string
          created_at?: string
          degree?: string
          description?: string | null
          document_url?: string | null
          end_year?: number | null
          field_of_study?: string | null
          id?: string
          institution?: string
          institution_country?: string | null
          profile_id?: string
          start_year?: number | null
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          created_at: string
          description: string | null
          employment_type: string | null
          end_date: string | null
          id: string
          is_current: boolean
          location: string | null
          organization: string
          position: string
          profile_id: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          organization: string
          position: string
          profile_id: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          organization?: string
          position?: string
          profile_id?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faculties: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["favorite_entity_enum"]
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["favorite_entity_enum"]
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["favorite_entity_enum"]
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          id: string
          iso_code: string
          name: string
        }
        Insert: {
          id?: string
          iso_code: string
          name: string
        }
        Update: {
          id?: string
          iso_code?: string
          name?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          published_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_academic: boolean
          name: string
          rank_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_academic?: boolean
          name: string
          rank_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_academic?: boolean
          name?: string
          rank_order?: number | null
        }
        Relationships: []
      }
      profile_identifiers: {
        Row: {
          created_at: string
          id: string
          identifier_type: Database["public"]["Enums"]["identifier_type_enum"]
          identifier_value: string
          last_synced_at: string | null
          profile_id: string
          sync_metadata: Json | null
          updated_at: string
          url: string | null
          verified: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          identifier_type: Database["public"]["Enums"]["identifier_type_enum"]
          identifier_value: string
          last_synced_at?: string | null
          profile_id: string
          sync_metadata?: Json | null
          updated_at?: string
          url?: string | null
          verified?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          identifier_type?: Database["public"]["Enums"]["identifier_type_enum"]
          identifier_value?: string
          last_synced_at?: string | null
          profile_id?: string
          sync_metadata?: Json | null
          updated_at?: string
          url?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profile_identifiers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_languages: {
        Row: {
          certification: string | null
          created_at: string
          language_id: string
          level: Database["public"]["Enums"]["language_level_enum"]
          profile_id: string
        }
        Insert: {
          certification?: string | null
          created_at?: string
          language_id: string
          level?: Database["public"]["Enums"]["language_level_enum"]
          profile_id: string
        }
        Update: {
          certification?: string | null
          created_at?: string
          language_id?: string
          level?: Database["public"]["Enums"]["language_level_enum"]
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_languages_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_languages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_research_areas: {
        Row: {
          created_at: string
          profile_id: string
          relevance: number | null
          research_area_id: string
        }
        Insert: {
          created_at?: string
          profile_id: string
          relevance?: number | null
          research_area_id: string
        }
        Update: {
          created_at?: string
          profile_id?: string
          relevance?: number | null
          research_area_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_research_areas_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_research_areas_research_area_id_fkey"
            columns: ["research_area_id"]
            isOneToOne: false
            referencedRelation: "research_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_skills: {
        Row: {
          created_at: string
          evidence: string | null
          id: string
          level: Database["public"]["Enums"]["skill_level_enum"] | null
          profile_id: string
          skill_id: string
          years_experience: number | null
        }
        Insert: {
          created_at?: string
          evidence?: string | null
          id?: string
          level?: Database["public"]["Enums"]["skill_level_enum"] | null
          profile_id: string
          skill_id: string
          years_experience?: number | null
        }
        Update: {
          created_at?: string
          evidence?: string | null
          id?: string
          level?: Database["public"]["Enums"]["skill_level_enum"] | null
          profile_id?: string
          skill_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_verifications: {
        Row: {
          description: string | null
          document_url: string | null
          id: string
          profile_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: Database["public"]["Enums"]["verification_status_enum"]
          submitted_at: string
          title: string
          type: Database["public"]["Enums"]["verification_type_enum"]
          updated_at: string
        }
        Insert: {
          description?: string | null
          document_url?: string | null
          id?: string
          profile_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["verification_status_enum"]
          submitted_at?: string
          title: string
          type?: Database["public"]["Enums"]["verification_type_enum"]
          updated_at?: string
        }
        Update: {
          description?: string | null
          document_url?: string | null
          id?: string
          profile_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["verification_status_enum"]
          submitted_at?: string
          title?: string
          type?: Database["public"]["Enums"]["verification_type_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_verifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_views: {
        Row: {
          created_at: string
          profile_id: string
          viewed_on: string
          visitor_id: string
        }
        Insert: {
          created_at?: string
          profile_id: string
          viewed_on?: string
          visitor_id: string
        }
        Update: {
          created_at?: string
          profile_id?: string
          viewed_on?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          birth_year: number | null
          created_at: string
          cv_preferences: Json | null
          department_id: string | null
          embedding_needs_update: boolean
          faculty_id: string | null
          field_visibility: Json | null
          full_name: string
          gender: string | null
          id: string
          institutional_email: string | null
          nationality: string | null
          phone: string | null
          photo_url: string | null
          position_id: string | null
          professional_name: string | null
          profile_type: Database["public"]["Enums"]["profile_type_enum"]
          search_indexable: boolean
          search_vector: unknown
          section_visibility: Json
          slug: string | null
          status: Database["public"]["Enums"]["profile_status_enum"]
          updated_at: string
          user_id: string
          video_pitch_title: string | null
          video_pitch_url: string | null
          video_pitch_visibility:
            | Database["public"]["Enums"]["visibility_enum"]
            | null
          views_count: number
          visibility: Database["public"]["Enums"]["visibility_enum"]
        }
        Insert: {
          bio?: string | null
          birth_year?: number | null
          created_at?: string
          cv_preferences?: Json | null
          department_id?: string | null
          embedding_needs_update?: boolean
          faculty_id?: string | null
          field_visibility?: Json | null
          full_name: string
          gender?: string | null
          id?: string
          institutional_email?: string | null
          nationality?: string | null
          phone?: string | null
          photo_url?: string | null
          position_id?: string | null
          professional_name?: string | null
          profile_type?: Database["public"]["Enums"]["profile_type_enum"]
          search_indexable?: boolean
          search_vector?: unknown
          section_visibility?: Json
          slug?: string | null
          status?: Database["public"]["Enums"]["profile_status_enum"]
          updated_at?: string
          user_id: string
          video_pitch_title?: string | null
          video_pitch_url?: string | null
          video_pitch_visibility?:
            | Database["public"]["Enums"]["visibility_enum"]
            | null
          views_count?: number
          visibility?: Database["public"]["Enums"]["visibility_enum"]
        }
        Update: {
          bio?: string | null
          birth_year?: number | null
          created_at?: string
          cv_preferences?: Json | null
          department_id?: string | null
          embedding_needs_update?: boolean
          faculty_id?: string | null
          field_visibility?: Json | null
          full_name?: string
          gender?: string | null
          id?: string
          institutional_email?: string | null
          nationality?: string | null
          phone?: string | null
          photo_url?: string | null
          position_id?: string | null
          professional_name?: string | null
          profile_type?: Database["public"]["Enums"]["profile_type_enum"]
          search_indexable?: boolean
          search_vector?: unknown
          section_visibility?: Json
          slug?: string | null
          status?: Database["public"]["Enums"]["profile_status_enum"]
          updated_at?: string
          user_id?: string
          video_pitch_title?: string | null
          video_pitch_url?: string | null
          video_pitch_visibility?:
            | Database["public"]["Enums"]["visibility_enum"]
            | null
          views_count?: number
          visibility?: Database["public"]["Enums"]["visibility_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          description: string | null
          joined_at: string | null
          profile_id: string
          project_id: string
          role: string
        }
        Insert: {
          description?: string | null
          joined_at?: string | null
          profile_id: string
          project_id: string
          role?: string
        }
        Update: {
          description?: string | null
          joined_at?: string | null
          profile_id?: string
          project_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          funding_amount: number | null
          funding_currency: string | null
          funding_source: string | null
          id: string
          search_vector: unknown
          start_date: string | null
          status: Database["public"]["Enums"]["project_status_enum"]
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          funding_amount?: number | null
          funding_currency?: string | null
          funding_source?: string | null
          id?: string
          search_vector?: unknown
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status_enum"]
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          funding_amount?: number | null
          funding_currency?: string | null
          funding_source?: string | null
          id?: string
          search_vector?: unknown
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status_enum"]
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      publication_authors: {
        Row: {
          author_order: number
          external_name: string | null
          external_orcid: string | null
          is_corresponding: boolean
          profile_id: string | null
          publication_id: string
        }
        Insert: {
          author_order?: number
          external_name?: string | null
          external_orcid?: string | null
          is_corresponding?: boolean
          profile_id?: string | null
          publication_id: string
        }
        Update: {
          author_order?: number
          external_name?: string | null
          external_orcid?: string | null
          is_corresponding?: boolean
          profile_id?: string | null
          publication_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publication_authors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_authors_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          abstract: string | null
          created_at: string
          doi: string | null
          file_url: string | null
          id: string
          is_open_access: boolean | null
          issue: string | null
          journal: string | null
          pages: string | null
          publication_type: Database["public"]["Enums"]["publication_type_enum"]
          search_vector: unknown
          status: Database["public"]["Enums"]["publication_status_enum"]
          title: string
          updated_at: string
          url: string | null
          volume: string | null
          year: number | null
        }
        Insert: {
          abstract?: string | null
          created_at?: string
          doi?: string | null
          file_url?: string | null
          id?: string
          is_open_access?: boolean | null
          issue?: string | null
          journal?: string | null
          pages?: string | null
          publication_type?: Database["public"]["Enums"]["publication_type_enum"]
          search_vector?: unknown
          status?: Database["public"]["Enums"]["publication_status_enum"]
          title: string
          updated_at?: string
          url?: string | null
          volume?: string | null
          year?: number | null
        }
        Update: {
          abstract?: string | null
          created_at?: string
          doi?: string | null
          file_url?: string | null
          id?: string
          is_open_access?: boolean | null
          issue?: string | null
          journal?: string | null
          pages?: string | null
          publication_type?: Database["public"]["Enums"]["publication_type_enum"]
          search_vector?: unknown
          status?: Database["public"]["Enums"]["publication_status_enum"]
          title?: string
          updated_at?: string
          url?: string | null
          volume?: string | null
          year?: number | null
        }
        Relationships: []
      }
      recommendation_evidence: {
        Row: {
          contribution: number | null
          created_at: string
          description: string | null
          evidence_id: string
          evidence_type: Database["public"]["Enums"]["evidence_type_enum"]
          id: string
          recommendation_id: string
        }
        Insert: {
          contribution?: number | null
          created_at?: string
          description?: string | null
          evidence_id: string
          evidence_type: Database["public"]["Enums"]["evidence_type_enum"]
          id?: string
          recommendation_id: string
        }
        Update: {
          contribution?: number | null
          created_at?: string
          description?: string | null
          evidence_id?: string
          evidence_type?: Database["public"]["Enums"]["evidence_type_enum"]
          id?: string
          recommendation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_evidence_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          model_version: string | null
          query_context: string | null
          reason: string | null
          recommendation_type: Database["public"]["Enums"]["recommendation_type_enum"]
          requester_id: string | null
          score: number
          score_percentage: number | null
          target_profile_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          model_version?: string | null
          query_context?: string | null
          reason?: string | null
          recommendation_type?: Database["public"]["Enums"]["recommendation_type_enum"]
          requester_id?: string | null
          score: number
          score_percentage?: number | null
          target_profile_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          model_version?: string | null
          query_context?: string | null
          reason?: string | null
          recommendation_type?: Database["public"]["Enums"]["recommendation_type_enum"]
          requester_id?: string | null
          score?: number
          score_percentage?: number | null
          target_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_target_profile_id_fkey"
            columns: ["target_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      research_areas: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_areas_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "research_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      semantic_documents: {
        Row: {
          content: string
          content_hash: string | null
          created_at: string
          embedding: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["semantic_entity_enum"]
          id: string
          metadata: Json | null
          model_name: string
          updated_at: string
        }
        Insert: {
          content: string
          content_hash?: string | null
          created_at?: string
          embedding?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["semantic_entity_enum"]
          id?: string
          metadata?: Json | null
          model_name?: string
          updated_at?: string
        }
        Update: {
          content?: string
          content_hash?: string | null
          created_at?: string
          embedding?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["semantic_entity_enum"]
          id?: string
          metadata?: Json | null
          model_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role_enum"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_enum"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_enum"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_has_role: {
        Args: { required_role: Database["public"]["Enums"]["user_role_enum"] }
        Returns: boolean
      }
      auth_is_admin: { Args: never; Returns: boolean }
      get_profile_completion: { Args: { p_profile_id: string }; Returns: Json }
      get_recommendations: {
        Args: {
          query_text: string
          rec_type?: Database["public"]["Enums"]["recommendation_type_enum"]
          result_limit?: number
        }
        Returns: {
          evidence_count: number
          faculty_name: string
          full_name: string
          profile_id: string
          reason: string
          score: number
          score_percentage: number
        }[]
      }
      hybrid_search: {
        Args: {
          query_embedding: string
          query_text: string
          result_limit?: number
          w_lexical?: number
          w_semantic?: number
        }
        Returns: {
          content: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["semantic_entity_enum"]
          hybrid_score: number
          lexical_score: number
          semantic_score: number
        }[]
      }
      match_documents: {
        Args: {
          filter_entity?: Database["public"]["Enums"]["semantic_entity_enum"]
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["semantic_entity_enum"]
          id: string
          metadata: Json
          similarity: number
        }[]
      }
      search_profiles: {
        Args: {
          query: string
          result_limit?: number
          result_offset?: number
          vis_filter?: Database["public"]["Enums"]["visibility_enum"]
        }
        Returns: {
          bio: string
          department_name: string
          faculty_name: string
          full_name: string
          position_name: string
          professional_name: string
          profile_id: string
          rank: number
          visibility: Database["public"]["Enums"]["visibility_enum"]
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      ai_message_role_enum: "user" | "assistant" | "system"
      curriculum_status_enum: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      curriculum_template_enum:
        | "UNIKIVI_CLASSIC"
        | "MODERN_EDITORIAL"
        | "CIENCIA_VITAE"
        | "EXECUTIVE"
        | "ACADEMIC_COMPACT"
      evidence_type_enum:
        | "SKILL"
        | "RESEARCH_AREA"
        | "PUBLICATION"
        | "PROJECT"
        | "EXPERIENCE"
        | "EDUCATION"
        | "IDENTIFIER"
      favorite_entity_enum:
        | "profile"
        | "publication"
        | "project"
        | "research_area"
      identifier_type_enum:
        | "ORCID"
        | "SCOPUS"
        | "CIENCIA_VITAE"
        | "GOOGLE_SCHOLAR"
        | "RESEARCHER_ID"
        | "WOS"
        | "DIMENSIONS"
        | "INSTITUTIONAL_PAGE"
        | "LINKEDIN"
        | "OTHER"
        | "CIENCIA_ID"
        | "PORTFOLIO"
        | "GITHUB"
        | "WEBSITE"
      language_level_enum:
        | "NATIVE"
        | "FLUENT"
        | "ADVANCED"
        | "INTERMEDIATE"
        | "BASIC"
      profile_status_enum:
        | "ACTIVE"
        | "INACTIVE"
        | "SUSPENDED"
        | "PENDING_VERIFICATION"
      profile_type_enum:
        | "STUDENT"
        | "TEACHER"
        | "RESEARCHER"
        | "PROFESSIONAL"
        | "TALENT"
        | "VISITOR"
        | "ADMIN"
      project_status_enum:
        | "PLANNING"
        | "ACTIVE"
        | "COMPLETED"
        | "SUSPENDED"
        | "CANCELLED"
      publication_status_enum: "PUBLISHED" | "IN_PRESS" | "SUBMITTED" | "DRAFT"
      publication_type_enum:
        | "ARTICLE"
        | "CONFERENCE"
        | "BOOK"
        | "BOOK_CHAPTER"
        | "THESIS"
        | "REPORT"
        | "PREPRINT"
        | "OTHER"
      recommendation_type_enum:
        | "JURY"
        | "COLLABORATION"
        | "REVIEWER"
        | "SUPERVISION"
        | "GENERAL"
      semantic_entity_enum:
        | "profile"
        | "publication"
        | "project"
        | "research_area"
      skill_level_enum: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT"
      user_role_enum:
        | "user"
        | "student"
        | "teacher"
        | "researcher"
        | "reviewer"
        | "institution_admin"
        | "super_admin"
      verification_status_enum:
        | "PENDING"
        | "VERIFIED"
        | "REJECTED"
        | "NEEDS_REVIEW"
      verification_type_enum:
        | "DEGREE"
        | "PUBLICATION"
        | "PROFESSORSHIP"
        | "PROJECT_LEADERSHIP"
        | "AWARD"
        | "GENERAL"
      visibility_enum: "PUBLIC" | "INSTITUTIONAL" | "RESTRICTED" | "PRIVATE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ai_message_role_enum: ["user", "assistant", "system"],
      curriculum_status_enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      curriculum_template_enum: [
        "UNIKIVI_CLASSIC",
        "MODERN_EDITORIAL",
        "CIENCIA_VITAE",
        "EXECUTIVE",
        "ACADEMIC_COMPACT",
      ],
      evidence_type_enum: [
        "SKILL",
        "RESEARCH_AREA",
        "PUBLICATION",
        "PROJECT",
        "EXPERIENCE",
        "EDUCATION",
        "IDENTIFIER",
      ],
      favorite_entity_enum: [
        "profile",
        "publication",
        "project",
        "research_area",
      ],
      identifier_type_enum: [
        "ORCID",
        "SCOPUS",
        "CIENCIA_VITAE",
        "GOOGLE_SCHOLAR",
        "RESEARCHER_ID",
        "WOS",
        "DIMENSIONS",
        "INSTITUTIONAL_PAGE",
        "LINKEDIN",
        "OTHER",
        "CIENCIA_ID",
        "PORTFOLIO",
        "GITHUB",
        "WEBSITE",
      ],
      language_level_enum: [
        "NATIVE",
        "FLUENT",
        "ADVANCED",
        "INTERMEDIATE",
        "BASIC",
      ],
      profile_status_enum: [
        "ACTIVE",
        "INACTIVE",
        "SUSPENDED",
        "PENDING_VERIFICATION",
      ],
      profile_type_enum: [
        "STUDENT",
        "TEACHER",
        "RESEARCHER",
        "PROFESSIONAL",
        "TALENT",
        "VISITOR",
        "ADMIN",
      ],
      project_status_enum: [
        "PLANNING",
        "ACTIVE",
        "COMPLETED",
        "SUSPENDED",
        "CANCELLED",
      ],
      publication_status_enum: ["PUBLISHED", "IN_PRESS", "SUBMITTED", "DRAFT"],
      publication_type_enum: [
        "ARTICLE",
        "CONFERENCE",
        "BOOK",
        "BOOK_CHAPTER",
        "THESIS",
        "REPORT",
        "PREPRINT",
        "OTHER",
      ],
      recommendation_type_enum: [
        "JURY",
        "COLLABORATION",
        "REVIEWER",
        "SUPERVISION",
        "GENERAL",
      ],
      semantic_entity_enum: [
        "profile",
        "publication",
        "project",
        "research_area",
      ],
      skill_level_enum: ["BASIC", "INTERMEDIATE", "ADVANCED", "EXPERT"],
      user_role_enum: [
        "user",
        "student",
        "teacher",
        "researcher",
        "reviewer",
        "institution_admin",
        "super_admin",
      ],
      verification_status_enum: [
        "PENDING",
        "VERIFIED",
        "REJECTED",
        "NEEDS_REVIEW",
      ],
      verification_type_enum: [
        "DEGREE",
        "PUBLICATION",
        "PROFESSORSHIP",
        "PROJECT_LEADERSHIP",
        "AWARD",
        "GENERAL",
      ],
      visibility_enum: ["PUBLIC", "INSTITUTIONAL", "RESTRICTED", "PRIVATE"],
    },
  },
} as const

