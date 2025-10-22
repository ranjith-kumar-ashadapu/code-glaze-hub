-- Create problems table for storing coding challenges
CREATE TABLE public.problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  solution TEXT NOT NULL,
  explanation TEXT NOT NULL,
  reference_link TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Public can view all problems
CREATE POLICY "Anyone can view problems" 
ON public.problems 
FOR SELECT 
USING (true);

-- Only authenticated users can create problems
CREATE POLICY "Authenticated users can create problems" 
ON public.problems 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own problems
CREATE POLICY "Users can update their own problems" 
ON public.problems 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Users can delete their own problems
CREATE POLICY "Users can delete their own problems" 
ON public.problems 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_problems_updated_at
BEFORE UPDATE ON public.problems
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create index for faster queries
CREATE INDEX idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX idx_problems_created_at ON public.problems(created_at DESC);