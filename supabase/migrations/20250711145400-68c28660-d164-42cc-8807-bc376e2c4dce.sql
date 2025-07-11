
-- Create the staff_members table
CREATE TABLE public.staff_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gym_id UUID NOT NULL,
  name TEXT NOT NULL,
  position TEXT,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  hire_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting staff members (gym owners can see their staff)
CREATE POLICY "Gym owners can view their staff" 
  ON public.staff_members 
  FOR SELECT 
  USING (true); -- We'll need to adjust this based on gym ownership logic

-- Create policy for inserting staff members
CREATE POLICY "Gym owners can add staff" 
  ON public.staff_members 
  FOR INSERT 
  WITH CHECK (true); -- We'll need to adjust this based on gym ownership logic

-- Create policy for updating staff members
CREATE POLICY "Gym owners can update their staff" 
  ON public.staff_members 
  FOR UPDATE 
  USING (true); -- We'll need to adjust this based on gym ownership logic

-- Create policy for deleting staff members
CREATE POLICY "Gym owners can delete their staff" 
  ON public.staff_members 
  FOR DELETE 
  USING (true); -- We'll need to adjust this based on gym ownership logic

-- Create index for better performance
CREATE INDEX idx_staff_members_gym_id ON public.staff_members(gym_id);
CREATE INDEX idx_staff_members_status ON public.staff_members(status);
