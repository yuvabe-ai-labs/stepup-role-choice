import { useMemo } from "react";

interface UnitProfileCompletionProps {
  profile: any;
  unitProfile: any;
}

export const useUnitProfileCompletion = ({
  profile,
  unitProfile,
}: UnitProfileCompletionProps) => {
  const completion = useMemo(() => {
    if (!profile || !unitProfile) return 0;

    const fields = [
      // Basic profile fields
      profile.full_name,
      profile.email,
      profile.phone,

      // Unit-specific fields
      unitProfile.unit_name,
      unitProfile.unit_type,
      unitProfile.industry,
      unitProfile.logo_url,
      unitProfile.cover_image_url,
      unitProfile.description,
      unitProfile.mission,
      unitProfile.values,
      unitProfile.contact_email,
      unitProfile.contact_phone,
      unitProfile.address,
      unitProfile.website_url,

      // Array fields (check if they have content)
      Array.isArray(unitProfile.projects) && unitProfile.projects.length > 0,
      Array.isArray(unitProfile.focus_areas) &&
        unitProfile.focus_areas.length > 0,
      Array.isArray(unitProfile.skills_offered) &&
        unitProfile.skills_offered.length > 0,
      Array.isArray(unitProfile.opportunities_offered) &&
        unitProfile.opportunities_offered.length > 0,
      Array.isArray(unitProfile.social_links) &&
        unitProfile.social_links.length > 0,
      Array.isArray(unitProfile.gallery_images) &&
        unitProfile.gallery_images.length > 0,
    ];

    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  }, [profile, unitProfile]);

  return completion;
};
