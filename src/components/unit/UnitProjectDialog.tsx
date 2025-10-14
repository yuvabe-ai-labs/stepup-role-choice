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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectData {
  project_name: string;
  client_name: string;
  description: string;
  status: string; // "Completed" or "Ongoing"
  completion_date?: string;
}

interface UnitProjectDialogProps {
  onSave: (project: ProjectData) => void;
  children: React.ReactNode;
}

export const UnitProjectDialog: React.FC<UnitProjectDialogProps> = ({
  onSave,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectData>({
    project_name: "",
    client_name: "",
    description: "",
    status: "Ongoing",
    completion_date: "",
  });

  const handleSave = () => {
    if (!formData.project_name.trim()) return alert("Project name is required");
    onSave(formData);
    setFormData({
      project_name: "",
      client_name: "",
      description: "",
      status: "Ongoing",
      completion_date: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Project Name */}
          <div>
            <Label htmlFor="project_name">Project Name</Label>
            <Input
              id="project_name"
              placeholder="Enter project name"
              value={formData.project_name}
              onChange={(e) =>
                setFormData({ ...formData, project_name: e.target.value })
              }
            />
          </div>

          {/* Client Name */}
          <div>
            <Label htmlFor="client_name">Client Name</Label>
            <Input
              id="client_name"
              placeholder="Enter client name"
              value={formData.client_name}
              onChange={(e) =>
                setFormData({ ...formData, client_name: e.target.value })
              }
            />
          </div>

          {/* Description */}
          {/* <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter project description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div> */}

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Completion Date (only if completed) */}
          {formData.status === "Completed" && (
            <div>
              <Label htmlFor="completion_date">Completion Date</Label>
              <Input
                id="completion_date"
                type="date"
                value={formData.completion_date}
                onChange={(e) =>
                  setFormData({ ...formData, completion_date: e.target.value })
                }
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
