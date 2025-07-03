
import { useState, useEffect } from 'react';
import { Equipment } from '@/types';

const initialEquipment: Equipment[] = [
  // Cardio Equipment
  { id: '1', name: 'Treadmill 1', category: 'cardio', location: 'Cardio Floor - Zone A', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '2', name: 'Treadmill 2', category: 'cardio', location: 'Cardio Floor - Zone A', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '3', name: 'Elliptical 1', category: 'cardio', location: 'Cardio Floor - Zone B', status: 'maintenance', lastCheck: '2024-01-10T10:00:00Z', nextDue: '2024-01-17T10:00:00Z', issueCount: 1, photoCount: 2 },
  { id: '4', name: 'Exercise Bike 1', category: 'cardio', location: 'Cardio Floor - Zone C', status: 'operational', lastCheck: '2024-01-16T10:00:00Z', nextDue: '2024-01-23T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '5', name: 'Exercise Bike 2', category: 'cardio', location: 'Cardio Floor - Zone C', status: 'operational', lastCheck: '2024-01-16T10:00:00Z', nextDue: '2024-01-23T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '6', name: 'Rowing Machine 1', category: 'cardio', location: 'Cardio Floor - Zone D', status: 'operational', lastCheck: '2024-01-14T10:00:00Z', nextDue: '2024-01-21T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '7', name: 'Stair Climber 1', category: 'cardio', location: 'Cardio Floor - Zone E', status: 'broken', lastCheck: '2024-01-12T10:00:00Z', nextDue: '2024-01-19T10:00:00Z', issueCount: 2, photoCount: 3 },
  { id: '8', name: 'Cross Trainer 1', category: 'cardio', location: 'Cardio Floor - Zone F', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '9', name: 'Recumbent Bike 1', category: 'cardio', location: 'Cardio Floor - Zone G', status: 'operational', lastCheck: '2024-01-16T10:00:00Z', nextDue: '2024-01-23T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '10', name: 'Arc Trainer 1', category: 'cardio', location: 'Cardio Floor - Zone H', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '11', name: 'Spin Bike 1', category: 'cardio', location: 'Group Exercise Room', status: 'operational', lastCheck: '2024-01-14T10:00:00Z', nextDue: '2024-01-21T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '12', name: 'Spin Bike 2', category: 'cardio', location: 'Group Exercise Room', status: 'operational', lastCheck: '2024-01-14T10:00:00Z', nextDue: '2024-01-21T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '13', name: 'Air Bike 1', category: 'cardio', location: 'Functional Training Area', status: 'operational', lastCheck: '2024-01-16T10:00:00Z', nextDue: '2024-01-23T10:00:00Z', issueCount: 0, photoCount: 0 },

  // Weight Machines
  { id: '14', name: 'Lat Pulldown', category: 'weight-machines', location: 'Weight Floor - Section A', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '15', name: 'Cable Crossover', category: 'weight-machines', location: 'Weight Floor - Section A', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '16', name: 'Chest Press', category: 'weight-machines', location: 'Weight Floor - Section B', status: 'maintenance', lastCheck: '2024-01-12T10:00:00Z', nextDue: '2024-01-19T10:00:00Z', issueCount: 1, photoCount: 1 },
  { id: '17', name: 'Shoulder Press', category: 'weight-machines', location: 'Weight Floor - Section B', status: 'operational', lastCheck: '2024-01-16T10:00:00Z', nextDue: '2024-01-23T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '18', name: 'Leg Press', category: 'weight-machines', location: 'Weight Floor - Section C', status: 'operational', lastCheck: '2024-01-14T10:00:00Z', nextDue: '2024-01-21T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '19', name: 'Leg Curl', category: 'weight-machines', location: 'Weight Floor - Section C', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '20', name: 'Leg Extension', category: 'weight-machines', location: 'Weight Floor - Section C', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '21', name: 'Seated Row', category: 'weight-machines', location: 'Weight Floor - Section D', status: 'operational', lastCheck: '2024-01-16T10:00:00Z', nextDue: '2024-01-23T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '22', name: 'Pec Deck', category: 'weight-machines', location: 'Weight Floor - Section B', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '23', name: 'Bicep Curl Machine', category: 'weight-machines', location: 'Weight Floor - Section E', status: 'operational', lastCheck: '2024-01-14T10:00:00Z', nextDue: '2024-01-21T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '24', name: 'Tricep Extension', category: 'weight-machines', location: 'Weight Floor - Section E', status: 'operational', lastCheck: '2024-01-14T10:00:00Z', nextDue: '2024-01-21T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '25', name: 'Hip Abductor', category: 'weight-machines', location: 'Weight Floor - Section F', status: 'operational', lastCheck: '2024-01-16T10:00:00Z', nextDue: '2024-01-23T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '26', name: 'Hip Adductor', category: 'weight-machines', location: 'Weight Floor - Section F', status: 'operational', lastCheck: '2024-01-16T10:00:00Z', nextDue: '2024-01-23T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '27', name: 'Calf Raise Machine', category: 'weight-machines', location: 'Weight Floor - Section G', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '28', name: 'Smith Machine', category: 'weight-machines', location: 'Free Weight Area', status: 'operational', lastCheck: '2024-01-14T10:00:00Z', nextDue: '2024-01-21T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '29', name: 'Cable Machine 1', category: 'weight-machines', location: 'Weight Floor - Section H', status: 'operational', lastCheck: '2024-01-16T10:00:00Z', nextDue: '2024-01-23T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '30', name: 'Cable Machine 2', category: 'weight-machines', location: 'Weight Floor - Section H', status: 'operational', lastCheck: '2024-01-16T10:00:00Z', nextDue: '2024-01-23T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '31', name: 'Multi-Station 1', category: 'weight-machines', location: 'Weight Floor - Section I', status: 'maintenance', lastCheck: '2024-01-11T10:00:00Z', nextDue: '2024-01-18T10:00:00Z', issueCount: 1, photoCount: 2 },
  { id: '32', name: 'Multi-Station 2', category: 'weight-machines', location: 'Weight Floor - Section I', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '33', name: 'Functional Trainer', category: 'weight-machines', location: 'Functional Training Area', status: 'operational', lastCheck: '2024-01-16T10:00:00Z', nextDue: '2024-01-23T10:00:00Z', issueCount: 0, photoCount: 0 },

  // Free Weight Equipment
  { id: '34', name: 'Dumbbell Set 1-50lbs', category: 'free-weights', location: 'Free Weight Area - Rack A', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '35', name: 'Dumbbell Set 55-100lbs', category: 'free-weights', location: 'Free Weight Area - Rack B', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '36', name: 'Olympic Barbell Set', category: 'free-weights', location: 'Free Weight Area - Platform 1', status: 'operational', lastCheck: '2024-01-14T10:00:00Z', nextDue: '2024-01-21T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '37', name: 'Weight Plates (Various)', category: 'free-weights', location: 'Free Weight Area - Storage', status: 'operational', lastCheck: '2024-01-16T10:00:00Z', nextDue: '2024-01-23T10:00:00Z', issueCount: 0, photoCount: 0 },
  { id: '38', name: 'Adjustable Benches', category: 'free-weights', location: 'Free Weight Area - Center', status: 'maintenance', lastCheck: '2024-01-13T10:00:00Z', nextDue: '2024-01-20T10:00:00Z', issueCount: 1, photoCount: 1 },
  { id: '39', name: 'Kettlebell Set', category: 'free-weights', location: 'Functional Training Area', status: 'operational', lastCheck: '2024-01-15T10:00:00Z', nextDue: '2024-01-22T10:00:00Z', issueCount: 0, photoCount: 0 }
];

export const useEquipmentData = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('gym-equipment');
    if (stored) {
      setEquipment(JSON.parse(stored));
    } else {
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
