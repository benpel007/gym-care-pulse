import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Clock, CheckCircle, AlertTriangle, User } from "lucide-react";
import { ChecklistItem } from '@/types';
import { useDailyChecks } from '@/hooks/useDailyChecks';

const DailyChecks = () => {
  const { checks, loading, error, toggleCheck, updateNotes } = useDailyChecks();
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>(null);

  const handleCheckToggle = async (check: ChecklistItem) => {
    await toggleCheck(check);
  };

  const handleNotesUpdate = async (check: ChecklistItem, notes: string) => {
    await updateNotes(check, notes);
    setExpandedCheckId(null);
  };

  const isExpanded = (checkId: string) => expandedCheckId === checkId;

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Daily Checks</CardTitle>
          <CardDescription>Loading checklist...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <Clock className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Daily Checks</CardTitle>
          <CardDescription>Failed to load checklist.</CardDescription>
        </CardHeader>
        <CardContent className="text-red-500">
          Error: {error.message}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-slate-800">Daily Checks</CardTitle>
            <CardDescription>Ensure all tasks are completed daily</CardDescription>
          </div>
          <Badge variant="secondary">
            {checks?.filter(check => check.completed).length || 0} / {checks?.length || 0} Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {checks && checks.map((check) => (
          <div key={check.id} className="border rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id={`check-${check.id}`}
                  checked={check.completed}
                  onCheckedChange={() => handleCheckToggle(check)}
                />
                <label
                  htmlFor={`check-${check.id}`}
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {check.task}
                </label>
              </div>
              {check.priority === 'high' && (
                <AlertTriangle className="text-red-500 w-4 h-4" />
              )}
            </div>
            {isExpanded(check.id) ? (
              <div className="mt-3">
                <Textarea
                  defaultValue={check.notes || ""}
                  placeholder="Add notes here..."
                  className="w-full text-sm"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setExpandedCheckId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="ml-2"
                    onClick={() => {
                      const notes = document.querySelector('textarea')?.value || '';
                      handleNotesUpdate(check, notes);
                    }}
                  >
                    Save Notes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end mt-2">
                {check.completed && check.completedBy && (
                  <div className="flex items-center text-xs text-gray-500 mr-2">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    Completed by {check.completedBy}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedCheckId(check.id)}
                >
                  Add Notes
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DailyChecks;
