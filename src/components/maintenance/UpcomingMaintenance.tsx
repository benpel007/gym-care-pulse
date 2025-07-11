
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Wrench, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

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

interface UpcomingMaintenanceProps {
  scheduledMaintenance: ScheduledMaintenance[];
  priorityColors: Record<string, string>;
}

const UpcomingMaintenance = ({ scheduledMaintenance, priorityColors }: UpcomingMaintenanceProps) => {
  const navigate = useNavigate();

  const handleTaskClick = (task: ScheduledMaintenance) => {
    const dateParam = format(task.scheduledDate, 'yyyy-MM-dd');
    navigate(`/maintenance-check/${dateParam}`);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-800 text-lg">This Week's Tasks</CardTitle>
        <CardDescription className="text-sm">Upcoming maintenance for the next 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {scheduledMaintenance.length > 0 ? (
          <div className="space-y-2 md:space-y-3">
            {scheduledMaintenance
              .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
              .slice(0, 5)
              .map((maintenance) => (
                <div 
                  key={maintenance.id} 
                  className="flex items-center justify-between p-2 md:p-3 bg-slate-50 rounded border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleTaskClick(maintenance)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">{maintenance.title}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      {maintenance.type === 'equipment' ? (
                        <Wrench className="w-3 h-3" />
                      ) : (
                        <MapPin className="w-3 h-3" />
                      )}
                      <span className="truncate">
                        {maintenance.type === 'equipment' ? maintenance.equipmentName : maintenance.zone}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{format(maintenance.scheduledDate, 'MMM d, yyyy')}</p>
                  </div>
                  <Badge variant="outline" className={`${priorityColors[maintenance.priority]} text-xs ml-2 flex-shrink-0`}>
                    {maintenance.priority}
                  </Badge>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-4 md:py-6">
            <Clock className="w-6 md:w-8 h-6 md:h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No maintenance scheduled this week</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingMaintenance;
