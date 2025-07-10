import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload, X } from "lucide-react";
import { Equipment, IssueReport } from '@/types';

interface IssueReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
  onSubmit: (report: Omit<IssueReport, 'id' | 'equipmentName' | 'reportedAt'>) => void;
}

const IssueReportModal = ({ isOpen, onClose, equipment, onSubmit }: IssueReportModalProps) => {
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const handleSubmit = () => {
    const reportData = {
      equipmentId: equipment.id,
      priority: priority,
      description: description,
      reportedBy: 'User', // Replace with actual user
      photos: photos,
      status: 'open' as 'open' | 'in-progress' | 'resolved',
    };
    onSubmit(reportData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Issue</DialogTitle>
          <DialogDescription>
            Report an issue for {equipment.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="photos">Photos</Label>
            <Input
              id="photos"
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files);
                  // Convert files to base64 strings or upload them
                  Promise.all(files.map(file => {
                    return new Promise<string>((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result as string);
                      reader.onerror = reject;
                      reader.readAsDataURL(file);
                    });
                  })).then(base64Strings => {
                    setPhotos(base64Strings);
                  });
                }
              }}
            />
            {photos.length > 0 && (
              <div className="flex gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img src={photo} alt={`Uploaded ${index + 1}`} className="object-cover w-full h-full rounded-md" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
                      onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IssueReportModal;
