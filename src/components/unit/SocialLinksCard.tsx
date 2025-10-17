import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface SocialLinksCardProps {
  socialLinks: SocialLink[];
  handleSocialLinksSave: (links: SocialLink[]) => void;
  UnitSocialLinksDialog: any;
}

export default function SocialLinksCard({
  socialLinks,
  handleSocialLinksSave,
  UnitSocialLinksDialog,
}: SocialLinksCardProps) {
  const defaultPlatforms = [
    "Website",
    "LinkedIn",
    "Instagram",
    "Facebook",
    "X",
    "Threads",
  ];

  return (
    <Card className="rounded-3xl border border-gray-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
          <UnitSocialLinksDialog
            onSave={handleSocialLinksSave}
            currentLinks={socialLinks}
          >
            <Button
              variant="link"
              size="sm"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Add New link
            </Button>
          </UnitSocialLinksDialog>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {defaultPlatforms.map((platform) => (
            <div
              key={platform}
              className="grid grid-cols-1 sm:grid-cols-5 items-center gap-3"
            >
              <label
                htmlFor={platform.toLowerCase()}
                className="font-medium text-gray-800 sm:col-span-1"
              >
                {platform}
              </label>
              <Input
                id={platform.toLowerCase()}
                type="url"
                placeholder="https://www.url.com/"
                className="rounded-full sm:col-span-4 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
