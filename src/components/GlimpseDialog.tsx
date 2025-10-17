import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { useGlimpse } from "@/hooks/useGlimpse";
import { useToast } from "@/hooks/use-toast";

interface GlimpseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentGlimpseUrl: string | null;
  onSuccess: () => void;
}

export const GlimpseDialog = ({
  isOpen,
  onClose,
  userId,
  currentGlimpseUrl,
  onSuccess,
}: GlimpseDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, uploadGlimpse, deleteGlimpse } = useGlimpse(
    userId,
    currentGlimpseUrl
  );
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid video file.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a video smaller than 50MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const url = await uploadGlimpse(selectedFile);
    if (url) {
      setSelectedFile(null);
      setPreviewUrl(null);
      onSuccess();
      onClose();
    }
  };

  const handleDelete = async () => {
    // Directly delete — no browser popup
    const success = await deleteGlimpse();
    if (success) {
      toast({
        title: "Deleted",
        description: "Glimpse video deleted successfully.",
      });
      onSuccess();
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Glimpse of the Unit</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current or Preview Video */}
          {(previewUrl || currentGlimpseUrl) && (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={previewUrl || currentGlimpseUrl || ""}
                controls
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
              {!previewUrl && currentGlimpseUrl && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={uploading}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="video/*"
              className="hidden"
            />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              {selectedFile ? selectedFile.name : "Upload a glimpse video"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Video should be less than 50MB. Supported formats: MP4, WebM, MOV
            </p>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Choose Video
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          {selectedFile && (
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Video"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
