
import { useState, useEffect } from 'react';

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

  // Load maintenance data from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem('scheduled-maintenance');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert string dates back to Date objects
        const withDates = parsed.map((item: any) => ({
          ...item,
          scheduledDate: new Date(item.scheduledDate)
        }));
        setScheduledMaintenance(withDates);
      } catch (error) {
        console.error('Error loading scheduled maintenance:', error);
      }
    }
  }, []);

  // Save to localStorage whenever scheduledMaintenance changes
  const saveScheduledMaintenance = (maintenance: ScheduledMaintenance[]) => {
    setScheduledMaintenance(maintenance);
    localStorage.setItem('scheduled-maintenance', JSON.stringify(maintenance));
  };

  const addMaintenance = (maintenance: ScheduledMaintenance) => {
    const updated = [...scheduledMaintenance, maintenance];
    saveScheduledMaintenance(updated);
  };

  const updateMaintenanceStatus = (id: string, status: ScheduledMaintenance['status']) => {
    const updated = scheduledMaintenance.map(item => 
      item.id === id ? { ...item, status } : item
    );
    saveScheduledMaintenance(updated);
  };

  const deleteMaintenance = (id: string) => {
    const updated = scheduledMaintenance.filter(item => item.id !== id);
    saveScheduledMaintenance(updated);
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
    updateMaintenanceStatus,
    deleteMaintenance,
    resetForm
  };
};
