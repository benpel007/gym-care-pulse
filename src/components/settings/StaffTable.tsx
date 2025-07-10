
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StaffMember } from '@/types';
import StaffTableRow from './StaffTableRow';

interface StaffTableProps {
  staffMembers: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (staffId: string) => void;
}

const StaffTable = ({ staffMembers, onEdit, onDelete }: StaffTableProps) => {
  return (
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
          <StaffTableRow
            key={staff.id}
            staff={staff}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default StaffTable;
