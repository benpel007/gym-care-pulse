
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { Equipment } from '@/types';

interface MaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | undefined;
  schedulingType: 'equipment' | 'zone';
  onSchedulingTypeChange: (type: 'equipment' | 'zone') => void;
  newMaintenance: {
    equipmentId: string;
    zone: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo: string;
  };
  onMaintenanceChange: (maintenance: any) => void;
  onAddMaintenance: () => void;
  equipment: Equipment[];
  zones: string[];
}

const MaintenanceDialog = ({
  open,
  onOpenChange,
  selectedDate,
  schedulingType,
  onSchedulingTypeChange,
  newMaintenance,
  onMaintenanceChange,
  onAddMaintenance,
  equipment,
  zones
}: MaintenanceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Maintenance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] mx-4">
        <DialogHeader>
          <DialogTitle>Schedule Maintenance</DialogTitle>
          <DialogDescription>
            Schedule maintenance for {selectedDate ? format(selectedDate, 'PPP') : 'a selected date'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Maintenance Type</Label>
            <Select value={schedulingType} onValueChange={(value: 'equipment' | 'zone') => {
              onSchedulingTypeChange(value);
              onMaintenanceChange({...newMaintenance, equipmentId: '', zone: ''});
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equipment">Equipment Specific</SelectItem>
                <SelectItem value="zone">Zone/Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {schedulingType === 'equipment' ? (
            <div className="grid gap-2">
              <Label htmlFor="equipment">Equipment</Label>
              <Select value={newMaintenance.equipmentId} onValueChange={(value) => 
                onMaintenanceChange({...newMaintenance, equipmentId: value})
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id}>
                      {eq.name} - {eq.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="zone">Zone/Area</Label>
              <Select value={newMaintenance.zone} onValueChange={(value) => 
                onMaintenanceChange({...newMaintenance, zone: value})
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone} value={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newMaintenance.title}
              onChange={(e) => onMaintenanceChange({...newMaintenance, title: e.target.value})}
              placeholder="e.g., Monthly inspection"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newMaintenance.description}
              onChange={(e) => onMaintenanceChange({...newMaintenance, description: e.target.value})}
              placeholder="Maintenance details..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={newMaintenance.priority} onValueChange={(value: any) => 
              onMaintenanceChange({...newMaintenance, priority: value})
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              value={newMaintenance.assignedTo}
              onChange={(e) => onMaintenanceChange({...newMaintenance, assignedTo: e.target.value})}
              placeholder="Staff member name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onAddMaintenance} 
            disabled={
              !selectedDate || 
              !newMaintenance.title || 
              (schedulingType === 'equipment' && !newMaintenance.equipmentId) ||
              (schedulingType === 'zone' && !newMaintenance.zone)
            }
          >
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceDialog;
