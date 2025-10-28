-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  is_read boolean NOT NULL DEFAULT false,
  related_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Create function to notify students about application status changes
CREATE OR REPLACE FUNCTION notify_student_on_status_change()
RETURNS TRIGGER AS $$
DECLARE
  student_user_id uuid;
  internship_title text;
  status_message text;
BEGIN
  -- Get the student's user_id from profiles
  SELECT p.user_id INTO student_user_id
  FROM profiles p
  WHERE p.id = NEW.student_id;

  -- Get the internship title
  SELECT i.title INTO internship_title
  FROM internships i
  WHERE i.id = NEW.internship_id;

  -- Create status-specific message
  CASE NEW.status
    WHEN 'interview' THEN
      status_message := 'Your application has been shortlisted for interview';
    WHEN 'accepted' THEN
      status_message := 'Congratulations! Your application has been accepted';
    WHEN 'rejected' THEN
      status_message := 'Your application status has been updated';
    ELSE
      status_message := 'Your application status has been updated to ' || NEW.status;
  END CASE;

  -- Only create notification if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      related_id
    ) VALUES (
      student_user_id,
      internship_title,
      status_message,
      CASE 
        WHEN NEW.status = 'accepted' THEN 'success'
        WHEN NEW.status = 'rejected' THEN 'warning'
        WHEN NEW.status = 'interview' THEN 'info'
        ELSE 'info'
      END,
      NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for application status changes
CREATE TRIGGER on_application_status_change
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_student_on_status_change();

-- Add updated_at trigger
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();