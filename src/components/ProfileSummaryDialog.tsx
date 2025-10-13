import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Sparkle } from "lucide-react";
import { log } from "console";

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
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SummaryFormData>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      cover_letter: summary || "",
    },
  });

  const coverLetter = watch("cover_letter");
  const characterCount = coverLetter?.length || 0;

  const onSubmit = async (data: SummaryFormData) => {
    try {
      await onSave(data.cover_letter);
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
              <div className="bg-gradient-to-r from-[#DF10FF] to-[#005EFF] text-white px-[2px] py-[1px] text-sm">
                <span className="p-4">AI Assistance - Type something which you want to enhance</span>
                {/* Textarea  */}
                <div className="relative">
                  <Textarea
                    id="cover_letter"
                    {...register("cover_letter")}
                    placeholder="Get AI assistance to write your Profile Summary"
                    rows={6}
                    className="mt-2 w-full p-4 resize-y border-0 outline-none text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-0"
                  />

                  {errors.cover_letter && <p className="text-sm">{errors.cover_letter.message}</p>}

                  {/* Create Button  */}
                  <button
                    className="absolute bottom-2 right-2 bg-white text-gray-500 border rounded-full px-3 py-1 text-sm hover:bg-gray-100"
                    // disabled={submi}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 text-right">
              <Button
                className="bg-white border text-gray-500 rounded-full px-6 py-2 text-sm hover:bg-gray-50"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
