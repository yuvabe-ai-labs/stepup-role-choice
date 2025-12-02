import { supabase } from "@/integrations/supabase/client";
import type {
  Application,
  MyApplicationsResponse,
} from "@/types/myApplications.types";

export const getMyApplications = async (
  userId: string
): Promise<MyApplicationsResponse> => {
  try {
    // STEP 1 — Get student profile ID
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (profileErr || !profile) {
      return { data: [], error: profileErr ?? "Profile not found" };
    }

    const studentProfileId = profile.id;

    // STEP 2 — Fetch hired applications with relations
    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        id,
        status,
        offer_decision,

        applied_date,
        cover_letter,

        internship:internship_id (
          id,
          title,
          description,
          duration,
          created_by,
          company_name,

          company_profile:created_by (
            id,
            full_name,
            email,

            unit:units (
              unit_name,
              avatar_url
            )
          )
        )
      `
      )
      .eq("student_id", studentProfileId)
      .eq("status", "hired")
      .order("applied_date", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return { data: [], error };
    }

    const formatted: Application[] =
      data?.map((item: any) => {
        return {
          id: item.id,
          status: item.status,
          offer_decision: item.offer_decision,
          applied_date: item.applied_date,
          cover_letter: item.cover_letter,

          internship: {
            id: item.internship?.id ?? "",
            title: item.internship?.title ?? "",
            description: item.internship?.description ?? "",
            duration: item.internship?.duration ?? "",
            created_by: item.internship?.created_by ?? "",
            company_name: item.internship?.company_name ?? "",

            company_profile: {
              id: item.internship?.company_profile?.id ?? "",
              full_name: item.internship?.company_profile?.full_name ?? "",
              email: item.internship?.company_profile?.email ?? "",

              unit: {
                unit_name:
                  item.internship?.company_profile?.unit?.unit_name ?? "",
                avatar_url:
                  item.internship?.company_profile?.unit?.avatar_url ?? "",
              },
            },
          },
        };
      }) ?? [];

    return {
      data: formatted,
      error: null,
    };
  } catch (err: any) {
    console.error("Unhandled error fetching applications:", err);
    return { data: [], error: err.message || err };
  }
};
