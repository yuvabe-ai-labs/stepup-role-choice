import { X, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useUpdateStudentTask,
  useDeleteStudentTask,
} from "@/hooks/useStudentTasks";
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

// Helper function to convert yyyy-mm-dd to dd/mm/yyyy
const convertToDisplay = (dateStr: string): string => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

// Helper function to convert dd/mm/yyyy to yyyy-mm-dd
const convertToISO = (dateStr: string): string => {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return dateStr;
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export default function UpdateTaskModal({
  isOpen,
  onClose,
  task,
}: UpdateTaskModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedColor, setSelectedColor] = useState(task.color || COLORS[0]);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [note, setNote] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateTask = useUpdateStudentTask();
  const deleteTask = useDeleteStudentTask();

  // Pre-fill existing task values when modal opens
  useEffect(() => {
    if (task) {
      setStartDate(convertToDisplay(task.start_date) || "");
      setEndDate(convertToDisplay(task.end_date) || "");
      setSelectedColor(task.color || COLORS[0]);
      setNote(task.description || "");
      setSubmissionLink(task.submission_link || "");

      // Set initial slider position based on task color
      const colorIndex = COLORS.indexOf(task.color);
      if (colorIndex !== -1) {
        setSliderPosition((colorIndex / (COLORS.length - 1)) * 100);
      }
    }
  }, [task]);

  const handleDateInput = (value: string, setter: (val: string) => void) => {
    let formatted = value.replace(/[^\d]/g, "");
    if (formatted.length >= 2) {
      formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
    }
    if (formatted.length >= 5) {
      formatted = formatted.slice(0, 5) + "/" + formatted.slice(5, 9);
    }
    setter(formatted);
  };

  const handleSave = async () => {
    if (!startDate || !endDate) {
      alert("Please select start and due dates");
      return;
    }

    // Validate date format
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      alert("Please enter dates in DD/MM/YYYY format");
      return;
    }

    const startISO = convertToISO(startDate);
    const endISO = convertToISO(endDate);

    if (new Date(endISO) < new Date(startISO)) {
      alert("Due date cannot be before start date");
      return;
    }

    try {
      await updateTask.mutateAsync({
        taskId: task.id,
        updates: {
          start_date: startISO,
          end_date: endISO,
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

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync(task.id);
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                title="Delete task"
              >
                <Trash2 size={20} />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">
                {task.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800 mb-3">
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleteTask.isPending}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteTask.isPending ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Start / Due Date */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={startDate}
                onChange={(e) => handleDateInput(e.target.value, setStartDate)}
                maxLength={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={endDate}
                onChange={(e) => handleDateInput(e.target.value, setEndDate)}
                maxLength={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color
            </label>
            <div className="flex items-center justify-between gap-2 mb-3">
              {COLORS.map((color, index) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color);
                    setSliderPosition((index / (COLORS.length - 1)) * 100);
                  }}
                  className={`w-8 h-8 rounded-full transition-all ${
                    selectedColor === color
                      ? "scale-110 ring-2 ring-offset-2 ring-gray-400"
                      : "hover:scale-105"
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
                const percentage = ((e.clientX - rect.left) / rect.width) * 100;
                setSliderPosition(Math.max(0, Math.min(100, percentage)));

                // Calculate color based on position
                const colorIndex = Math.round(
                  (percentage / 100) * (COLORS.length - 1)
                );
                setSelectedColor(
                  COLORS[Math.max(0, Math.min(COLORS.length - 1, colorIndex))]
                );
              }}
              style={{
                background: `linear-gradient(90deg, ${COLORS.join(", ")})`,
              }}
            >
              <div
                className="absolute top-1/2 -translate-y-1/2 w-[6px] h-7 bg-white rounded-full shadow-lg border-2 border-gray-300"
                style={{
                  left: `calc(${sliderPosition}% - 3px)`,
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
