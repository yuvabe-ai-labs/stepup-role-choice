import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useStudentTasks } from "@/hooks/useStudentTasks";
import TaskCalendar from "@/components/TaskCalendar";
import AddTaskModal from "@/components/AddTaskModal";

export default function MyTasks() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: tasksResponse, isLoading } = useStudentTasks(applicationId);
  const tasks = tasksResponse?.data || [];

  if (!applicationId) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-gray-600">Invalid application ID</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>

        {/* View Mode Toggle */}
        {/* <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode("month")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              viewMode === "month"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              viewMode === "week"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Week
          </button>
        </div> */}

        {/* Calendar */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <TaskCalendar
            tasks={tasks}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            viewMode={viewMode}
          />
        )}

        {/* Task List Summary */}
        {tasks.length === 0 && !isLoading && (
          <div className="mt-8 bg-white rounded-3xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              No tasks yet. Click "Add Task" to create your first task.
            </p>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: task.color }}
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {task.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {task.start_date && task.end_date && (
                          <>
                            {new Date(task.start_date).toLocaleDateString()} -{" "}
                            {new Date(task.end_date).toLocaleDateString()}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {task.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {user?.id && (
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          applicationId={applicationId}
          studentId={user.id}
        />
      )}
    </div>
  );
}
