import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import { useStudentTasks } from "@/hooks/useStudentTasks";
import TaskCalendar from "@/components/TaskCalendar";
import ViewTaskModal from "@/components/ViewTaskModal";
import type { StudentTask } from "@/types/studentTasks.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CandidateInfoCard from "@/components/CandidateInfoCard";

export default function UnitCandidateTasks() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [selectedTask, setSelectedTask] = useState<StudentTask | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: tasksResponse, isLoading: tasksLoading } =
    useStudentTasks(applicationId);
  const tasks = tasksResponse?.data || [];

  const handleTaskClick = (task: StudentTask) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedTask(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500";
      case "redo":
        return "bg-orange-500";
      case "submitted":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "redo":
        return "Needs Redo";
      case "submitted":
        return "Submitted";
      default:
        return "Pending";
    }
  };

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

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] min-h-[calc(100vh-300px)] gap-20">
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-6">
            <div className="mt-4">
              <CandidateInfoCard applicationId={applicationId} />
            </div>

            {/* Calendar Section */}
            {tasksLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : (
              <TaskCalendar
                tasks={tasks}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                viewMode={viewMode}
                onTaskClick={handleTaskClick}
                onAddTaskClick={() => {}}
                hideAddButton={true}
              />
            )}
          </div>

          {/* Tasks List Sidebar */}
          <div className="w-full md:w-80 bg-white p-6 shadow-inner flex flex-col overflow-hidden border-l-4 border-gray-300 min-h-[calc(100vh-80px)]">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex-shrink-0">
              Tasks Overview
            </h2>

            {tasks.length === 0 ? (
              <div className="text-center py-12 flex-grow overflow-auto">
                <p className="text-gray-500 text-sm">No tasks assigned yet</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto flex-grow pr-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="bg-white border border-gray-200 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md"
                  >
                    {/* Keep your existing inner content */}
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: task.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {task.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={`${getStatusColor(
                              task.status
                            )} text-white text-xs px-2 py-0.5`}
                          >
                            {getStatusLabel(task.status)}
                          </Badge>
                        </div>
                        {task.end_date && (
                          <p className="text-xs text-gray-500 mt-1">
                            Due:{" "}
                            {format(new Date(task.end_date), "MMM d, yyyy")}
                            {task.end_time && ` at ${task.end_time}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 pl-7">
                        {task.description}
                      </p>
                    )}

                    {task.submission_link && (
                      <div className="mt-2 pl-7">
                        <Badge variant="outline" className="text-xs">
                          Submission Available
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Task Modal */}
      {selectedTask && (
        <ViewTaskModal
          isOpen={isViewModalOpen}
          onClose={handleCloseModal}
          task={selectedTask}
        />
      )}
    </div>
  );
}
