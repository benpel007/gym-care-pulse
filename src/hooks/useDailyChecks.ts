
import { useState, useEffect } from 'react';
import { ChecklistItem } from '@/types';
import { useMaintenanceLog } from './useMaintenanceLog';

export const useDailyChecks = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { addLogEntry } = useMaintenanceLog();

  useEffect(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('daily-checklist');
      if (stored) {
        setChecklistItems(JSON.parse(stored));
      }
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
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

  const toggleCheck = async (check: ChecklistItem) => {
    const updatedCheck = {
      ...check,
      completed: !check.completed,
      completedBy: check.completed ? undefined : 'User',
      completedAt: check.completed ? undefined : new Date().toISOString()
    };
    updateChecklistItem(updatedCheck);
  };

  const updateNotes = async (check: ChecklistItem, notes: string) => {
    const updatedCheck = {
      ...check,
      notes: notes
    };
    updateChecklistItem(updatedCheck);
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
    checks: checklistItems,
    loading,
    error,
    toggleCheck,
    updateNotes,
    checklistItems,
    updateChecklistItem,
    addChecklistItem,
    completeAllItems
  };
};
