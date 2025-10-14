import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const useUnitProfileData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [unitProfile, setUnitProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Helper to safely parse JSON fields
  const parseJsonField = (field: any, defaultValue: any = []) => {
    if (!field) return defaultValue;
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return defaultValue;
      }
    }
    return field;
  };

  // Fetch profile and unit profile data
  const fetchProfileData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch base profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);

      // Fetch unit profile
      const { data: unitData, error: unitError } = await supabase
        .from("units")
        .select("*")
        .eq("profile_id", profileData.id)
        .maybeSingle();

      if (unitError && unitError.code !== "PGRST116") {
        throw unitError;
      }

      setUnitProfile(unitData);
    } catch (error: any) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // Update base profile
  const updateProfile = async (updates: any) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile.id);

      if (error) throw error;

      setProfile({ ...profile, ...updates });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // Update unit profile
  const updateUnitProfile = async (updates: any) => {
    if (!profile) return;

    try {
      if (!unitProfile) {
        // Create new unit profile
        const { data, error } = await supabase
          .from("units")
          .insert([{ profile_id: profile.id, ...updates }])
          .select()
          .single();

        if (error) throw error;
        setUnitProfile(data);
      } else {
        // Update existing unit profile
        const { error } = await supabase
          .from("units")
          .update(updates)
          .eq("id", unitProfile.id);

        if (error) throw error;
        setUnitProfile({ ...unitProfile, ...updates });
      }

      toast.success("Unit profile updated successfully");
    } catch (error: any) {
      console.error("Error updating unit profile:", error);
      toast.error("Failed to update unit profile");
    }
  };

  // Add project entry
  const addProjectEntry = async (project: any) => {
    if (!unitProfile) return;

    const projects = parseJsonField(unitProfile.projects, []);
    const newProject = { ...project, id: Date.now().toString() };
    const updatedProjects = [...projects, newProject];

    await updateUnitProfile({ projects: updatedProjects });
  };

  // Remove project entry
  const removeProjectEntry = async (projectId: string) => {
    if (!unitProfile) return;

    const projects = parseJsonField(unitProfile.projects, []);
    const updatedProjects = projects.filter((p: any) => p.id !== projectId);

    await updateUnitProfile({ projects: updatedProjects });
  };

  // Add officer entry
  const addOfficerEntry = async (officer: any) => {
    if (!unitProfile) return;

    const officers = parseJsonField(unitProfile.officers, []);
    const newOfficer = { ...officer, id: Date.now().toString() };
    const updatedOfficers = [...officers, newOfficer];

    await updateUnitProfile({ officers: updatedOfficers });
  };

  // Remove officer entry
  const removeOfficerEntry = async (officerId: string) => {
    if (!unitProfile) return;

    const officers = parseJsonField(unitProfile.officers, []);
    const updatedOfficers = officers.filter((o: any) => o.id !== officerId);

    await updateUnitProfile({ officers: updatedOfficers });
  };

  // Add achievement entry
  const addAchievementEntry = async (achievement: any) => {
    if (!unitProfile) return;

    const achievements = parseJsonField(unitProfile.achievements, []);
    const newAchievement = { ...achievement, id: Date.now().toString() };
    const updatedAchievements = [...achievements, newAchievement];

    await updateUnitProfile({ achievements: updatedAchievements });
  };

  // Remove achievement entry
  const removeAchievementEntry = async (achievementId: string) => {
    if (!unitProfile) return;

    const achievements = parseJsonField(unitProfile.achievements, []);
    const updatedAchievements = achievements.filter(
      (a: any) => a.id !== achievementId
    );

    await updateUnitProfile({ achievements: updatedAchievements });
  };

  // Update values array
  const updateValues = async (values: string[]) => {
    await updateUnitProfile({ values });
  };

  // Remove single value
  const removeValue = async (value: string) => {
    if (!unitProfile) return;

    const values = parseJsonField(unitProfile.values, []);
    const updatedValues = values.filter((v: string) => v !== value);

    await updateUnitProfile({ values: updatedValues });
  };

  // Add social link
  const addSocialLink = async (link: any) => {
    if (!unitProfile) return;

    const socialLinks = parseJsonField(unitProfile.social_links, []);
    const newLink = { ...link, id: Date.now().toString() };
    const updatedLinks = [...socialLinks, newLink];

    await updateUnitProfile({ social_links: updatedLinks });
  };

  // Remove social link
  const removeSocialLink = async (linkId: string) => {
    if (!unitProfile) return;

    const socialLinks = parseJsonField(unitProfile.social_links, []);
    const updatedLinks = socialLinks.filter((l: any) => l.id !== linkId);

    await updateUnitProfile({ social_links: updatedLinks });
  };

  // Update gallery images
  const updateGalleryImages = async (images: string[]) => {
    await updateUnitProfile({ gallery_images: images });
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  return {
    profile,
    unitProfile,
    loading,
    updateProfile,
    updateUnitProfile,
    addProjectEntry,
    removeProjectEntry,
    addOfficerEntry,
    removeOfficerEntry,
    addAchievementEntry,
    removeAchievementEntry,
    updateValues,
    removeValue,
    addSocialLink,
    removeSocialLink,
    updateGalleryImages,
    parseJsonField,
  };
};
