-- Restrictive default-deny policy on teacher_reports for all client roles.
-- Service role used by edge functions bypasses RLS, so backend access is unaffected.
CREATE POLICY "Deny all client access to teacher_reports"
ON public.teacher_reports
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Also add a permissive policy so the restrictive policy framework is complete
CREATE POLICY "No client access to teacher_reports"
ON public.teacher_reports
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Lock down has_role: only allow backend (service_role / postgres) to execute
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;