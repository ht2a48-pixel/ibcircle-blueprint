-- Teacher reports table: stores reports submitted by teachers via the admin passcode
CREATE TABLE public.teacher_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_name TEXT,
  student_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  topics_covered TEXT NOT NULL,
  class_date DATE NOT NULL,
  class_time TIME NOT NULL,
  class_length_minutes INTEGER NOT NULL CHECK (class_length_minutes > 0 AND class_length_minutes <= 600),
  report_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.teacher_reports ENABLE ROW LEVEL SECURITY;

-- Lock down all direct access; the edge function (service role) is the only writer/reader.
-- No policies = no access for anon/authenticated roles. Service role bypasses RLS.
CREATE INDEX idx_teacher_reports_created_at ON public.teacher_reports (created_at DESC);
CREATE INDEX idx_teacher_reports_class_date ON public.teacher_reports (class_date DESC);