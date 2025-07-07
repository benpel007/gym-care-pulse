
-- Create gym profiles table
CREATE TABLE public.gym_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  gym_name TEXT NOT NULL,
  gym_address TEXT,
  gym_phone TEXT,
  gym_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.gym_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for gym profiles
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

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.gym_profiles (user_id, gym_name, gym_email)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'gym_name', 'New Gym'),
    new.email
  );
  RETURN new;
END;
$$;

-- Create trigger to automatically create gym profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update existing equipment and log tables to include gym_id
ALTER TABLE public.equipment ADD COLUMN gym_id UUID REFERENCES public.gym_profiles(id) ON DELETE CASCADE;
ALTER TABLE public.maintenance_logs ADD COLUMN gym_id UUID REFERENCES public.gym_profiles(id) ON DELETE CASCADE;
ALTER TABLE public.daily_checks ADD COLUMN gym_id UUID REFERENCES public.gym_profiles(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_equipment_gym_id ON public.equipment(gym_id);
CREATE INDEX idx_maintenance_logs_gym_id ON public.maintenance_logs(gym_id);
CREATE INDEX idx_daily_checks_gym_id ON public.daily_checks(gym_id);

-- Update RLS policies for equipment table
DROP POLICY IF EXISTS "Users can view all equipment" ON public.equipment;
DROP POLICY IF EXISTS "Users can create equipment" ON public.equipment;
DROP POLICY IF EXISTS "Users can update equipment" ON public.equipment;

CREATE POLICY "Users can view their gym's equipment" 
  ON public.equipment 
  FOR SELECT 
  USING (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create equipment for their gym" 
  ON public.equipment 
  FOR INSERT 
  WITH CHECK (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their gym's equipment" 
  ON public.equipment 
  FOR UPDATE 
  USING (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

-- Update RLS policies for maintenance_logs table
DROP POLICY IF EXISTS "Users can view all logs" ON public.maintenance_logs;
DROP POLICY IF EXISTS "Users can create logs" ON public.maintenance_logs;
DROP POLICY IF EXISTS "Users can update logs" ON public.maintenance_logs;

CREATE POLICY "Users can view their gym's logs" 
  ON public.maintenance_logs 
  FOR SELECT 
  USING (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create logs for their gym" 
  ON public.maintenance_logs 
  FOR INSERT 
  WITH CHECK (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their gym's logs" 
  ON public.maintenance_logs 
  FOR UPDATE 
  USING (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

-- Update RLS policies for daily_checks table
DROP POLICY IF EXISTS "Users can view all checks" ON public.daily_checks;
DROP POLICY IF EXISTS "Users can create checks" ON public.daily_checks;
DROP POLICY IF EXISTS "Users can update checks" ON public.daily_checks;

CREATE POLICY "Users can view their gym's checks" 
  ON public.daily_checks 
  FOR SELECT 
  USING (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create checks for their gym" 
  ON public.daily_checks 
  FOR INSERT 
  WITH CHECK (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their gym's checks" 
  ON public.daily_checks 
  FOR UPDATE 
  USING (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));
