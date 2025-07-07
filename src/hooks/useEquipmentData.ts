
import { useState, useEffect } from 'react';
import { Equipment } from '@/types';

export const useEquipmentData = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('gym-equipment');
    if (stored) {
      setEquipment(JSON.parse(stored));
    }
    // No initial dummy data - users start with empty equipment list
  }, []);

  const saveEquipment = (newEquipment: Equipment[]) => {
    setEquipment(newEquipment);
    localStorage.setItem('gym-equipment', JSON.stringify(newEquipment));
  };

  const addEquipment = (newItem: Equipment) => {
    const updated = [...equipment, newItem];
    saveEquipment(updated);
  };

  const updateEquipment = (updatedItem: Equipment) => {
    const updated = equipment.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    saveEquipment(updated);
  };

  const deleteEquipment = (id: string) => {
    const updated = equipment.filter(item => item.id !== id);
    saveEquipment(updated);
  };

  return {
    equipment,
    addEquipment,
    updateEquipment,
    deleteEquipment
  };
};
