import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useStudentTasks } from "@/hooks/useStudentTasks";
import TaskCalendar from "@/components/TaskCalendar";
import AddTaskModal from "@/components/AddTaskModal";
import type { StudentTask } from "@/types/studentTasks.types";

export default function MyTasks() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<StudentTask | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: tasksResponse, isLoading } = useStudentTasks(applicationId);
  const tasks = tasksResponse?.data || [];

  const handleTaskClick = (task: StudentTask) => {
    setSelectedTask(task);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTask) return;
    // TODO: Implement reply functionality
    console.log(
      "Sending reply for task:",
      selectedTask.id,
      "Message:",
      replyText
    );
    setReplyText("");
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] min-h-[calc(100vh-80px)] gap-6">
          {/* Calendar Section */}
          <div className="">
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
                onTaskClick={handleTaskClick}
                onAddTaskClick={() => setIsAddModalOpen(true)}
              />
            )}
          </div>

          {/* Remarks Sidebar */}
          {/* <div className="w-full md:w-80 bg-white p-6 shadow-inner flex flex-col overflow-hidden"> */}
          <div className="w-full md:w-80 bg-white p-6 shadow-inner flex flex-col overflow-hidden border-l-4 border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex-shrink-0">
              Remarks
            </h2>

            {tasks.length === 0 ? (
              <div className="text-center py-12 flex-grow overflow-auto">
                <p className="text-gray-500 text-sm">
                  No tasks to show remarks for
                </p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto flex-grow pr-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="bg-white border border-gray-200 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className="w-4 h-1 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: task.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {task.title}
                        </h3>
                        {task.end_date && (
                          <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full border-2 border-orange-400"></span>
                            Due on {format(new Date(task.end_date), "do MMMM")}
                          </p>
                        )}
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed pl-7">
                        {task.description}
                      </p>
                    )}

                    {/* Reply Input */}
                    <div className="relative mt-3 pl-7">
                      <input
                        type="text"
                        placeholder="Reply"
                        value={selectedTask?.id === task.id ? replyText : ""}
                        onChange={(e) => {
                          setSelectedTask(task);
                          setReplyText(e.target.value);
                        }}
                        onKeyPress={(e) => {
                          if (
                            e.key === "Enter" &&
                            selectedTask?.id === task.id
                          ) {
                            handleSendReply();
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(task);
                        }}
                        className="w-full px-4 py-2 pr-10 text-xs border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(task);
                          handleSendReply();
                        }}
                        disabled={
                          selectedTask?.id !== task.id || !replyText.trim()
                        }
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-400"
                      >
                        <Send size={12} className="text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
