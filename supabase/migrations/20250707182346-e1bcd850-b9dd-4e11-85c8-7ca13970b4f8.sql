
-- Create a staff_members table
CREATE TABLE public.staff_members (
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

-- Create a gym_settings table for additional settings
CREATE TABLE public.gym_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gym_id UUID NOT NULL,
  operating_hours JSONB DEFAULT '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}, "wednesday": {"open": "06:00", "close": "22:00"}, "thursday": {"open": "06:00", "close": "22:00"}, "friday": {"open": "06:00", "close": "22:00"}, "saturday": {"open": "08:00", "close": "20:00"}, "sunday": {"open": "08:00", "close": "20:00"}}',
  maintenance_interval_days INTEGER DEFAULT 30,
  daily_check_reminder_time TIME DEFAULT '09:00:00',
  emergency_contact TEXT,
  insurance_info JSONB,
  license_info JSONB,
  notification_settings JSONB DEFAULT '{"email_reports": true, "maintenance_alerts": true, "daily_check_reminders": true}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(gym_id)
);

-- Add RLS to gym_settings
ALTER TABLE public.gym_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for gym_settings
CREATE POLICY "Gym owners can view their settings" 
  ON public.gym_settings 
  FOR SELECT 
  USING (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Gym owners can create their settings" 
  ON public.gym_settings 
  FOR INSERT 
  WITH CHECK (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Gym owners can update their settings" 
  ON public.gym_settings 
  FOR UPDATE 
  USING (gym_id IN (SELECT id FROM public.gym_profiles WHERE user_id = auth.uid()));

-- Create function to initialize gym settings when gym profile is created
CREATE OR REPLACE FUNCTION public.initialize_gym_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.gym_settings (gym_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create settings when gym profile is created
CREATE TRIGGER on_gym_profile_created
  AFTER INSERT ON public.gym_profiles
  FOR EACH ROW EXECUTE FUNCTION public.initialize_gym_settings();
