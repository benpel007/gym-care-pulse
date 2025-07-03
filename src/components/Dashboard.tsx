
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Clock, Wrench, TrendingUp } from "lucide-react";
import { useEquipmentData } from "@/hooks/useEquipmentData";
import { useDailyChecks } from "@/hooks/useDailyChecks";

const Dashboard = () => {
  const { equipment } = useEquipmentData();
  const { checklistItems } = useDailyChecks();

  const operationalCount = equipment.filter(eq => eq.status === 'operational').length;
  const overdueCount = equipment.filter(eq => new Date(eq.nextDue) < new Date()).length;
  const activeIssues = equipment.reduce((sum, eq) => sum + eq.issueCount, 0);
  const completedToday = checklistItems.filter(item => 
    item.completed && 
    item.completedAt && 
    new Date(item.completedAt).toDateString() === new Date().toDateString()
  ).length;

  const stats = [
    {
      title: "Equipment Operational",
      value: operationalCount,
      total: equipment.length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200"
    },
    {
      title: "Overdue Checks",
      value: overdueCount,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-200"
    },
    {
      title: "Active Issues",
      value: activeIssues,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200"
    },
    {
      title: "Completed Today",
      value: completedToday,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome to FitMaintain</h2>
        <p className="text-slate-600 font-medium">Keep your gym equipment in perfect condition</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`${stat.bgColor} border-2 hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {stat.value}
                  {stat.total && <span className="text-sm text-slate-600 ml-1">/ {stat.total}</span>}
                </div>
                {stat.total && (
                  <div className="w-full bg-white/60 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        stat.color === 'text-green-600' ? 'bg-green-500' :
                        stat.color === 'text-orange-600' ? 'bg-orange-500' :
                        stat.color === 'text-red-600' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(stat.value / stat.total) * 100}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-600">Latest maintenance activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {equipment.slice(0, 5).map((eq) => (
              <div key={eq.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="font-medium text-slate-800">{eq.name}</p>
                  <p className="text-sm text-slate-600">{eq.location}</p>
                </div>
                <Badge variant="outline" className={
                  eq.status === 'operational' ? 'border-green-200 text-green-800' :
                  eq.status === 'maintenance' ? 'border-yellow-200 text-yellow-800' :
                  'border-red-200 text-red-800'
                }>
                  {eq.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Today's Progress
            </CardTitle>
            <CardDescription className="text-slate-600">Daily checklist completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-slate-800">
                  {Math.round((completedToday / Math.max(checklistItems.length, 1)) * 100)}%
                </span>
                <span className="text-sm text-slate-600">
                  {completedToday} of {checklistItems.length} tasks
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(completedToday / Math.max(checklistItems.length, 1)) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-bold text-green-800">{completedToday}</div>
                  <div className="text-green-600">Completed</div>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800">{checklistItems.length - completedToday}</div>
                  <div className="text-slate-600">Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
