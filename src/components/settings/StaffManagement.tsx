
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StaffMember } from '@/types';
import StaffForm from './StaffForm';
import StaffTable from './StaffTable';

const StaffManagement = () => {
  const { gymProfile } = useAuth();
  const { toast } = useToast();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    if (gymProfile?.id) {
      fetchStaffMembers();
    }
  }, [gymProfile?.id]);

  const fetchStaffMembers = async () => {
    if (!gymProfile?.id) return;

    const { data, error } = await (supabase as any)
      .from('staff_members')
      .select('*')
      .eq('gym_id', gymProfile.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch staff members",
        variant: "destructive",
      });
      return;
    }

    setStaffMembers(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymProfile?.id) return;

    const staffData = {
      ...formData,
      gym_id: gymProfile.id,
    };

    let error;
    if (editingStaff) {
      const { error: updateError } = await (supabase as any)
        .from('staff_members')
        .update(staffData)
        .eq('id', editingStaff.id);
      error = updateError;
    } else {
      const { error: insertError } = await (supabase as any)
        .from('staff_members')
        .insert([staffData]);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingStaff ? 'update' : 'add'} staff member`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Staff member ${editingStaff ? 'updated' : 'added'} successfully`,
    });

    setIsDialogOpen(false);
    resetForm();
    fetchStaffMembers();
  };

  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      position: staff.position || '',
      email: staff.email || '',
      phone: staff.phone || '',
      status: staff.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (staffId: string) => {
    const { error } = await (supabase as any)
      .from('staff_members')
      .delete()
      .eq('id', staffId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Staff member deleted successfully",
    });

    fetchStaffMembers();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      email: '',
      phone: '',
      status: 'active'
    });
    setEditingStaff(null);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-slate-800">Staff Management</CardTitle>
            <CardDescription>Add and manage your gym staff members</CardDescription>
          </div>
          <Button 
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <StaffTable
          staffMembers={staffMembers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {staffMembers.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No staff members added yet. Click "Add Staff" to get started.
          </div>
        )}
      </CardContent>

      <StaffForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        editingStaff={editingStaff}
        formData={formData}
        setFormData={setFormData}
      />
    </Card>
  );
};

export default StaffManagement;
