import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useUpdateStudentTask } from "@/hooks/useStudentTasks";
import type { StudentTask } from "@/types/studentTasks.types";

interface UpdateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: StudentTask;
}

const COLORS = [
  "#F97316",
  "#10B981",
  "#0EA5E9",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F59E0B",
];

export default function UpdateTaskModal({
  isOpen,
  onClose,
  task,
}: UpdateTaskModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedColor, setSelectedColor] = useState(task.color || COLORS[0]);
  const [note, setNote] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");

  const updateTask = useUpdateStudentTask();

  // Pre-fill existing task values when modal opens
  useEffect(() => {
    if (task) {
      setStartDate(task.start_date || "");
      setEndDate(task.end_date || "");
      setSelectedColor(task.color || COLORS[0]);
      setNote(task.description || "");
      setSubmissionLink(task.submission_link || "");
    }
  }, [task]);

  const handleSave = async () => {
    if (!startDate || !endDate) {
      alert("Please select start and due dates");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert("Due date cannot be before start date");
      return;
    }

    try {
      await updateTask.mutateAsync({
        taskId: task.id,
        updates: {
          start_date: startDate,
          end_date: endDate,
          color: selectedColor,
          description: note || undefined,
          submission_link: submissionLink || undefined,
        },
      });

      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Work on {task.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Start / Due Date */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <div className="flex items-center justify-between pb-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    selectedColor === color
                      ? "scale-125 ring-2 ring-gray-400"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Gradient Color Slider */}
            <div
              className="relative w-full h-5 rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percentage = (e.clientX - rect.left) / rect.width;
                const gradient = [
                  "#FF0000",
                  "#FF7F00",
                  "#FFFF00",
                  "#00FF00",
                  "#00FFFF",
                  "#0000FF",
                  "#8B00FF",
                  "#FF0000",
                ];
                const index = Math.floor(percentage * (gradient.length - 1));
                setSelectedColor(gradient[index]);
              }}
              style={{
                background:
                  "linear-gradient(90deg, red, orange, yellow, green, cyan, blue, violet, red)",
              }}
            >
              <div
                className="absolute top-1/2 -translate-y-1/2 w-[6px] h-7 bg-white rounded-full shadow"
                style={{
                  left: `calc(${(() => {
                    const idx = COLORS.indexOf(selectedColor);
                    const percent = idx / (COLORS.length - 1);
                    return percent * 100;
                  })()}% - 3px)`,
                }}
              ></div>
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe this task"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Submission Link */}
          <div className="mb-7">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Submission link
            </label>
            <input
              type="url"
              value={submissionLink}
              onChange={(e) => setSubmissionLink(e.target.value)}
              placeholder="https://www.url.com/"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={updateTask.isPending}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {updateTask.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
