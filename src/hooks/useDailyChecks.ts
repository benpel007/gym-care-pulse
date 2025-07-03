
import { useState, useEffect } from 'react';
import { ChecklistItem } from '@/types';
import { useMaintenanceLog } from './useMaintenanceLog';

const initialChecklistItems: ChecklistItem[] = [
  // Safety Checks
  { id: '1', category: 'safety', task: 'Verify emergency exits are clear and accessible', priority: 'high', completed: false },
  { id: '2', category: 'safety', task: 'Check first aid kits are fully stocked', priority: 'high', completed: false },
  { id: '3', category: 'safety', task: 'Test emergency lighting systems', priority: 'medium', completed: false },
  { id: '4', category: 'safety', task: 'Check fire extinguisher locations and accessibility', priority: 'high', completed: false },
  
  // Cleanliness Checks
  { id: '5', category: 'cleanliness', task: 'Sanitize all high-touch surfaces (door handles, handrails)', priority: 'high', completed: false },
  { id: '6', category: 'cleanliness', task: 'Clean and disinfect all equipment surfaces', priority: 'high', completed: false },
  { id: '7', category: 'cleanliness', task: 'Empty trash bins and replace liners', priority: 'medium', completed: false },
  { id: '8', category: 'cleanliness', task: 'Mop and sanitize locker room floors', priority: 'medium', completed: false },
  { id: '9', category: 'cleanliness', task: 'Restock hand sanitizer stations', priority: 'medium', completed: false },

  // Equipment Checks
  { id: '10', category: 'equipment', task: 'Check all cardio machine power connections', priority: 'medium', completed: false },
  { id: '11', category: 'equipment', task: 'Inspect weight machine cables and pulleys', priority: 'high', completed: false },
  { id: '12', category: 'equipment', task: 'Test emergency stop buttons on treadmills', priority: 'high', completed: false },
  { id: '13', category: 'equipment', task: 'Verify proper weight plate organization', priority: 'low', completed: false },

  // Facility Checks
  { id: '14', category: 'facility', task: 'Check all lighting systems are functioning', priority: 'medium', completed: false },
  { id: '15', category: 'facility', task: 'Inspect changing room facilities', priority: 'medium', completed: false },
  { id: '16', category: 'facility', task: 'Test HVAC system and air circulation', priority: 'medium', completed: false },
  { id: '17', category: 'facility', task: 'Check water fountain functionality', priority: 'low', completed: false },
  { id: '18', category: 'facility', task: 'Verify security system is operational', priority: 'high', completed: false }
];

export const useDailyChecks = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const { addLogEntry } = useMaintenanceLog();

  useEffect(() => {
    const stored = localStorage.getItem('daily-checklist');
    if (stored) {
      setChecklistItems(JSON.parse(stored));
    } else {
      setChecklistItems(initialChecklistItems);
      localStorage.setItem('daily-checklist', JSON.stringify(initialChecklistItems));
    }
  }, []);

  const saveChecklistItems = (items: ChecklistItem[]) => {
    setChecklistItems(items);
    localStorage.setItem('daily-checklist', JSON.stringify(items));
  };

  const updateChecklistItem = (updatedItem: ChecklistItem) => {
    const updated = checklistItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    saveChecklistItems(updated);

    // Log the completion if item was just completed
    if (updatedItem.completed && updatedItem.completedBy) {
      addLogEntry({
        type: 'daily-check',
        description: `Daily check completed: ${updatedItem.task}`,
        staff: updatedItem.completedBy,
        priority: updatedItem.priority,
        status: 'completed'
      });
    }
  };

  const addChecklistItem = (newItem: ChecklistItem) => {
    const updated = [...checklistItems, newItem];
    saveChecklistItems(updated);
  };

  const completeAllItems = (staff: string) => {
    const updated = checklistItems.map(item => ({
      ...item,
      completed: true,
      completedBy: staff,
      completedAt: new Date().toISOString()
    }));
    saveChecklistItems(updated);

    // Log the bulk completion
    addLogEntry({
      type: 'daily-check',
      description: `All daily checklist items completed (${checklistItems.length} tasks)`,
      staff: staff,
      status: 'completed'
    });
  };

  return {
    checklistItems,
    updateChecklistItem,
    addChecklistItem,
    completeAllItems
  };
};
