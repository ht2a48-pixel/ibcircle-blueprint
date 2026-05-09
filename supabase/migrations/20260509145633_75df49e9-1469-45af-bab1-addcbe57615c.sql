ALTER TABLE public.teacher_reports
  ADD COLUMN IF NOT EXISTS planned_total_minutes integer,
  ADD COLUMN IF NOT EXISTS planned_total_classes integer;