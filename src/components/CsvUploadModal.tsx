
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Equipment } from "@/types";

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (equipment: Equipment[]) => void;
}

const CsvUploadModal = ({ isOpen, onClose, onUpload }: CsvUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const csvContent = `name,category,location,status,notes
Treadmill 1,cardio,Main Floor,operational,Regular maintenance required
Bench Press,weight-machines,Weight Room,operational,
Dumbbells 10kg,free-weights,Free Weight Area,operational,Pair of dumbbells`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'equipment_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (csvText: string): Equipment[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have header row and at least one data row');

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['name', 'category', 'location'];
    
    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        throw new Error(`Missing required column: ${required}`);
      }
    }

    const equipment: Equipment[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length < headers.length) continue;

      const item: any = {};
      headers.forEach((header, index) => {
        item[header] = values[index] || '';
      });

      // Validate category
      const validCategories = ['cardio', 'weight-machines', 'free-weights'];
      if (!validCategories.includes(item.category)) {
        throw new Error(`Invalid category "${item.category}" on row ${i + 1}. Must be one of: ${validCategories.join(', ')}`);
      }

      // Validate status
      const validStatuses = ['operational', 'maintenance', 'broken'];
      const status = item.status || 'operational';
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status "${status}" on row ${i + 1}. Must be one of: ${validStatuses.join(', ')}`);
      }

      const equipmentItem: Equipment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: item.name,
        category: item.category as Equipment['category'],
        location: item.location,
        status: status as Equipment['status'],
        lastCheck: new Date().toISOString(),
        nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        issueCount: 0,
        photoCount: 0,
        notes: item.notes || ''
      };

      equipment.push(equipmentItem);
    }

    return equipment;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const text = await file.text();
      const equipment = parseCSV(text);
      
      onUpload(equipment);
      
      toast({
        title: "Upload Successful",
        description: `${equipment.length} equipment items have been added.`,
      });
      
      setFile(null);
      onClose();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to parse CSV file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Upload Equipment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">CSV Format Requirements:</p>
                <ul className="text-blue-800 space-y-1">
                  <li>• Required columns: name, category, location</li>
                  <li>• Optional columns: status, notes</li>
                  <li>• Categories: cardio, weight-machines, free-weights</li>
                  <li>• Status: operational, maintenance, broken</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>

          <div>
            <Label htmlFor="csv-file">Select CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>

          {file && (
            <div className="text-sm text-slate-600">
              Selected: {file.name} ({Math.round(file.size / 1024)} KB)
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                "Uploading..."
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CsvUploadModal;
