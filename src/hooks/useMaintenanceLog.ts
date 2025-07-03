
import { useState, useEffect } from 'react';
import { LogEntry } from '@/types';

export const useMaintenanceLog = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('maintenance-log');
    if (stored) {
      setLogEntries(JSON.parse(stored));
    }
  }, []);

  const saveLogEntries = (entries: LogEntry[]) => {
    setLogEntries(entries);
    localStorage.setItem('maintenance-log', JSON.stringify(entries));
  };

  const addLogEntry = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newEntry: LogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    const updated = [newEntry, ...logEntries];
    saveLogEntries(updated);
    return newEntry;
  };

  const updateLogEntry = (updatedEntry: LogEntry) => {
    const updated = logEntries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    saveLogEntries(updated);
  };

  return {
    logEntries,
    addLogEntry,
    updateLogEntry
  };
};
