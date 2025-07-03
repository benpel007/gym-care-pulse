
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dumbbell, ClipboardCheck, FileText, AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import DailyChecks from "@/components/DailyChecks";
import MaintenanceLog from "@/components/MaintenanceLog";
import EquipmentDashboard from "@/components/EquipmentDashboard";
import IssueReportModal from "@/components/IssueReportModal";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showIssueModal, setShowIssueModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">FitMaintain</h1>
                <p className="text-sm text-slate-600 font-medium">Gym Equipment Maintenance System</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowIssueModal(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </div>
      </header>

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

      <IssueReportModal 
        isOpen={showIssueModal} 
        onClose={() => setShowIssueModal(false)} 
      />
    </div>
  );
};

export default Index;
