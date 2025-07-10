
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dumbbell, ClipboardCheck, FileText, AlertTriangle, Wrench } from "lucide-react";
import GymHeader from "@/components/GymHeader";
import Dashboard from "@/components/Dashboard";
import DailyChecks from "@/components/DailyChecks";
import MaintenanceLog from "@/components/MaintenanceLog";
import EquipmentDashboard from "@/components/EquipmentDashboard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <GymHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-slate-200">
            <TabsTrigger 
              value="dashboard" 
              className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Dumbbell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="equipment"
              className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Wrench className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Equipment</span>
            </TabsTrigger>
            <TabsTrigger 
              value="daily-checks"
              className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <ClipboardCheck className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Daily Checks</span>
            </TabsTrigger>
            <TabsTrigger 
              value="maintenance-log"
              className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Log</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentDashboard />
          </TabsContent>

          <TabsContent value="daily-checks">
            <DailyChecks />
          </TabsContent>

          <TabsContent value="maintenance-log">
            <MaintenanceLog />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
