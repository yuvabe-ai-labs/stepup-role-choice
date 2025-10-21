import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export const ShareDialog = ({ isOpen, onClose, title, url }: ShareDialogProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = encodeURIComponent(title);
  const shareLink = encodeURIComponent(shareUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive",
      });
    }
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${shareLink}&text=${shareTitle}`,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareLink}`,
      color: "bg-blue-700 hover:bg-blue-800",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Internship</DialogTitle>
          <DialogDescription>Share this internship opportunity with your network</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Social Media Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {socialLinks.map((social) => (
              <Button
                key={social.name}
                variant="outline"
                className={`flex flex-col items-center gap-2 p-4 h-auto ${social.color} text-white border-0`}
                onClick={() => window.open(social.url, "_blank", "width=600,height=400")}
              >
                <social.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{social.name}</span>
              </Button>
            ))}
          </div>

          {/* Copy Link Section */}
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-sm truncate focus:outline-none"
            />
            <Button
              size="sm"
              onClick={handleCopyLink}
              className="flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
