
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

    try {
      console.log('Fetching staff members for gym:', gymProfile.id);
      const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .eq('gym_id', gymProfile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching staff members:', error);
        toast({
          title: "Error",
          description: "Failed to fetch staff members",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched staff members:', data);

      // Transform the data to match our StaffMember interface
      const transformedData: StaffMember[] = (data || []).map(staff => ({
        id: staff.id,
        name: staff.name,
        position: staff.position || undefined,
        email: staff.email || undefined,
        phone: staff.phone || undefined,
        hire_date: staff.hire_date,
        status: staff.status as 'active' | 'inactive'
      }));

      setStaffMembers(transformedData);
    } catch (error) {
      console.error('Error fetching staff members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch staff members",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    console.log('Gym profile:', gymProfile);

    if (!gymProfile?.id) {
      console.error('No gym profile found');
      toast({
        title: "Error",
        description: "No gym profile found",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name.trim()) {
      console.error('Staff name is required');
      toast({
        title: "Error",
        description: "Staff name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const staffData = {
        name: formData.name.trim(),
        position: formData.position.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        status: formData.status,
        gym_id: gymProfile.id,
      };

      console.log('Submitting staff data:', staffData);

      let error;
      if (editingStaff) {
        console.log('Updating staff member:', editingStaff.id);
        const { error: updateError } = await supabase
          .from('staff_members')
          .update(staffData)
          .eq('id', editingStaff.id);
        error = updateError;
      } else {
        console.log('Creating new staff member');
        const { error: insertError } = await supabase
          .from('staff_members')
          .insert([staffData]);
        error = insertError;
      }

      if (error) {
        console.error('Error saving staff member:', error);
        toast({
          title: "Error",
          description: `Failed to ${editingStaff ? 'update' : 'add'} staff member: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Staff member saved successfully');
      toast({
        title: "Success",
        description: `Staff member ${editingStaff ? 'updated' : 'added'} successfully`,
      });

      setIsDialogOpen(false);
      resetForm();
      fetchStaffMembers();
    } catch (error) {
      console.error('Error saving staff member:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingStaff ? 'update' : 'add'} staff member`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (staff: StaffMember) => {
    console.log('Editing staff member:', staff);
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
    console.log('Deleting staff member:', staffId);
    if (!confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', staffId);

      if (error) {
        console.error('Error deleting staff member:', error);
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
    } catch (error) {
      console.error('Error deleting staff member:', error);
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    }
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

  const handleAddStaff = () => {
    console.log('Add staff button clicked');
    resetForm();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    console.log('Closing dialog');
    setIsDialogOpen(false);
    resetForm();
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
            onClick={handleAddStaff}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {staffMembers.length > 0 ? (
          <StaffTable
            staffMembers={staffMembers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="text-center py-8 text-slate-500">
            No staff members added yet. Click "Add Staff" to get started.
          </div>
        )}
      </CardContent>

      <StaffForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        editingStaff={editingStaff}
        formData={formData}
        setFormData={setFormData}
      />
    </Card>
  );
};

export default StaffManagement;
