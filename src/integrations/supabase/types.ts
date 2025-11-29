export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      applications: {
        Row: {
          applied_date: string;
          cover_letter: string | null;
          id: string;
          included_sections: Json | null;
          internship_id: string;
          profile_match_score: number | null;
          status: Database["public"]["Enums"]["application_status"];
          student_id: string;
          updated_at: string;
        };
        Insert: {
          applied_date?: string;
          cover_letter?: string | null;
          id?: string;
          included_sections?: Json | null;
          internship_id: string;
          profile_match_score?: number | null;
          status?: Database["public"]["Enums"]["application_status"];
          student_id: string;
          updated_at?: string;
        };
        Update: {
          applied_date?: string;
          cover_letter?: string | null;
          id?: string;
          included_sections?: Json | null;
          internship_id?: string;
          profile_match_score?: number | null;
          status?: Database["public"]["Enums"]["application_status"];
          student_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_internship_id_fkey";
            columns: ["internship_id"];
            isOneToOne: false;
            referencedRelation: "internships";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      course_enrollments: {
        Row: {
          completion_date: string | null;
          course_id: string;
          created_at: string;
          enrollment_date: string;
          id: string;
          progress: number | null;
          status: Database["public"]["Enums"]["enrollment_status"];
          student_id: string;
        };
        Insert: {
          completion_date?: string | null;
          course_id: string;
          created_at?: string;
          enrollment_date?: string;
          id?: string;
          progress?: number | null;
          status?: Database["public"]["Enums"]["enrollment_status"];
          student_id: string;
        };
        Update: {
          completion_date?: string | null;
          course_id?: string;
          created_at?: string;
          enrollment_date?: string;
          id?: string;
          progress?: number | null;
          status?: Database["public"]["Enums"]["enrollment_status"];
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      courses: {
        Row: {
          category: string | null;
          created_at: string;
          created_by: string;
          description: string | null;
          difficulty_level: string | null;
          duration: string | null;
          enrolled_count: number | null;
          id: string;
          image_url: string | null;
          provider: string | null;
          status: Database["public"]["Enums"]["course_status"];
          title: string;
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          created_by: string;
          description?: string | null;
          difficulty_level?: string | null;
          duration?: string | null;
          enrolled_count?: number | null;
          id?: string;
          image_url?: string | null;
          provider?: string | null;
          status?: Database["public"]["Enums"]["course_status"];
          title: string;
          updated_at?: string;
          website_url?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          difficulty_level?: string | null;
          duration?: string | null;
          enrolled_count?: number | null;
          id?: string;
          image_url?: string | null;
          provider?: string | null;
          status?: Database["public"]["Enums"]["course_status"];
          title?: string;
          updated_at?: string;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "courses_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "units";
            referencedColumns: ["id"];
          }
        ];
      };
      internships: {
        Row: {
          min_age_required: any;
          job_type: string;
          application_deadline: string | null;
          application_url: string | null;
          benefits: Json | null;
          company_description: string | null;
          company_email: string | null;
          company_logo: string | null;
          company_name: string;
          created_at: string;
          created_by: string;
          description: string | null;
          duration: string | null;
          id: string;
          is_paid: boolean | null;
          language_requirements: Json | null;
          location: string | null;
          payment: string | null;
          posted_date: string | null;
          requirements: Json | null;
          responsibilities: Json | null;
          skills_required: Json | null;
          status: Database["public"]["Enums"]["internship_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          application_deadline?: string | null;
          application_url?: string | null;
          benefits?: Json | null;
          company_description?: string | null;
          company_email?: string | null;
          company_logo?: string | null;
          company_name: string;
          created_at?: string;
          created_by: string;
          description?: string | null;
          duration?: string | null;
          id?: string;
          is_paid?: boolean | null;
          language_requirements?: Json | null;
          location?: string | null;
          payment?: string | null;
          posted_date?: string | null;
          requirements?: Json | null;
          responsibilities?: Json | null;
          skills_required?: Json | null;
          status?: Database["public"]["Enums"]["internship_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          application_deadline?: string | null;
          application_url?: string | null;
          benefits?: Json | null;
          company_description?: string | null;
          company_email?: string | null;
          company_logo?: string | null;
          company_name?: string;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          duration?: string | null;
          id?: string;
          is_paid?: boolean | null;
          language_requirements?: Json | null;
          location?: string | null;
          payment?: string | null;
          posted_date?: string | null;
          requirements?: Json | null;
          responsibilities?: Json | null;
          skills_required?: Json | null;
          status?: Database["public"]["Enums"]["internship_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "internships_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      interviews: {
        Row: {
          application_id: string | null;
          created_at: string | null;
          description: string | null;
          duration_minutes: number | null;
          id: string;
          meeting_link: string;
          scheduled_date: string;
          status: string | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          application_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          duration_minutes?: number | null;
          id?: string;
          meeting_link: string;
          scheduled_date: string;
          status?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          application_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          duration_minutes?: number | null;
          id?: string;
          meeting_link?: string;
          scheduled_date?: string;
          status?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          id: string;
          is_read: boolean;
          message: string;
          related_id: string | null;
          title: string;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_read?: boolean;
          message: string;
          related_id?: string | null;
          title: string;
          type?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_read?: boolean;
          message?: string;
          related_id?: string | null;
          title?: string;
          type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          date_of_birth: string | null;
          email: string | null;
          full_name: string;
          gender: string | null;
          id: string;
          onboarding_completed: boolean | null;
          phone: string | null;
          role: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          full_name: string;
          gender?: string | null;
          id?: string;
          onboarding_completed?: boolean | null;
          phone?: string | null;
          role: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          full_name?: string;
          gender?: string | null;
          id?: string;
          onboarding_completed?: boolean | null;
          phone?: string | null;
          role?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      saved_internships: {
        Row: {
          created_at: string;
          id: string;
          internship_id: string;
          student_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          internship_id: string;
          student_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          internship_id?: string;
          student_id?: string;
        };
        Relationships: [];
      };
      student_education: {
        Row: {
          created_at: string | null;
          degree: string;
          end_year: number | null;
          id: string;
          institution: string;
          profile_id: string;
          score: string | null;
          start_year: number | null;
        };
        Insert: {
          created_at?: string | null;
          degree: string;
          end_year?: number | null;
          id?: string;
          institution: string;
          profile_id: string;
          score?: string | null;
          start_year?: number | null;
        };
        Update: {
          created_at?: string | null;
          degree?: string;
          end_year?: number | null;
          id?: string;
          institution?: string;
          profile_id?: string;
          score?: string | null;
          start_year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "student_education_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "student_profiles";
            referencedColumns: ["profile_id"];
          }
        ];
      };
      student_internships: {
        Row: {
          company: string;
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          profile_id: string;
          role: string;
          start_date: string | null;
        };
        Insert: {
          company: string;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          profile_id: string;
          role: string;
          start_date?: string | null;
        };
        Update: {
          company?: string;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          profile_id?: string;
          role?: string;
          start_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "student_internships_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "student_profiles";
            referencedColumns: ["profile_id"];
          }
        ];
      };
      student_profiles: {
        Row: {
          achievements: Json | null;
          avatar_url: string | null;
          banner_url: string | null;
          behance_url: string | null;
          bio: string[] | null;
          completed_courses: Json | null;
          cover_letter: string | null;
          created_at: string;
          dribbble_url: string | null;
          education: Json | null;
          experience_level: string | null;
          has_career_break: boolean | null;
          headline: string | null;
          id: string;
          interests: Json | null;
          internships: Json | null;
          is_differently_abled: boolean | null;
          languages: Json | null;
          linkedin_url: string | null;
          links: Json | null;
          location: string | null;
          looking_for: string[] | null;
          marital_status: string | null;
          portfolio_url: string | null;
          preferred_language: string | null;
          profile_id: string;
          profile_type: string | null;
          projects: Json | null;
          resume_url: string | null;
          skills: Json | null;
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          achievements?: Json | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          behance_url?: string | null;
          bio?: string[] | null;
          completed_courses?: Json | null;
          cover_letter?: string | null;
          created_at?: string;
          dribbble_url?: string | null;
          education?: Json | null;
          experience_level?: string | null;
          has_career_break?: boolean | null;
          headline?: string | null;
          id?: string;
          interests?: Json | null;
          internships?: Json | null;
          is_differently_abled?: boolean | null;
          languages?: Json | null;
          linkedin_url?: string | null;
          links?: Json | null;
          location?: string | null;
          looking_for?: string[] | null;
          marital_status?: string | null;
          portfolio_url?: string | null;
          preferred_language?: string | null;
          profile_id: string;
          profile_type?: string | null;
          projects?: Json | null;
          resume_url?: string | null;
          skills?: Json | null;
          updated_at?: string;
          website_url?: string | null;
        };
        Update: {
          achievements?: Json | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          behance_url?: string | null;
          bio?: string[] | null;
          completed_courses?: Json | null;
          cover_letter?: string | null;
          created_at?: string;
          dribbble_url?: string | null;
          education?: Json | null;
          experience_level?: string | null;
          has_career_break?: boolean | null;
          headline?: string | null;
          id?: string;
          interests?: Json | null;
          internships?: Json | null;
          is_differently_abled?: boolean | null;
          languages?: Json | null;
          linkedin_url?: string | null;
          links?: Json | null;
          location?: string | null;
          looking_for?: string[] | null;
          marital_status?: string | null;
          portfolio_url?: string | null;
          preferred_language?: string | null;
          profile_id?: string;
          profile_type?: string | null;
          projects?: Json | null;
          resume_url?: string | null;
          skills?: Json | null;
          updated_at?: string;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "student_profiles_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      units: {
        Row: {
          address: string | null;
          avatar_url: string | null;
          banner_url: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string;
          description: string | null;
          focus_areas: Json | null;
          gallery_images: Json | null;
          glimpse: Json | null;
          id: string;
          industry: string | null;
          is_aurovillian: boolean | null;
          mission: string | null;
          opportunities_offered: Json | null;
          profile_id: string;
          projects: Json | null;
          skills_offered: Json | null;
          social_links: Json | null;
          unit_name: string | null;
          unit_type: string | null;
          updated_at: string;
          values: string | null;
          website_url: string | null;
        };
        Insert: {
          address?: string | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          description?: string | null;
          focus_areas?: Json | null;
          gallery_images?: Json | null;
          glimpse?: Json | null;
          id?: string;
          industry?: string | null;
          is_aurovillian?: boolean | null;
          mission?: string | null;
          opportunities_offered?: Json | null;
          profile_id: string;
          projects?: Json | null;
          skills_offered?: Json | null;
          social_links?: Json | null;
          unit_name?: string | null;
          unit_type?: string | null;
          updated_at?: string;
          values?: string | null;
          website_url?: string | null;
        };
        Update: {
          address?: string | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          description?: string | null;
          focus_areas?: Json | null;
          gallery_images?: Json | null;
          glimpse?: Json | null;
          id?: string;
          industry?: string | null;
          is_aurovillian?: boolean | null;
          mission?: string | null;
          opportunities_offered?: Json | null;
          profile_id?: string;
          projects?: Json | null;
          skills_offered?: Json | null;
          social_links?: Json | null;
          unit_name?: string | null;
          unit_type?: string | null;
          updated_at?: string;
          values?: string | null;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "units_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_unit_user: { Args: never; Returns: boolean };
    };
    Enums: {
      app_role: "student" | "unit" | "admin";
      application_status:
        | "applied"
        | "shortlisted"
        | "rejected"
        | "interviewed"
        | "hired";
      course_status: "active" | "inactive" | "draft";
      enrollment_status: "enrolled" | "completed" | "dropped";
      internship_status: "active" | "closed" | "draft";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "unit", "admin"],
      application_status: [
        "applied",
        "shortlisted",
        "rejected",
        "interviewed",
        "hired",
      ],
      course_status: ["active", "inactive", "draft"],
      enrollment_status: ["enrolled", "completed", "dropped"],
      internship_status: ["active", "closed", "draft"],
    },
  },
} as const;
