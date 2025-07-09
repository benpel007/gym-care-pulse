
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import GymHeader from "@/components/GymHeader";
import { useEquipmentData } from "@/hooks/useEquipmentData";
import { useMaintenanceSchedule } from "@/hooks/useMaintenanceSchedule";
import MaintenanceCalendar from "@/components/maintenance/MaintenanceCalendar";
import MaintenanceDialog from "@/components/maintenance/MaintenanceDialog";
import DailyMaintenanceView from "@/components/maintenance/DailyMaintenanceView";
import UpcomingMaintenance from "@/components/maintenance/UpcomingMaintenance";

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
  const {
    scheduledMaintenance,
    selectedDate,
    setSelectedDate,
    showAddDialog,
    setShowAddDialog,
    schedulingType,
    setSchedulingType,
    newMaintenance,
    setNewMaintenance,
    addMaintenance,
    resetForm
  } = useMaintenanceSchedule();

  const handleAddMaintenance = () => {
    if (!selectedDate || !newMaintenance.title) return;
    
    if (schedulingType === 'equipment' && !newMaintenance.equipmentId) return;
    if (schedulingType === 'zone' && !newMaintenance.zone) return;

    let maintenance;

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
        status: 'scheduled' as const,
        type: 'equipment' as const
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
        status: 'scheduled' as const,
        type: 'zone' as const
      };
    }

    addMaintenance(maintenance);
    resetForm();
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
            <MaintenanceDialog
              open={showAddDialog}
              onOpenChange={setShowAddDialog}
              selectedDate={selectedDate}
              schedulingType={schedulingType}
              onSchedulingTypeChange={setSchedulingType}
              newMaintenance={newMaintenance}
              onMaintenanceChange={setNewMaintenance}
              onAddMaintenance={handleAddMaintenance}
              equipment={equipment}
              zones={zones}
            />
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <MaintenanceCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              datesWithMaintenance={datesWithMaintenance}
            />
          </div>

          <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
            <DailyMaintenanceView
              selectedDate={selectedDate}
              maintenanceForSelectedDate={maintenanceForSelectedDate}
              onScheduleClick={() => setShowAddDialog(true)}
              priorityColors={priorityColors}
              statusColors={statusColors}
            />

            <UpcomingMaintenance
              scheduledMaintenance={scheduledMaintenance}
              priorityColors={priorityColors}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MaintenanceSchedule;
