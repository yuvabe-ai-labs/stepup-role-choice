import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Sparkle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const summarySchema = z.object({
  cover_letter: z
    .string()
    .min(10, "Profile summary should be at least 10 characters long")
    .max(1000, "Profile summary should not exceed 1000 characters"),
});

type SummaryFormData = z.infer<typeof summarySchema>;

interface ProfileSummaryDialogProps {
  children: React.ReactNode;
  summary: string;
  onSave: (summary: string) => Promise<void>;
}

export const ProfileSummaryDialog: React.FC<ProfileSummaryDialogProps> = ({ children, summary, onSave }) => {
  const [open, setOpen] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedText, setGeneratedText] = React.useState("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SummaryFormData>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      cover_letter: summary || "",
    },
  });

  const coverLetter = watch("cover_letter");
  const characterCount = coverLetter?.length || 0;
  const wordCount = coverLetter?.trim().split(/\s+/).filter(word => word.length > 0).length || 0;

  const handleGenerate = async () => {
    if (wordCount < 15) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: {
          message: `Please enhance and polish this profile summary to make it more professional and compelling. Keep the core message but improve the language, structure, and impact: "${coverLetter}"`,
          conversationHistory: [],
          userRole: "student",
        },
      });

      if (error) throw error;

      const enhancedText = data?.response || data?.text || "";
      setGeneratedText(enhancedText);
      setValue("cover_letter", enhancedText);

      toast({
        title: "Success",
        description: "Profile summary enhanced successfully",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to enhance profile summary",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: SummaryFormData) => {
    try {
      const textToSave = generatedText || data.cover_letter;
      await onSave(textToSave);
      toast({
        title: "Success",
        description: "Profile summary updated successfully",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile summary",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            {/*  AI Assistance Textarea */}
            <div className="border rounded-xl overflow-hidden">
              {/* Gradient Header  */}
              <div className="bg-gradient-to-r from-[#DF10FF] to-[#005EFF] text-white px-4 py-2 text-sm flex items-center justify-between">
                <span>AI Assistance - Type something which you want to enhance</span>
                <span className="text-xs opacity-90">{wordCount} words (minimum 15)</span>
              </div>
              {/* Textarea  */}
              <div className="relative bg-background">
                <Textarea
                  id="cover_letter"
                  {...register("cover_letter")}
                  placeholder="Get AI assistance to write your Profile Summary (minimum 15 words)"
                  rows={6}
                  className="w-full p-4 resize-y border-0 outline-none focus:outline-none focus:ring-0"
                  disabled={isGenerating}
                />

                {errors.cover_letter && (
                  <p className="text-sm text-destructive px-4 pb-2">{errors.cover_letter.message}</p>
                )}

                {/* Create Button  */}
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={wordCount < 15 || isGenerating}
                  className="absolute bottom-3 right-3 rounded-full"
                  size="sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkle className="w-4 h-4 mr-2" />
                      Create
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isGenerating}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
