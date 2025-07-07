
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  id: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  hire_date: string;
  status: 'active' | 'inactive';
}

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingStaff ? 'Edit' : 'Add'} Staff Member</DialogTitle>
                <DialogDescription>
                  {editingStaff ? 'Update' : 'Enter'} the staff member's information.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="e.g., Personal Trainer, Manager"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingStaff ? 'Update' : 'Add'} Staff
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hire Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMembers.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell className="font-medium">{staff.name}</TableCell>
                <TableCell>{staff.position || '-'}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {staff.email && (
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="w-3 h-3 mr-1" />
                        {staff.email}
                      </div>
                    )}
                    {staff.phone && (
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="w-3 h-3 mr-1" />
                        {staff.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>
                    {staff.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(staff.hire_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(staff)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(staff.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {staffMembers.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No staff members added yet. Click "Add Staff" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffManagement;
