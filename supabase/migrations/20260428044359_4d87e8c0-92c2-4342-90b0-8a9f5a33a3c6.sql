ALTER TABLE public.teacher_reports
ADD COLUMN classes_completed INTEGER CHECK (classes_completed IS NULL OR (classes_completed >= 0 AND classes_completed <= 10000));