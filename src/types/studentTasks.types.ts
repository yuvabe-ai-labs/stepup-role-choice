export type TaskStatus = "pending" | "in_progress" | "completed" | "reviewed";

export interface StudentTask {
  id: string;
  application_id: string;
  student_id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  start_time: string | null;
  end_date: string | null;
  end_time: string | null;
  color: string;
  submission_link: string | null;
  status: TaskStatus;
  submitted_at: string | null;
  reviewed_by: string | null;
  review_remarks: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  application_id: string;
  title: string;
  description?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  color?: string;
  submission_link?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  color?: string;
  submission_link?: string;
  status?: TaskStatus;
}

export interface StudentTasksResponse {
  data: StudentTask[];
  error: any;
}
