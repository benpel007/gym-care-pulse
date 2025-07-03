
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X, AlertTriangle } from "lucide-react";
import { Equipment, IssueReport, PRIORITY_COLORS, STAFF_MEMBERS } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { useMaintenanceLog } from "@/hooks/useMaintenanceLog";
import { useEquipmentData } from "@/hooks/useEquipmentData";

interface IssueReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment?: Equipment | null;
}

const IssueReportModal = ({ isOpen, onClose, equipment }: IssueReportModalProps) => {
  const [selectedEquipment, setSelectedEquipment] = useState<string>(equipment?.id || '');
  const [priority, setPriority] = useState<IssueReport['priority']>('medium');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const { toast } = useToast();
  const { addLogEntry } = useMaintenanceLog();
  const { equipment: allEquipment, updateEquipment } = useEquipmentData();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPhotos(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedEquipment || !description || !reportedBy) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const equipmentItem = allEquipment.find(eq => eq.id === selectedEquipment);
    if (!equipmentItem) {
      toast({
        title: "Equipment Not Found",
        description: "Selected equipment could not be found.",
        variant: "destructive",
      });
      return;
    }

    // Update equipment issue count and photo count
    const updatedEquipment = {
      ...equipmentItem,
      issueCount: equipmentItem.issueCount + 1,
      photoCount: equipmentItem.photoCount + photos.length,
      status: priority === 'urgent' ? 'broken' as const : 
               priority === 'high' ? 'maintenance' as const : 
               equipmentItem.status
    };
    updateEquipment(updatedEquipment);

    // Add to maintenance log
    addLogEntry({
      type: 'issue',
      equipmentId: selectedEquipment,
      equipmentName: equipmentItem.name,
      description: description,
      staff: reportedBy,
      priority: priority,
      status: 'pending',
      photos: photos
    });

    // Store photos in localStorage (in a real app, you'd upload to a server)
    const photoStorage = JSON.parse(localStorage.getItem('equipment-photos') || '{}');
    photoStorage[selectedEquipment] = (photoStorage[selectedEquipment] || []).concat(
      photos.map(photo => ({
        id: Date.now() + Math.random(),
        url: photo,
        uploadedAt: new Date().toISOString(),
        uploadedBy: reportedBy,
        caption: `Issue Report: ${description.substring(0, 50)}...`
      }))
    );
    localStorage.setItem('equipment-photos', JSON.stringify(photoStorage));

    toast({
      title: "Issue Reported",
      description: `Issue reported for ${equipmentItem.name}`,
    });

    // Reset form
    setSelectedEquipment(equipment?.id || '');
    setPriority('medium');
    setDescription('');
    setReportedBy('');
    setPhotos([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Report Equipment Issue
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="equipment">Equipment *</Label>
            <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {allEquipment.map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name} - {eq.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority Level *</Label>
            <Select value={priority} onValueChange={(value: IssueReport['priority']) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={PRIORITY_COLORS.low}>Low</Badge>
                    <span className="text-sm">Minor issue, can wait</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={PRIORITY_COLORS.medium}>Medium</Badge>
                    <span className="text-sm">Needs attention soon</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={PRIORITY_COLORS.high}>High</Badge>
                    <span className="text-sm">Important, address today</span>
                  </div>
                </SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={PRIORITY_COLORS.urgent}>Urgent</Badge>
                    <span className="text-sm">Safety risk, immediate action</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reportedBy">Reported By *</Label>
            <Select value={reportedBy} onValueChange={setReportedBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_MEMBERS.map((staff) => (
                  <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Issue Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="photos">Photos (Optional)</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label htmlFor="photos" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600">Click to upload photos</p>
                <p className="text-xs text-slate-500">Support: JPG, PNG, GIF</p>
              </label>
            </div>
            
            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={photo} 
                      alt={`Issue photo ${index + 1}`} 
                      className="w-full h-24 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IssueReportModal;
