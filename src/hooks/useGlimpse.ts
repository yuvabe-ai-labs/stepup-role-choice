import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGlimpse = (
  userId: string,
  currentGlimpseUrl: string | null
) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const bucketName = "user-media";
  const folderName = "glimpse";

  const extractFileName = (url: string) => {
    try {
      if (typeof url !== "string" || !url.includes("/")) return null;
      const pathParts = url.split("/");
      return pathParts[pathParts.length - 1];
    } catch {
      return null;
    }
  };

  const uploadGlimpse = async (file: File) => {
    try {
      setUploading(true);

      // Delete old glimpse if exists
      if (currentGlimpseUrl && typeof currentGlimpseUrl === "string") {
        const fileName = extractFileName(currentGlimpseUrl);
        if (fileName) {
          const filePath = `${folderName}/${userId}/${fileName}`;
          await supabase.storage.from(bucketName).remove([filePath]);
        }
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `${folderName}/${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      // Update glimpse in units table
      const { error: updateError } = await supabase
        .from("units")
        .update({ glimpse: publicUrl } as any)
        .eq("profile_id", userId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Glimpse video uploaded successfully",
      });

      return publicUrl;
    } catch (error: any) {
      console.error("Error uploading glimpse:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteGlimpse = async () => {
    try {
      setUploading(true);

      if (!currentGlimpseUrl || typeof currentGlimpseUrl !== "string") {
        console.warn("No valid glimpse URL to delete:", currentGlimpseUrl);
        return false;
      }

      const fileName = extractFileName(currentGlimpseUrl);
      if (!fileName) {
        console.warn("Could not extract filename from URL:", currentGlimpseUrl);
        return false;
      }

      const filePath = `${folderName}/${userId}/${fileName}`;
      await supabase.storage.from(bucketName).remove([filePath]);

      // Update database
      const { error } = await supabase
        .from("units")
        .update({ glimpse: null } as any)
        .eq("profile_id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Glimpse video deleted successfully",
      });

      return true;
    } catch (error: any) {
      console.error("Error deleting glimpse:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete video",
        variant: "destructive",
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadGlimpse,
    deleteGlimpse,
  };
};
