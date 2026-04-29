CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.teacher_report_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_name TEXT,
  student_name TEXT,
  subject TEXT,
  class_date DATE,
  class_time TIME,
  class_length_minutes INTEGER,
  classes_completed INTEGER,
  topics_covered TEXT,
  report_text TEXT,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teacher_report_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny all client access to teacher_report_drafts"
ON public.teacher_report_drafts
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "No client access to teacher_report_drafts"
ON public.teacher_report_drafts
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE INDEX idx_teacher_report_drafts_updated_at
ON public.teacher_report_drafts (updated_at DESC);

CREATE TRIGGER update_teacher_report_drafts_updated_at
BEFORE UPDATE ON public.teacher_report_drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();