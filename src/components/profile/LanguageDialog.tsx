import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { LanguageEntry } from '@/types/profile';

const languageSchema = z.object({
  name: z.string().min(1, 'Language name is required'),
  proficiency: z.number().min(1).max(5),
  read: z.number().min(1).max(5),
  write: z.number().min(1).max(5),
  speak: z.number().min(1).max(5),
});

type LanguageFormData = z.infer<typeof languageSchema>;

interface LanguageDialogProps {
  children: React.ReactNode;
  language?: LanguageEntry;
  onSave: (language: Omit<LanguageEntry, 'id'>) => Promise<void>;
}

export const LanguageDialog: React.FC<LanguageDialogProps> = ({
  children,
  language,
  onSave,
}) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      name: language?.name || '',
      proficiency: language?.proficiency || 3,
      read: language?.read || 3,
      write: language?.write || 3,
      speak: language?.speak || 3,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: LanguageFormData) => {
    try {
      await onSave({
        name: data.name!,
        proficiency: data.proficiency!,
        read: data.read!,
        write: data.write!,
        speak: data.speak!,
      } as Omit<LanguageEntry, 'id'>);
      toast({
        title: "Success",
        description: `Language ${language ? 'updated' : 'added'} successfully`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save language",
        variant: "destructive",
      });
    }
  };

  const getProficiencyLabel = (level: number) => {
    const labels = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Native'];
    return labels[level] || '';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{language ? 'Edit Language' : 'Add Language'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Language *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g. English, Spanish, French"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>Overall Proficiency: {getProficiencyLabel(watchedValues.proficiency)}</Label>
            <Slider
              value={[watchedValues.proficiency]}
              onValueChange={(value) => setValue('proficiency', value[0])}
              max={5}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Reading: {getProficiencyLabel(watchedValues.read)}</Label>
            <Slider
              value={[watchedValues.read]}
              onValueChange={(value) => setValue('read', value[0])}
              max={5}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Writing: {getProficiencyLabel(watchedValues.write)}</Label>
            <Slider
              value={[watchedValues.write]}
              onValueChange={(value) => setValue('write', value[0])}
              max={5}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Speaking: {getProficiencyLabel(watchedValues.speak)}</Label>
            <Slider
              value={[watchedValues.speak]}
              onValueChange={(value) => setValue('speak', value[0])}
              max={5}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : language ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};