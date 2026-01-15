-- Fix has_role function to include internal access checks
-- Prevents unauthorized role enumeration by restricting who can check roles

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow checking own role or if caller is admin
  IF auth.uid() IS NULL THEN
    RETURN FALSE;  -- No authenticated user
  END IF;
  
  IF auth.uid() != _user_id THEN
    -- Check if caller is admin (recursive protection: direct query, not function call)
    IF NOT EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    ) THEN
      RETURN FALSE;  -- Unauthorized check returns false instead of error
    END IF;
  END IF;
  
  -- Perform the role check
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;