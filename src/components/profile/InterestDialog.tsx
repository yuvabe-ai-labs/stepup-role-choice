import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InterestDialogProps {
  children: React.ReactNode;
  interests: string[];
  onSave: (interests: string[]) => Promise<void>;
}

export const InterestDialog: React.FC<InterestDialogProps> = ({
  children,
  interests,
  onSave,
}) => {
  const [open, setOpen] = React.useState(false);
  const [newInterest, setNewInterest] = React.useState('');
  const [currentInterests, setCurrentInterests] = React.useState<string[]>(interests);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
      setCurrentInterests(interests);
    }
  }, [open, interests]);

  const addInterest = () => {
    if (newInterest.trim() && !currentInterests.includes(newInterest.trim())) {
      setCurrentInterests([...currentInterests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setCurrentInterests(currentInterests.filter(i => i !== interest));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave(currentInterests);
      toast({
        title: "Success",
        description: "Interests updated successfully",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update interests",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Interests</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="new-interest">Add Interest</Label>
            <div className="flex space-x-2">
              <Input
                id="new-interest"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="e.g. Machine Learning, Photography"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              />
              <Button type="button" onClick={addInterest} size="sm">
                Add
              </Button>
            </div>
          </div>

          <div>
            <Label>Current Interests</Label>
            <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md">
              {currentInterests.length > 0 ? (
                currentInterests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                    {interest}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeInterest(interest)}
                    />
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No interests added yet</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};