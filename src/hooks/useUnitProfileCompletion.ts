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
      unitProfile.description,
      unitProfile.mission,
      unitProfile.values,
      unitProfile.contact_email,
      unitProfile.contact_phone,
      unitProfile.address,
      unitProfile.website_url,

      // Image fields (check avatar_url OR logo_url, banner_url OR cover_image_url)
      (unitProfile as any)?.avatar_url || unitProfile.logo_url,
      (unitProfile as any)?.banner_url || unitProfile.cover_image_url,

      // Glimpse video
      (unitProfile as any)?.glimpse,

      // Array fields (check if they have content)
      Array.isArray(unitProfile.projects) && unitProfile.projects.length > 0,
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
