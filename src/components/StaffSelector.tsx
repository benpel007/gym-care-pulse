
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from '@/types';

interface StaffSelectorProps {
  selectedStaff: string;
  onStaffChange: (staff: string) => void;
  required?: boolean;
}

const StaffSelector = ({ selectedStaff, onStaffChange, required = true }: StaffSelectorProps) => {
  const { gymProfile } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gymProfile?.id) {
      fetchStaffMembers();
    }
  }, [gymProfile?.id]);

  const fetchStaffMembers = async () => {
    if (!gymProfile?.id) return;

    try {
      const { data, error } = await (supabase as any)
        .from('staff_members')
        .select('*')
        .eq('gym_id', gymProfile.id)
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('Error fetching staff members:', error);
        return;
      }

      setStaffMembers(data || []);
    } catch (error) {
      console.error('Error fetching staff members:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-blue-700 font-medium">
              <User className="w-5 h-5" />
              Loading staff members...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (staffMembers.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-yellow-700 font-medium">
              <User className="w-5 h-5" />
              No active staff members found. Please add staff members in Settings.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              {staffMembers.map((staff) => (
                <SelectItem key={staff.id} value={staff.name}>
                  {staff.name} {staff.position && `(${staff.position})`}
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
