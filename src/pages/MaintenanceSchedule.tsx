
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, Clock, Wrench, Plus, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import GymHeader from "@/components/GymHeader";
import { useEquipmentData } from "@/hooks/useEquipmentData";

interface ScheduledMaintenance {
  id: string;
  equipmentId: string;
  equipmentName: string;
  title: string;
  description: string;
  scheduledDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  status: 'scheduled' | 'completed' | 'overdue';
}

const MaintenanceSchedule = () => {
  const navigate = useNavigate();
  const { equipment } = useEquipmentData();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [scheduledMaintenance, setScheduledMaintenance] = useState<ScheduledMaintenance[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState({
    equipmentId: '',
    title: '',
    description: '',
    priority: 'medium' as const,
    assignedTo: ''
  });

  const handleAddMaintenance = () => {
    if (!selectedDate || !newMaintenance.title || !newMaintenance.equipmentId) return;

    const selectedEquipment = equipment.find(eq => eq.id === newMaintenance.equipmentId);
    if (!selectedEquipment) return;

    const maintenance: ScheduledMaintenance = {
      id: Date.now().toString(),
      equipmentId: newMaintenance.equipmentId,
      equipmentName: selectedEquipment.name,
      title: newMaintenance.title,
      description: newMaintenance.description,
      scheduledDate: selectedDate,
      priority: newMaintenance.priority,
      assignedTo: newMaintenance.assignedTo,
      status: 'scheduled'
    };

    setScheduledMaintenance([...scheduledMaintenance, maintenance]);
    setNewMaintenance({
      equipmentId: '',
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: ''
    });
    setShowAddDialog(false);
  };

  const maintenanceForSelectedDate = selectedDate 
    ? scheduledMaintenance.filter(m => 
        format(m.scheduledDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      )
    : [];

  const datesWithMaintenance = scheduledMaintenance.map(m => m.scheduledDate);

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    overdue: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <GymHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Maintenance Schedule</h1>
                <p className="text-slate-600">Plan and track equipment maintenance</p>
              </div>
            </div>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule Maintenance</DialogTitle>
                <DialogDescription>
                  Schedule maintenance for equipment on {selectedDate ? format(selectedDate, 'PPP') : 'a selected date'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="equipment">Equipment</Label>
                  <Select value={newMaintenance.equipmentId} onValueChange={(value) => 
                    setNewMaintenance({...newMaintenance, equipmentId: value})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipment.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.name} - {eq.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newMaintenance.title}
                    onChange={(e) => setNewMaintenance({...newMaintenance, title: e.target.value})}
                    placeholder="e.g., Monthly inspection"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newMaintenance.description}
                    onChange={(e) => setNewMaintenance({...newMaintenance, description: e.target.value})}
                    placeholder="Maintenance details..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newMaintenance.priority} onValueChange={(value: any) => 
                    setNewMaintenance({...newMaintenance, priority: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={newMaintenance.assignedTo}
                    onChange={(e) => setNewMaintenance({...newMaintenance, assignedTo: e.target.value})}
                    placeholder="Staff member name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMaintenance} disabled={!selectedDate || !newMaintenance.title || !newMaintenance.equipmentId}>
                  Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  Maintenance Calendar
                </CardTitle>
                <CardDescription>
                  Select a date to view or schedule maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border border-slate-200 p-3 pointer-events-auto"
                  modifiers={{
                    hasMaintenance: datesWithMaintenance
                  }}
                  modifiersStyles={{
                    hasMaintenance: {
                      backgroundColor: 'rgb(59 130 246 / 0.1)',
                      color: 'rgb(59 130 246)',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  {selectedDate ? format(selectedDate, 'PPP') : 'Select a Date'}
                </CardTitle>
                <CardDescription>
                  {maintenanceForSelectedDate.length > 0 
                    ? `${maintenanceForSelectedDate.length} scheduled maintenance${maintenanceForSelectedDate.length > 1 ? 's' : ''}`
                    : 'No maintenance scheduled'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDate ? (
                  maintenanceForSelectedDate.length > 0 ? (
                    maintenanceForSelectedDate.map((maintenance) => (
                      <div key={maintenance.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-slate-800">{maintenance.title}</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={priorityColors[maintenance.priority]}>
                              {maintenance.priority}
                            </Badge>
                            <Badge variant="outline" className={statusColors[maintenance.status]}>
                              {maintenance.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{maintenance.equipmentName}</p>
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
                    <div className="text-center py-8">
                      <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">No maintenance scheduled for this date</p>
                      <Button 
                        onClick={() => setShowAddDialog(true)}
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
                  <div className="text-center py-8">
                    <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Select a date to view scheduled maintenance</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Upcoming Maintenance</CardTitle>
                <CardDescription>Next 5 scheduled maintenance tasks</CardDescription>
              </CardHeader>
              <CardContent>
                {scheduledMaintenance.length > 0 ? (
                  <div className="space-y-3">
                    {scheduledMaintenance
                      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
                      .slice(0, 5)
                      .map((maintenance) => (
                        <div key={maintenance.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{maintenance.title}</p>
                            <p className="text-xs text-slate-600">{maintenance.equipmentName}</p>
                            <p className="text-xs text-slate-500">{format(maintenance.scheduledDate, 'MMM d, yyyy')}</p>
                          </div>
                          <Badge variant="outline" className={priorityColors[maintenance.priority]}>
                            {maintenance.priority}
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No upcoming maintenance</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MaintenanceSchedule;
