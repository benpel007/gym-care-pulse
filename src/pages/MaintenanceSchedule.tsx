
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
import { CalendarDays, Clock, Wrench, Plus, ArrowLeft, MapPin } from "lucide-react";
import { format } from "date-fns";
import GymHeader from "@/components/GymHeader";
import { useEquipmentData } from "@/hooks/useEquipmentData";

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

const zones = [
  'Cardio Area',
  'Weight Training',
  'Free Weights',
  'Locker Rooms',
  'Reception',
  'Group Exercise',
  'Pool Area',
  'Sauna/Steam'
];

const MaintenanceSchedule = () => {
  const navigate = useNavigate();
  const { equipment } = useEquipmentData();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [scheduledMaintenance, setScheduledMaintenance] = useState<ScheduledMaintenance[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [schedulingType, setSchedulingType] = useState<'equipment' | 'zone'>('equipment');
  const [newMaintenance, setNewMaintenance] = useState({
    equipmentId: '',
    zone: '',
    title: '',
    description: '',
    priority: 'medium' as const,
    assignedTo: ''
  });

  const handleAddMaintenance = () => {
    if (!selectedDate || !newMaintenance.title) return;
    
    if (schedulingType === 'equipment' && !newMaintenance.equipmentId) return;
    if (schedulingType === 'zone' && !newMaintenance.zone) return;

    let maintenance: ScheduledMaintenance;

    if (schedulingType === 'equipment') {
      const selectedEquipment = equipment.find(eq => eq.id === newMaintenance.equipmentId);
      if (!selectedEquipment) return;

      maintenance = {
        id: Date.now().toString(),
        equipmentId: newMaintenance.equipmentId,
        equipmentName: selectedEquipment.name,
        title: newMaintenance.title,
        description: newMaintenance.description,
        scheduledDate: selectedDate,
        priority: newMaintenance.priority,
        assignedTo: newMaintenance.assignedTo,
        status: 'scheduled',
        type: 'equipment'
      };
    } else {
      maintenance = {
        id: Date.now().toString(),
        zone: newMaintenance.zone,
        title: newMaintenance.title,
        description: newMaintenance.description,
        scheduledDate: selectedDate,
        priority: newMaintenance.priority,
        assignedTo: newMaintenance.assignedTo,
        status: 'scheduled',
        type: 'zone'
      };
    }

    setScheduledMaintenance([...scheduledMaintenance, maintenance]);
    setNewMaintenance({
      equipmentId: '',
      zone: '',
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

      <main className="container mx-auto px-4 py-4 md:py-6">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Maintenance Schedule</h1>
                  <p className="text-slate-600 text-sm md:text-base">Plan and track equipment maintenance</p>
                </div>
              </div>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Maintenance
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] mx-4">
                <DialogHeader>
                  <DialogTitle>Schedule Maintenance</DialogTitle>
                  <DialogDescription>
                    Schedule maintenance for {selectedDate ? format(selectedDate, 'PPP') : 'a selected date'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Maintenance Type</Label>
                    <Select value={schedulingType} onValueChange={(value: 'equipment' | 'zone') => {
                      setSchedulingType(value);
                      setNewMaintenance({...newMaintenance, equipmentId: '', zone: ''});
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equipment">Equipment Specific</SelectItem>
                        <SelectItem value="zone">Zone/Area</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {schedulingType === 'equipment' ? (
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
                  ) : (
                    <div className="grid gap-2">
                      <Label htmlFor="zone">Zone/Area</Label>
                      <Select value={newMaintenance.zone} onValueChange={(value) => 
                        setNewMaintenance({...newMaintenance, zone: value})
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select zone" />
                        </SelectTrigger>
                        <SelectContent>
                          {zones.map((zone) => (
                            <SelectItem key={zone} value={zone}>
                              {zone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
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
                  <Button 
                    onClick={handleAddMaintenance} 
                    disabled={
                      !selectedDate || 
                      !newMaintenance.title || 
                      (schedulingType === 'equipment' && !newMaintenance.equipmentId) ||
                      (schedulingType === 'zone' && !newMaintenance.zone)
                    }
                  >
                    Schedule
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  Maintenance Calendar
                </CardTitle>
                <CardDescription className="text-sm">
                  Select a date to view or schedule maintenance
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <div className="overflow-x-auto">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-slate-200 p-1 sm:p-3 pointer-events-auto w-full min-w-[280px]"
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
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
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
                  <div className="text-center py-6 md:py-8">
                    <CalendarDays className="w-10 md:w-12 h-10 md:h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-sm md:text-base">Select a date to view scheduled maintenance</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-800 text-lg">Upcoming Maintenance</CardTitle>
                <CardDescription className="text-sm">Next 5 scheduled maintenance tasks</CardDescription>
              </CardHeader>
              <CardContent>
                {scheduledMaintenance.length > 0 ? (
                  <div className="space-y-2 md:space-y-3">
                    {scheduledMaintenance
                      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
                      .slice(0, 5)
                      .map((maintenance) => (
                        <div key={maintenance.id} className="flex items-center justify-between p-2 md:p-3 bg-slate-50 rounded border border-slate-200">
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
