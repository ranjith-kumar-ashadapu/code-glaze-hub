-- Delete problems with NULL created_by since they're incompatible with our security model
DELETE FROM public.problems WHERE created_by IS NULL;

-- Add youtube_explanation_link to problems table
ALTER TABLE public.problems ADD COLUMN IF NOT EXISTS youtube_explanation_link TEXT;

-- Drop the foreign key constraint
ALTER TABLE public.problems DROP CONSTRAINT IF EXISTS problems_created_by_fkey;

-- Set created_by default and make it NOT NULL
ALTER TABLE public.problems ALTER COLUMN created_by SET DEFAULT auth.uid();
ALTER TABLE public.problems ALTER COLUMN created_by SET NOT NULL;

-- Re-add the foreign key constraint
ALTER TABLE public.problems 
ADD CONSTRAINT problems_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS issues)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can create problems" ON public.problems;
DROP POLICY IF EXISTS "Users can update their own problems" ON public.problems;
DROP POLICY IF EXISTS "Users can delete their own problems" ON public.problems;

-- Create admin-only policies for INSERT, UPDATE, DELETE
CREATE POLICY "Only admins can create problems" 
ON public.problems 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update problems" 
ON public.problems 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete problems" 
ON public.problems 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policies for user_roles table (only admins can manage roles)
CREATE POLICY "Only admins can view roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));