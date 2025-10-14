import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface UnitValuesDialogProps {
  values: string[];
  onSave: (values: string[]) => Promise<void>;
  children: React.ReactNode;
}

export const UnitValuesDialog = ({
  values,
  onSave,
  children,
}: UnitValuesDialogProps) => {
  const [open, setOpen] = useState(false);
  const [valuesList, setValuesList] = useState<string[]>(values);
  const [newValue, setNewValue] = useState("");

  const handleAddValue = () => {
    if (newValue.trim()) {
      setValuesList([...valuesList, newValue.trim()]);
      setNewValue("");
    }
  };

  const handleRemoveValue = (index: number) => {
    setValuesList(valuesList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(valuesList);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Core Values</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="value">Add Value</Label>
            <div className="flex space-x-2">
              <Input
                id="value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="e.g., Innovation, Integrity"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddValue();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddValue}
                variant="secondary"
              >
                Add
              </Button>
            </div>
          </div>
          <div>
            <Label>Current Values</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {valuesList.map((value, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 flex items-center gap-1"
                >
                  {value}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleRemoveValue(index)}
                  />
                </Badge>
              ))}
              {valuesList.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No values added yet
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Values</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
