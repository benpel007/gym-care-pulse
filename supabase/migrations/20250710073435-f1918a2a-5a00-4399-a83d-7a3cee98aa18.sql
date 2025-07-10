
-- Create the staff_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.staff_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gym_id UUID NOT NULL,
  name TEXT NOT NULL,
  position TEXT,
  email TEXT,
  phone TEXT,
  hire_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS to staff_members
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

-- Create policies for staff_members (gym owners can manage their staff)
CREATE POLICY "Gym owners can view their staff" 
  ON public.staff_members 
  FOR SELECT 
  USING (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Gym owners can create staff" 
  ON public.staff_members 
  FOR INSERT 
  WITH CHECK (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Gym owners can update their staff" 
  ON public.staff_members 
  FOR UPDATE 
  USING (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Gym owners can delete their staff" 
  ON public.staff_members 
  FOR DELETE 
  USING (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

-- Also ensure gym_profiles table exists
CREATE TABLE IF NOT EXISTS public.gym_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gym_name TEXT NOT NULL,
  gym_address TEXT,
  gym_phone TEXT,
  gym_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Add RLS to gym_profiles
ALTER TABLE public.gym_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for gym_profiles
CREATE POLICY "Users can view their own gym profile" 
  ON public.gym_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own gym profile" 
  ON public.gym_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gym profile" 
  ON public.gym_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to create gym profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.gym_profiles (user_id, gym_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'gym_name', 'My Gym'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create gym profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
