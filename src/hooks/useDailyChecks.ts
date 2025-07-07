
import { useState, useEffect } from 'react';
import { ChecklistItem } from '@/types';
import { useMaintenanceLog } from './useMaintenanceLog';

export const useDailyChecks = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const { addLogEntry } = useMaintenanceLog();

  useEffect(() => {
    const stored = localStorage.getItem('daily-checklist');
    if (stored) {
      setChecklistItems(JSON.parse(stored));
    }
    // No initial dummy data - users start with empty checklist
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
