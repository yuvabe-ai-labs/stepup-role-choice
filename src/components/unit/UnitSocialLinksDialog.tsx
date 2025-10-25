import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
  id: string;
}

interface UnitSocialLinksDialogProps {
  onSave: (links: SocialLink[]) => void;
  currentLinks: SocialLink[];
  children: React.ReactNode;
}

export const UnitSocialLinksDialog: React.FC<UnitSocialLinksDialogProps> = ({
  onSave,
  currentLinks,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState<SocialLink[]>(currentLinks);
  const [newLink, setNewLink] = useState<SocialLink>({
    platform: "",
    url: "",
    id: "",
  });

  const platformOptions = [
    { value: "website", label: "Website" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "x", label: "X" },
    { value: "threads", label: "Threads" },
  ];

  const addNewLink = () => {
    if (newLink.platform && newLink.url) {
      const linkToAdd = {
        ...newLink,
        id: Date.now().toString(),
      };
      setLinks([...links, linkToAdd]);
      setNewLink({ platform: "", url: "", id: "" });
    }
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const handleSave = () => {
    onSave(links);
    setOpen(false);
  };

  const getPlatformDisplayName = (platform: string) => {
    const platformMap: { [key: string]: string } = {
      website: "Website",
      linkedin: "LinkedIn",
      instagram: "Instagram",
      facebook: "Facebook",
      x: "X",
      threads: "Threads",
    };
    return platformMap[platform] || platform;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Social Links</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Existing Links */}
          {links.map((link) => (
            <div key={link.id} className="space-y-2">
              <h3 className="font-semibold text-lg text-muted-foreground">
                {getPlatformDisplayName(link.platform)}
              </h3>
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                <span className="text-sm text-muted-foreground font-mono">
                  {link.url}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLink(link.id)}
                  className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Divider */}
          {links.length > 0 && <hr className="border-t border-border" />}

          {/* Add New Link Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Add New link</h4>

            <div className="space-y-3 p-4 border rounded-lg">
              <div>
                <Label htmlFor="new-platform">Platform</Label>
                <Select
                  value={newLink.platform}
                  onValueChange={(value) =>
                    setNewLink({ ...newLink, platform: value })
                  }
                >
                  <SelectTrigger id="new-platform" className="mt-1">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="new-url">URL</Label>
                <Input
                  id="new-url"
                  type="url"
                  placeholder="https://www.url.com/"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <Button
                onClick={addNewLink}
                disabled={!newLink.platform || !newLink.url}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Links</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
