
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays, Plus, Wrench, MapPin } from "lucide-react";
import { format } from "date-fns";

interface ScheduledMaintenance {
  id: string;
  equipmentId?: string;
  equipmentName?: string;
  zone?: string;
  title: string;
  description: string;
  scheduledDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  status: 'scheduled' | 'completed' | 'overdue';
  type: 'equipment' | 'zone';
}

interface DailyMaintenanceViewProps {
  selectedDate: Date | undefined;
  maintenanceForSelectedDate: ScheduledMaintenance[];
  onScheduleClick: () => void;
  priorityColors: Record<string, string>;
  statusColors: Record<string, string>;
}

const DailyMaintenanceView = ({ 
  selectedDate, 
  maintenanceForSelectedDate, 
  onScheduleClick,
  priorityColors,
  statusColors 
}: DailyMaintenanceViewProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-green-600" />
          {selectedDate ? format(selectedDate, 'PPP') : 'Select a Date'}
        </CardTitle>
        <CardDescription className="text-sm">
          {maintenanceForSelectedDate.length > 0 
            ? `${maintenanceForSelectedDate.length} scheduled maintenance${maintenanceForSelectedDate.length > 1 ? 's' : ''}`
            : 'No maintenance scheduled'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {selectedDate ? (
          maintenanceForSelectedDate.length > 0 ? (
            maintenanceForSelectedDate.map((maintenance) => (
              <div key={maintenance.id} className="p-3 md:p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-800 text-sm md:text-base">{maintenance.title}</h4>
                  <div className="flex gap-1 md:gap-2 flex-wrap">
                    <Badge variant="outline" className={`${priorityColors[maintenance.priority]} text-xs`}>
                      {maintenance.priority}
                    </Badge>
                    <Badge variant="outline" className={`${statusColors[maintenance.status]} text-xs`}>
                      {maintenance.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {maintenance.type === 'equipment' ? (
                    <Wrench className="w-4 h-4 text-slate-500" />
                  ) : (
                    <MapPin className="w-4 h-4 text-slate-500" />
                  )}
                  <p className="text-sm text-slate-600">
                    {maintenance.type === 'equipment' ? maintenance.equipmentName : maintenance.zone}
                  </p>
                </div>
                {maintenance.description && (
                  <p className="text-sm text-slate-500 mb-2">{maintenance.description}</p>
                )}
                {maintenance.assignedTo && (
                  <p className="text-sm text-slate-600">
                    <strong>Assigned to:</strong> {maintenance.assignedTo}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 md:py-8">
              <Wrench className="w-10 md:w-12 h-10 md:h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4 text-sm md:text-base">No maintenance scheduled for this date</p>
              <Button 
                onClick={onScheduleClick}
                variant="outline" 
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Maintenance
              </Button>
            </div>
          )
        ) : (
          <div className="text-center py-6 md:py-8">
            <CalendarDays className="w-10 md:w-12 h-10 md:h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-sm md:text-base">Select a date to view scheduled maintenance</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyMaintenanceView;
