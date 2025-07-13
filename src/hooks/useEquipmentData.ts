
import { useState, useEffect } from 'react';
import { Equipment } from '@/types';

const generateInitialEquipment = (): Equipment[] => {
  const equipment: Equipment[] = [];
  let idCounter = 1;

  // Cardio Equipment
  const cardioEquipment = [
    { name: 'Bikes', quantity: 3 },
    { name: 'Arc trainer', quantity: 2 },
    { name: 'Cross trainer', quantity: 1 },
    { name: 'Treadmill', quantity: 3 },
    { name: 'Stair master', quantity: 1 },
    { name: 'Rowing machine', quantity: 1 },
    { name: 'Skierg', quantity: 1 },
    { name: 'Air bike', quantity: 1 }
  ];

  cardioEquipment.forEach(item => {
    for (let i = 1; i <= item.quantity; i++) {
      equipment.push({
        id: (idCounter++).toString(),
        name: item.quantity > 1 ? `${item.name} ${i}` : item.name,
        category: 'cardio',
        location: 'Cardio Area',
        status: 'operational',
        lastCheck: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        issueCount: 0,
        photoCount: 0,
        notes: ''
      });
    }
  });

  // Weight Machine Equipment
  const weightMachines = [
    { name: 'Bench press', quantity: 1 },
    { name: 'Rear deltoid/pectoral fly', quantity: 1 },
    { name: 'Leg extension/leg curl', quantity: 1 },
    { name: 'Ab machine', quantity: 1 },
    { name: 'Leg press', quantity: 1 },
    { name: 'Pulldown/seated row', quantity: 1 },
    { name: 'Abductor/adductor', quantity: 1 },
    { name: 'Assisted pull-up machine', quantity: 1 },
    { name: 'Pulldown', quantity: 1 },
    { name: 'Shoulder press machine', quantity: 1 },
    { name: 'T bar row', quantity: 1 },
    { name: 'Seated row', quantity: 1 },
    { name: 'Leg press 45 degree', quantity: 1 },
    { name: 'Hack squat', quantity: 1 },
    { name: 'Sissy squat', quantity: 1 },
    { name: 'Smith machine', quantity: 1 },
    { name: 'Cable machine', quantity: 2 },
    { name: 'Glute drive', quantity: 1 },
    { name: 'Preacher curl', quantity: 1 }
  ];

  weightMachines.forEach(item => {
    for (let i = 1; i <= item.quantity; i++) {
      equipment.push({
        id: (idCounter++).toString(),
        name: item.quantity > 1 ? `${item.name} ${i}` : item.name,
        category: 'weight-machines',
        location: 'Weight Machine Area',
        status: 'operational',
        lastCheck: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        issueCount: 0,
        photoCount: 0,
        notes: ''
      });
    }
  });

  // Free Weight Equipment
  const freeWeights = [
    { name: 'Bench', quantity: 4 },
    { name: 'Squat rack', quantity: 2 }
  ];

  freeWeights.forEach(item => {
    for (let i = 1; i <= item.quantity; i++) {
      equipment.push({
        id: (idCounter++).toString(),
        name: item.quantity > 1 ? `${item.name} ${i}` : item.name,
        category: 'free-weights',
        location: 'Free Weight Area',
        status: 'operational',
        lastCheck: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        issueCount: 0,
        photoCount: 0,
        notes: ''
      });
    }
  });

  return equipment;
};

export const useEquipmentData = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('gym-equipment');
    if (stored) {
      setEquipment(JSON.parse(stored));
    } else {
      // Initialize with the provided equipment data if no stored data exists
      const initialEquipment = generateInitialEquipment();
      setEquipment(initialEquipment);
      localStorage.setItem('gym-equipment', JSON.stringify(initialEquipment));
    }
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
