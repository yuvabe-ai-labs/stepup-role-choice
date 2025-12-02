import { X } from "lucide-react";
import { useState } from "react";
import { useCreateStudentTask } from "@/hooks/useStudentTasks";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  studentId: string;
}

const COLORS = [
  "#3B82F6", // Blue
  "#EC4899", // Pink
  "#EF4444", // Red
  "#3B82F6", // Dark Blue
  "#A855F7", // Purple
  "#14B8A6", // Teal
  "#22C55E", // Green
];

export default function AddTaskModal({
  isOpen,
  onClose,
  applicationId,
  studentId,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [note, setNote] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");

  const createTask = useCreateStudentTask();

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a task name");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select start and due dates");
      return;
    }

    try {
      await createTask.mutateAsync({
        studentId,
        taskData: {
          application_id: applicationId,
          title: title.trim(),
          description: note.trim() || undefined,
          start_date: startDate,
          start_time: startTime || undefined,
          end_date: endDate,
          end_time: endTime || undefined,
          color: selectedColor,
          submission_link: submissionLink.trim() || undefined,
        },
      });

      // Reset form
      setTitle("");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
      setSelectedColor(COLORS[0]);
      setNote("");
      setSubmissionLink("");
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[450px] max-h-[90vh] overflow-y-auto p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Add New Task</h2>

        {/* Task Name */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter here"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Start Date and Time */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Due Date and Time */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color
          </label>
          <div className="flex gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full transition-all ${
                  selectedColor === color
                    ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                    : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Please describe the task"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Submission Link */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submission link
          </label>
          <input
            type="url"
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
            placeholder="https://www.url.com/"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={createTask.isPending}
          className="w-full py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createTask.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
