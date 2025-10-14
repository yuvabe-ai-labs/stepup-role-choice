import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface UnitSocialLinksDialogProps {
  onSave: (link: any) => Promise<void>;
  children: React.ReactNode;
}

export const UnitSocialLinksDialog = ({
  onSave,
  children,
}: UnitSocialLinksDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    platform: "",
    url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    setFormData({
      platform: "",
      url: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Social Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              value={formData.platform}
              onChange={(e) =>
                setFormData({ ...formData, platform: e.target.value })
              }
              placeholder="e.g., LinkedIn, Twitter"
              required
            />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="https://..."
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Link</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
