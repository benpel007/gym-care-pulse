
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Mail, Phone } from "lucide-react";
import { StaffMember } from '@/types';

interface StaffTableRowProps {
  staff: StaffMember;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staffId: string) => void;
}

const StaffTableRow = ({ staff, onEdit, onDelete }: StaffTableRowProps) => {
  return (
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
            onClick={() => onEdit(staff)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(staff.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default StaffTableRow;
