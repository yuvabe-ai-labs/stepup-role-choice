import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const summarySchema = z.object({
  cover_letter: z.string().min(10, 'Profile summary should be at least 10 characters long').max(1000, 'Profile summary should not exceed 1000 characters'),
});

type SummaryFormData = z.infer<typeof summarySchema>;

interface ProfileSummaryDialogProps {
  children: React.ReactNode;
  summary: string;
  onSave: (summary: string) => Promise<void>;
}

export const ProfileSummaryDialog: React.FC<ProfileSummaryDialogProps> = ({
  children,
  summary,
  onSave,
}) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<SummaryFormData>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      cover_letter: summary || '',
    },
  });

  const coverLetter = watch('cover_letter');
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
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile Summary</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="cover_letter">Profile Summary</Label>
            <Textarea
              id="cover_letter"
              {...register('cover_letter')}
              placeholder="Write a brief summary about yourself, your skills, and what you're looking for..."
              rows={6}
              className="mt-1"
            />
            <div className="flex justify-between mt-1">
              <div>
                {errors.cover_letter && (
                  <p className="text-sm text-destructive">{errors.cover_letter.message}</p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {characterCount}/1000 characters
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};