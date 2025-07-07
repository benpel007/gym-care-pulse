
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GymHeader from "@/components/GymHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SettingsIcon as Settings, Users, Building, Bell, X } from "lucide-react";
import StaffManagement from "@/components/settings/StaffManagement";
import BusinessDetails from "@/components/settings/BusinessDetails";
import NotificationSettings from "@/components/settings/NotificationSettings";

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <GymHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
            <p className="text-slate-600">Manage your gym's information, staff, and preferences</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="flex items-center gap-2 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </Button>
        </div>

        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-slate-200">
            <TabsTrigger 
              value="business" 
              className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Building className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Business</span>
            </TabsTrigger>
            <TabsTrigger 
              value="staff"
              className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Staff</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="business">
            <BusinessDetails />
          </TabsContent>

          <TabsContent value="staff">
            <StaffManagement />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsPage;
