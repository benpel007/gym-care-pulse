
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DayHours {
  open: string;
  close: string;
  closed?: boolean;
}

interface OperatingHoursData {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

const OperatingHours = () => {
  const { gymProfile } = useAuth();
  const { toast } = useToast();
  const [operatingHours, setOperatingHours] = useState<OperatingHoursData>({
    monday: { open: '06:00', close: '22:00' },
    tuesday: { open: '06:00', close: '22:00' },
    wednesday: { open: '06:00', close: '22:00' },
    thursday: { open: '06:00', close: '22:00' },
    friday: { open: '06:00', close: '22:00' },
    saturday: { open: '08:00', close: '20:00' },
    sunday: { open: '08:00', close: '20:00' },
  });
  const [maintenanceInterval, setMaintenanceInterval] = useState(30);
  const [dailyCheckTime, setDailyCheckTime] = useState('09:00');

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  useEffect(() => {
    if (gymProfile?.id) {
      fetchGymSettings();
    }
  }, [gymProfile?.id]);

  const fetchGymSettings = async () => {
    if (!gymProfile?.id) return;

    const { data, error } = await (supabase as any)
      .from('gym_settings')
      .select('*')
      .eq('gym_id', gymProfile.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching gym settings:', error);
      return;
    }

    if (data) {
      if (data.operating_hours) {
        setOperatingHours(data.operating_hours);
      }
      if (data.maintenance_interval_days) {
        setMaintenanceInterval(data.maintenance_interval_days);
      }
      if (data.daily_check_reminder_time) {
        setDailyCheckTime(data.daily_check_reminder_time.substring(0, 5));
      }
    }
  };

  const handleDayChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof OperatingHoursData],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!gymProfile?.id) return;

    const settingsData = {
      gym_id: gymProfile.id,
      operating_hours: operatingHours,
      maintenance_interval_days: maintenanceInterval,
      daily_check_reminder_time: `${dailyCheckTime}:00`,
    };

    const { error } = await (supabase as any)
      .from('gym_settings')
      .upsert(settingsData, { onConflict: 'gym_id' });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Operating hours and settings saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800">
            <Clock className="w-5 h-5 mr-2" />
            Operating Hours
          </CardTitle>
          <CardDescription>Set your gym's daily operating hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {days.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <Label className="w-20 font-medium">{label}</Label>
                <Switch
                  checked={!operatingHours[key as keyof OperatingHoursData]?.closed}
                  onCheckedChange={(checked) => handleDayChange(key, 'closed', !checked)}
                />
              </div>
              
              {!operatingHours[key as keyof OperatingHoursData]?.closed && (
                <div className="flex items-center space-x-2">
                  <Input
                    type="time"
                    value={operatingHours[key as keyof OperatingHoursData]?.open || ''}
                    onChange={(e) => handleDayChange(key, 'open', e.target.value)}
                    className="w-24"
                  />
                  <span className="text-slate-500">to</span>
                  <Input
                    type="time"
                    value={operatingHours[key as keyof OperatingHoursData]?.close || ''}
                    onChange={(e) => handleDayChange(key, 'close', e.target.value)}
                    className="w-24"
                  />
                </div>
              )}
              
              {operatingHours[key as keyof OperatingHoursData]?.closed && (
                <span className="text-slate-500 font-medium">Closed</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Maintenance Settings</CardTitle>
            <CardDescription>Configure maintenance reminder intervals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maintenance_interval">Maintenance Interval (days)</Label>
              <Input
                id="maintenance_interval"
                type="number"
                value={maintenanceInterval}
                onChange={(e) => setMaintenanceInterval(parseInt(e.target.value) || 30)}
                min="1"
                max="365"
              />
              <p className="text-sm text-slate-600 mt-1">
                Equipment will be flagged for maintenance every {maintenanceInterval} days
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Daily Check Settings</CardTitle>
            <CardDescription>Set when daily check reminders are sent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="daily_check_time">Daily Check Reminder Time</Label>
              <Input
                id="daily_check_time"
                type="time"
                value={dailyCheckTime}
                onChange={(e) => setDailyCheckTime(e.target.value)}
              />
              <p className="text-sm text-slate-600 mt-1">
                Reminders will be sent at {dailyCheckTime} every day
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default OperatingHours;
