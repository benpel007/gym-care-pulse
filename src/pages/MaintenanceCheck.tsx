
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, CheckCircle, Wrench, MapPin } from "lucide-react";
import { format } from "date-fns";
import GymHeader from "@/components/GymHeader";
import { useMaintenanceSchedule } from "@/hooks/useMaintenanceSchedule";
import { useMaintenanceLog } from "@/hooks/useMaintenanceLog";
import { toast } from "sonner";

const MaintenanceCheck = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { scheduledMaintenance, updateMaintenanceStatus } = useMaintenanceSchedule();
  const { addLogEntry } = useMaintenanceLog();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  if (!date) {
    navigate('/');
    return null;
  }

  const checkDate = new Date(date);
  const maintenanceForDate = scheduledMaintenance.filter(m => 
    format(m.scheduledDate, 'yyyy-MM-dd') === format(checkDate, 'yyyy-MM-dd') && 
    m.status === 'scheduled'
  );

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200'
  };

  const handleTaskToggle = (taskId: string, isCompleted: boolean) => {
    if (isCompleted) {
      setCompletedTasks(prev => new Set([...prev, taskId]));
    } else {
      setCompletedTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleNotesChange = (taskId: string, noteValue: string) => {
    setNotes(prev => ({ ...prev, [taskId]: noteValue }));
  };

  const handleCompleteAllChecked = () => {
    if (completedTasks.size === 0) {
      toast.error("Please select at least one task to complete");
      return;
    }

    completedTasks.forEach(taskId => {
      const task = maintenanceForDate.find(t => t.id === taskId);
      if (task) {
        // Update maintenance status
        updateMaintenanceStatus(taskId, 'completed');
        
        // Add log entry
        addLogEntry({
          type: 'maintenance',
          equipmentId: task.equipmentId,
          equipmentName: task.equipmentName,
          description: `Completed: ${task.title}${notes[taskId] ? ` - ${notes[taskId]}` : ''}`,
          staff: 'Current User',
          priority: task.priority,
          status: 'completed'
        });
      }
    });

    toast.success(`${completedTasks.size} maintenance task${completedTasks.size === 1 ? '' : 's'} completed and logged`);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <GymHeader />

      <main className="container mx-auto px-4 py-4 md:py-6">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Maintenance Check
              </h1>
              <p className="text-slate-600 text-sm md:text-base">
                {format(checkDate, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>

        {maintenanceForDate.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardContent className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No maintenance tasks scheduled for this date</p>
              <Button onClick={() => navigate('/')} variant="outline">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Scheduled Maintenance Tasks</CardTitle>
                <CardDescription>
                  {maintenanceForDate.length} task{maintenanceForDate.length === 1 ? '' : 's'} scheduled for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceForDate.map((task) => (
                    <div key={task.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={task.id}
                          checked={completedTasks.has(task.id)}
                          onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-slate-800">{task.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                {task.type === 'equipment' ? (
                                  <Wrench className="w-4 h-4 text-slate-500" />
                                ) : (
                                  <MapPin className="w-4 h-4 text-slate-500" />
                                )}
                                <span className="text-sm text-slate-600">
                                  {task.type === 'equipment' ? task.equipmentName : task.zone}
                                </span>
                              </div>
                              {task.description && (
                                <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                              )}
                              {task.assignedTo && (
                                <p className="text-sm text-slate-600 mt-1">
                                  <strong>Assigned to:</strong> {task.assignedTo}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline" className={`${priorityColors[task.priority]} text-xs`}>
                              {task.priority}
                            </Badge>
                          </div>
                          
                          <div>
                            <label htmlFor={`notes-${task.id}`} className="text-sm font-medium text-slate-700 block mb-1">
                              Notes (optional)
                            </label>
                            <Textarea
                              id={`notes-${task.id}`}
                              placeholder="Add any notes about this maintenance task..."
                              value={notes[task.id] || ''}
                              onChange={(e) => handleNotesChange(task.id, e.target.value)}
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button 
                onClick={handleCompleteAllChecked}
                disabled={completedTasks.size === 0}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Selected Tasks ({completedTasks.size})
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MaintenanceCheck;
