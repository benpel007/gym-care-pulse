
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { STAFF_MEMBERS } from '@/types';

interface StaffSelectorProps {
  selectedStaff: string;
  onStaffChange: (staff: string) => void;
  required?: boolean;
}

const StaffSelector = ({ selectedStaff, onStaffChange, required = true }: StaffSelectorProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-blue-700 font-medium">
            <User className="w-5 h-5" />
            Current Staff Member:
          </div>
          <Select value={selectedStaff} onValueChange={onStaffChange}>
            <SelectTrigger className="w-48 bg-white border-blue-300 focus:border-blue-500">
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {STAFF_MEMBERS.map((staff) => (
                <SelectItem key={staff} value={staff}>
                  {staff}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {required && !selectedStaff && (
            <span className="text-sm text-red-600 font-medium">
              * Required for task completion
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffSelector;
