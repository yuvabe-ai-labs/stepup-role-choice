import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGallery = (userId: string, currentImages: string[]) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const bucketName = "user-media";
  const folderName = "gallery";

  const uploadImages = async (files: File[]) => {
    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of files) {
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

        uploadedUrls.push(publicUrl);
      }

      // Update gallery_images in units table
      const newGalleryImages = [...currentImages, ...uploadedUrls];
      const { error: updateError } = await supabase
        .from("units")
        .update({ gallery_images: JSON.stringify(newGalleryImages) } as any)
        .eq("profile_id", userId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });

      return uploadedUrls;
    } catch (error: any) {
      console.error("Error uploading gallery images:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string) => {
    try {
      setUploading(true);

      // Delete from storage
      const pathParts = imageUrl.split("/");
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${folderName}/${userId}/${fileName}`;

      await supabase.storage.from(bucketName).remove([filePath]);

      // Update database
      const newGalleryImages = currentImages.filter((img) => img !== imageUrl);
      const { error } = await supabase
        .from("units")
        .update({ gallery_images: JSON.stringify(newGalleryImages) } as any)
        .eq("profile_id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });

      return true;
    } catch (error: any) {
      console.error("Error deleting gallery image:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  const deleteAllImages = async () => {
    try {
      setUploading(true);

      // Delete all images from storage
      const deletePromises = currentImages.map((imageUrl) => {
        const pathParts = imageUrl.split("/");
        const fileName = pathParts[pathParts.length - 1];
        const filePath = `${folderName}/${userId}/${fileName}`;
        return supabase.storage.from(bucketName).remove([filePath]);
      });

      await Promise.all(deletePromises);

      // Update database
      const { error } = await supabase
        .from("units")
        .update({ gallery_images: JSON.stringify([]) } as any)
        .eq("profile_id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "All images deleted successfully",
      });

      return true;
    } catch (error: any) {
      console.error("Error deleting all gallery images:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete images",
        variant: "destructive",
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadImages,
    deleteImage,
    deleteAllImages,
  };
};
