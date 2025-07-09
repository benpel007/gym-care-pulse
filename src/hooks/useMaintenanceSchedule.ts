
import { useState } from 'react';

export interface ScheduledMaintenance {
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

export const useMaintenanceSchedule = () => {
  const [scheduledMaintenance, setScheduledMaintenance] = useState<ScheduledMaintenance[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
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

  const addMaintenance = (maintenance: ScheduledMaintenance) => {
    setScheduledMaintenance([...scheduledMaintenance, maintenance]);
  };

  const resetForm = () => {
    setNewMaintenance({
      equipmentId: '',
      zone: '',
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: ''
    });
  };

  return {
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
  };
};
