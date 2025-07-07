
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, AlertTriangle, Calendar, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettings {
  email_reports: boolean;
  maintenance_alerts: boolean;
  daily_check_reminders: boolean;
  equipment_failures: boolean;
  staff_notifications: boolean;
  low_priority_alerts: boolean;
}

const NotificationSettings = () => {
  const { gymProfile } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    email_reports: true,
    maintenance_alerts: true,
    daily_check_reminders: true,
    equipment_failures: true,
    staff_notifications: true,
    low_priority_alerts: false,
  });

  useEffect(() => {
    if (gymProfile?.id) {
      fetchNotificationSettings();
    }
  }, [gymProfile?.id]);

  const fetchNotificationSettings = async () => {
    if (!gymProfile?.id) return;

    const { data, error } = await (supabase as any)
      .from('gym_settings')
      .select('notification_settings')
      .eq('gym_id', gymProfile.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching notification settings:', error);
      return;
    }

    if (data?.notification_settings) {
      setSettings(prev => ({ ...prev, ...data.notification_settings }));
    }
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!gymProfile?.id) return;

    const { error } = await (supabase as any)
      .from('gym_settings')
      .upsert({
        gym_id: gymProfile.id,
        notification_settings: settings,
      }, { onConflict: 'gym_id' });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Notification settings saved successfully",
    });
  };

  const notificationOptions = [
    {
      key: 'email_reports' as keyof NotificationSettings,
      title: 'Email Reports',
      description: 'Receive weekly summary reports via email',
      icon: Mail,
    },
    {
      key: 'maintenance_alerts' as keyof NotificationSettings,
      title: 'Maintenance Alerts',
      description: 'Get notified when equipment requires maintenance',
      icon: AlertTriangle,
    },
    {
      key: 'daily_check_reminders' as keyof NotificationSettings,
      title: 'Daily Check Reminders',
      description: 'Daily reminders to perform equipment checks',
      icon: Calendar,
    },
    {
      key: 'equipment_failures' as keyof NotificationSettings,
      title: 'Equipment Failure Alerts',
      description: 'Immediate alerts for critical equipment failures',
      icon: AlertTriangle,
    },
    {
      key: 'staff_notifications' as keyof NotificationSettings,
      title: 'Staff Notifications',
      description: 'Notify staff about important updates and tasks',
      icon: Bell,
    },
    {
      key: 'low_priority_alerts' as keyof NotificationSettings,
      title: 'Low Priority Alerts',
      description: 'Receive notifications for minor issues and updates',
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800">
            <Bell className="w-5 h-5 mr-2" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure how and when you receive notifications about your gym
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationOptions.map(({ key, title, description, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <Label className="text-base font-medium text-slate-800">{title}</Label>
                  <p className="text-sm text-slate-600 mt-1">{description}</p>
                </div>
              </div>
              <Switch
                checked={settings[key]}
                onCheckedChange={(checked) => handleSettingChange(key, checked)}
              />
            </div>
          ))}

          <div className="pt-4 border-t border-slate-200">
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Email Preferences</CardTitle>
          <CardDescription>Additional email notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Current Email</h4>
            <p className="text-blue-700">{gymProfile?.gym_email || 'No email set'}</p>
            <p className="text-sm text-blue-600 mt-2">
              All notifications will be sent to this email address. Update your email in the Business Details section.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
