import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import type { StudentTask } from "@/types/studentTasks.types";

interface TaskCalendarProps {
  tasks: StudentTask[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: "month" | "week";
}

export default function TaskCalendar({
  tasks,
  currentDate,
  onDateChange,
  viewMode,
}: TaskCalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => {
      if (!task.start_date || !task.end_date) return false;
      const taskStart = new Date(task.start_date);
      const taskEnd = new Date(task.end_date);
      return day >= taskStart && day <= taskEnd;
    });
  };

  const renderTaskBar = (task: StudentTask, day: Date) => {
    const taskStart = new Date(task.start_date!);
    const taskEnd = new Date(task.end_date!);
    const isStartDay = isSameDay(day, taskStart);

    if (!isStartDay) return null;

    return (
      <div
        key={task.id}
        className="text-xs text-white px-2 py-1 rounded-full truncate mb-1"
        style={{ backgroundColor: task.color || "#3B82F6" }}
      >
        {task.title}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week Day Headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={index}
              className={`min-h-[100px] border border-gray-200 rounded-lg p-2 ${
                !isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"
              } ${isToday ? "ring-2 ring-blue-500" : ""}`}
            >
              <div className="text-sm font-medium mb-1">{format(day, "d")}</div>
              <div className="space-y-1">
                {dayTasks.map((task) => renderTaskBar(task, day))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
