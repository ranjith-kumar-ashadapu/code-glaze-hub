-- Add category column to problems table
ALTER TABLE public.problems 
ADD COLUMN category TEXT;

-- Add index for better performance on category filtering
CREATE INDEX idx_problems_category ON public.problems(category);