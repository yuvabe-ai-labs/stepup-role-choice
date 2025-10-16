import { useState, useEffect } from "react";
import { Calendar, Clock, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScheduleInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  candidateEmail: string;
  applicationId: string;
  onSuccess?: () => void;
}

export default function ScheduleInterviewDialog({
  open,
  onOpenChange,
  candidateName,
  candidateEmail,
  applicationId,
  onSuccess,
}: ScheduleInterviewDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [senderEmail, setSenderEmail] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    meetingType: "google",
  });

  const [guestEmails, setGuestEmails] = useState<string[]>(
    candidateEmail ? [candidateEmail] : []
  );

  // ✅ Fetch current user's email (view-only)
  useEffect(() => {
    const fetchUserEmail = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setSenderEmail(user.email);
      }
    };
    fetchUserEmail();
  }, []);

  // ✅ Add guest email
  const addEmail = (email: string) => {
    const trimmed = email.trim();
    if (
      trimmed &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
      !guestEmails.includes(trimmed)
    ) {
      setGuestEmails((prev) => [...prev, trimmed]);
    }
  };

  const handleAddGuest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", " ", ","].includes(e.key)) {
      e.preventDefault();
      addEmail(e.currentTarget.value);
      e.currentTarget.value = "";
    }
  };

  const handlePasteGuests = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const emails = pasted.split(/[\s,;]+/).filter(Boolean);
    emails.forEach(addEmail);
  };

  const handleRemoveGuest = (email: string) => {
    if (email === candidateEmail) return;
    setGuestEmails(guestEmails.filter((g) => g !== email));
  };

  const handleSubmit = async () => {
    if (!formData.date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please provide date and time for the interview",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title) {
      toast({
        title: "Missing Information",
        description: "Please provide a title for the interview",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const scheduledDate = new Date(
        `${formData.date}T${formData.time}:00Z`
      ).toISOString();

      // ✅ Log all submission details before sending
      console.log("📩 Interview Submission Details:", {
        applicationId,
        candidateName,
        guestEmails,
        scheduledDate,
        title: formData.title,
        description: formData.description,
        durationMinutes: 60,
        senderEmail,
      });

      const { error } = await supabase.functions.invoke("schedule-interview", {
        body: {
          applicationId,
          candidateName,
          candidateEmail: guestEmails,
          scheduledDate,
          title: formData.title,
          description: formData.description,
          durationMinutes: 60,
          senderEmail,
        },
      });

      if (error) throw error;

      toast({
        title: "Interview Scheduled",
        description: `Google Meet link has been sent to ${candidateName}`,
      });

      onOpenChange(false);
      onSuccess?.();

      // Reset fields
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        meetingType: "google",
      });
      setGuestEmails(candidateEmail ? [candidateEmail] : []);
    } catch (error: any) {
      console.error("❌ Error scheduling interview:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to schedule interview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Schedule Interview
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* ✅ Sender Email (view only) */}
          {senderEmail && (
            <div className="space-y-1">
              <Label className="text-sm text-gray-700">Host Email</Label>
              <Input
                value={senderEmail}
                disabled
                className="h-11 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-gray-700">
              Add title
            </Label>
            <Input
              id="title"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="h-11"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-gray-700">
              Add description
            </Label>
            <Textarea
              id="description"
              placeholder="Description of the meeting"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <Label htmlFor="guests" className="text-sm text-gray-700">
              Add guests
            </Label>
            <div className="flex flex-wrap items-center gap-2 border rounded-lg p-2 min-h-[44px] focus-within:ring-2 focus-within:ring-purple-500">
              {guestEmails.map((email) => (
                <span
                  key={email}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                    email === candidateEmail
                      ? "bg-gray-200 text-gray-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {email}
                  {email !== candidateEmail && (
                    <button
                      onClick={() => handleRemoveGuest(email)}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}

              <input
                id="guests"
                type="email"
                placeholder="Add guest email..."
                onKeyDown={handleAddGuest}
                onPaste={handlePasteGuests}
                className="flex-1 border-none outline-none bg-transparent text-sm p-1 min-w-[150px]"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm text-gray-700">
                Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="h-11 pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm text-gray-700">
                Time <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="h-11 pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Meeting Type */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-700">Meeting Link</Label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, meetingType: "google" })
                }
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  formData.meetingType === "google"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-green-500 rounded flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">
                  Add Google Meet video conferencing
                </span>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-11"
            >
              {isLoading ? "Scheduling..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
