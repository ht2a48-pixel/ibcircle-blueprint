-- Fix user_roles RLS policies from RESTRICTIVE to PERMISSIVE
-- The current RESTRICTIVE policies make the table completely inaccessible

-- Drop existing RESTRICTIVE policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Create PERMISSIVE policies (correct approach)
-- PERMISSIVE policies are OR'd together - any one grants access

CREATE POLICY "Users can view their own roles"
ON public.user_roles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
AS PERMISSIVE
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));