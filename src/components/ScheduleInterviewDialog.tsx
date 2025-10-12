import { useState } from "react";
import { Calendar, Clock, Video } from "lucide-react";
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

export default function ScheduleInterviewDialog({
  open,
  onOpenChange,
  candidateName,
  candidateEmail,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    guests: candidateEmail || "",
    date: "",
    time: "",
    meetingType: "",
  });

  const handleSubmit = () => {
    console.log("Schedule Interview:", formData);
    // Handle the interview scheduling logic here
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Schedule Interview
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            ></button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
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
            <Input
              id="guests"
              placeholder="Example: email@gmail.com"
              value={formData.guests}
              onChange={(e) =>
                setFormData({ ...formData, guests: e.target.value })
              }
              className="h-11"
            />
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

          {/* Meeting Link */}
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
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, meetingType: "zoom" })
                }
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  formData.meetingType === "zoom"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">
                  Add Zoom Meeting video conferencing
                </span>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-11"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
