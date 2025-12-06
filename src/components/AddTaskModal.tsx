import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateStudentTask } from "@/hooks/useStudentTasks";
import {
  addTaskSchema,
  type AddTaskFormData,
  TASK_COLORS,
} from "@/lib/taskSchemas";
import { toast } from "sonner";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  studentId: string;
}

// Helper function to convert dd/mm/yyyy to yyyy-mm-dd
const convertToISO = (dateStr: string): string => {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return dateStr;
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

// Helper function to convert yyyy-mm-dd to dd/mm/yyyy
const convertToDisplay = (dateStr: string): string => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

export default function AddTaskModal({
  isOpen,
  onClose,
  applicationId,
  studentId,
}: AddTaskModalProps) {
  const createTask = useCreateStudentTask();
  const [sliderPosition, setSliderPosition] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddTaskFormData>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      color: TASK_COLORS[0],
      note: "",
      submissionLink: "",
    },
  });

  const selectedColor = watch("color");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setSliderPosition(0);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: AddTaskFormData) => {
    try {
      await createTask.mutateAsync({
        studentId,
        taskData: {
          application_id: applicationId,
          title: data.title,
          description: data.note || undefined,
          start_date: data.startDate,
          start_time: data.startTime || undefined,
          end_date: data.endDate,
          end_time: data.endTime || undefined,
          color: data.color,
          submission_link: data.submissionLink || undefined,
        },
      });

      toast.success("Task created successfully");
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Add New Task
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Task Name */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("title")}
                placeholder="Enter task name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Start Date and Time */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  {...register("startDate")}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d]/g, "");
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + "/" + value.slice(2);
                    }
                    if (value.length >= 5) {
                      value = value.slice(0, 5) + "/" + value.slice(5, 9);
                    }
                    e.target.value = value;
                    setValue("startDate", value);
                  }}
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  {...register("startTime")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  type="text"
                  placeholder="DD/MM/YYYY"
                  {...register("endDate")}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d]/g, "");
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + "/" + value.slice(2);
                    }
                    if (value.length >= 5) {
                      value = value.slice(0, 5) + "/" + value.slice(5, 9);
                    }
                    e.target.value = value;
                    setValue("endDate", value);
                  }}
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  {...register("endTime")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Color Picker */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center justify-between gap-2 mb-3">
                {TASK_COLORS.map((color, index) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setValue("color", color);
                      setSliderPosition(
                        (index / (TASK_COLORS.length - 1)) * 100
                      );
                    }}
                    className={`w-8 h-8 rounded-full transition-all ${
                      selectedColor === color
                        ? "scale-110 ring-2 ring-offset-2 ring-gray-400"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>

              {/* Gradient Color Slider */}
              <div
                className="relative w-full h-5 rounded-full cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percentage =
                    ((e.clientX - rect.left) / rect.width) * 100;
                  setSliderPosition(Math.max(0, Math.min(100, percentage)));

                  // Calculate color based on position
                  const colorIndex = Math.round(
                    (percentage / 100) * (TASK_COLORS.length - 1)
                  );
                  setValue(
                    "color",
                    TASK_COLORS[
                      Math.max(0, Math.min(TASK_COLORS.length - 1, colorIndex))
                    ]
                  );
                }}
                style={{
                  background: `linear-gradient(90deg, ${TASK_COLORS.join(
                    ", "
                  )})`,
                }}
              >
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-[6px] h-7 bg-white rounded-full shadow-lg border-2 border-gray-300"
                  style={{
                    left: `calc(${sliderPosition}% - 3px)`,
                  }}
                ></div>
              </div>
              {errors.color && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.color.message}
                </p>
              )}
            </div>

            {/* Note */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note
              </label>
              <textarea
                {...register("note")}
                placeholder="Please describe the task"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submission Link */}
            {/* <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission link
              </label>
              <input
                type="text"
                {...register("submissionLink")}
                placeholder="https://www.url.com/"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              {errors.submissionLink && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.submissionLink.message}
                </p>
              )}
            </div> */}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
