
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Plus, Shield, Sparkles, Dumbbell, Building, CheckCircle, Clock, User } from "lucide-react";
import { useDailyChecks } from "@/hooks/useDailyChecks";
import { ChecklistItem, PRIORITY_COLORS, STAFF_MEMBERS } from "@/types";
import { useToast } from "@/hooks/use-toast";
import StaffSelector from "@/components/StaffSelector";

const DailyChecks = () => {
  const { checklistItems, updateChecklistItem, addChecklistItem, completeAllItems } = useDailyChecks();
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    category: 'safety' as ChecklistItem['category'],
    task: '',
    priority: 'medium' as ChecklistItem['priority'],
    assignedTo: '',
    notes: ''
  });
  const { toast } = useToast();

  const completedItems = checklistItems.filter(item => item.completed);
  const completionPercentage = checklistItems.length > 0 ? Math.round((completedItems.length / checklistItems.length) * 100) : 0;

  const categoryGroups = {
    safety: checklistItems.filter(item => item.category === 'safety'),
    cleanliness: checklistItems.filter(item => item.category === 'cleanliness'),
    equipment: checklistItems.filter(item => item.category === 'equipment'),
    facility: checklistItems.filter(item => item.category === 'facility')
  };

  const categoryIcons = {
    safety: Shield,
    cleanliness: Sparkles,
    equipment: Dumbbell,
    facility: Building
  };

  const categoryColors = {
    safety: 'border-red-200 bg-red-50',
    cleanliness: 'border-blue-200 bg-blue-50',
    equipment: 'border-green-200 bg-green-50',
    facility: 'border-purple-200 bg-purple-50'
  };

  const handleItemCheck = (item: ChecklistItem, checked: boolean) => {
    if (checked && !selectedStaff) {
      toast({
        title: "Staff Required",
        description: "Please select a staff member before completing tasks.",
        variant: "destructive",
      });
      return;
    }

    const updatedItem = {
      ...item,
      completed: checked,
      completedBy: checked ? selectedStaff : undefined,
      completedAt: checked ? new Date().toISOString() : undefined
    };

    updateChecklistItem(updatedItem);
    
    if (checked) {
      toast({
        title: "Task Completed",
        description: `"${item.task}" completed by ${selectedStaff}`,
      });
    }
  };

  const handleCompleteAll = () => {
    if (!selectedStaff) {
      toast({
        title: "Staff Required",
        description: "Please select a staff member before completing all tasks.",
        variant: "destructive",
      });
      return;
    }

    completeAllItems(selectedStaff);
    toast({
      title: "All Tasks Completed",
      description: `All daily checks completed by ${selectedStaff}`,
    });
  };

  const handleAddItem = () => {
    if (!newItem.task) {
      toast({
        title: "Missing Information",
        description: "Please enter a task description.",
        variant: "destructive",
      });
      return;
    }

    const item: ChecklistItem = {
      id: Date.now().toString(),
      category: newItem.category,
      task: newItem.task,
      priority: newItem.priority,
      completed: false,
      assignedTo: newItem.assignedTo || undefined,
      notes: newItem.notes || undefined
    };

    addChecklistItem(item);
    setNewItem({
      category: 'safety',
      task: '',
      priority: 'medium',
      assignedTo: '',
      notes: ''
    });
    setShowAddModal(false);
    toast({
      title: "Task Added",
      description: "New checklist item has been added successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daily Checklist</h2>
          <p className="text-slate-600">Complete daily maintenance tasks</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-slate-300">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Checklist Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newItem.category} onValueChange={(value: ChecklistItem['category']) => setNewItem({...newItem, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="cleanliness">Cleanliness</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="facility">Facility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="task">Task Description *</Label>
                  <Input
                    id="task"
                    value={newItem.task}
                    onChange={(e) => setNewItem({...newItem, task: e.target.value})}
                    placeholder="Enter task description"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newItem.priority} onValueChange={(value: ChecklistItem['priority']) => setNewItem({...newItem, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select value={newItem.assignedTo} onValueChange={(value) => setNewItem({...newItem, assignedTo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Optional" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF_MEMBERS.map((staff) => (
                        <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newItem.notes}
                    onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                    placeholder="Additional notes..."
                  />
                </div>
                <Button onClick={handleAddItem} className="w-full">
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            onClick={handleCompleteAll}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            disabled={completedItems.length === checklistItems.length}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete All
          </Button>
        </div>
      </div>

      <StaffSelector selectedStaff={selectedStaff} onStaffChange={setSelectedStaff} />

      <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-slate-800">Progress Overview</CardTitle>
              <CardDescription className="text-slate-600">
                {completedItems.length} of {checklistItems.length} tasks completed
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-800">{completionPercentage}%</div>
              <div className="text-sm text-slate-600">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3" />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {Object.entries(categoryGroups).map(([category, items]) => {
          if (items.length === 0) return null;
          
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          const completedInCategory = items.filter(item => item.completed).length;
          
          return (
            <Card key={category} className={`${categoryColors[category as keyof typeof categoryColors]} border-2 hover:shadow-lg transition-all duration-200`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800 capitalize">
                  <Icon className="w-5 h-5" />
                  {category}
                  <Badge variant="outline" className="ml-auto bg-white/80">
                    {completedInCategory}/{items.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-white/40">
                    <Checkbox
                      id={item.id}
                      checked={item.completed}
                      onCheckedChange={(checked) => handleItemCheck(item, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <label
                          htmlFor={item.id}
                          className={`text-sm font-medium cursor-pointer ${
                            item.completed ? 'line-through text-slate-500' : 'text-slate-800'
                          }`}
                        >
                          {item.task}
                        </label>
                        <Badge variant="outline" className={PRIORITY_COLORS[item.priority]}>
                          {item.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        {item.assignedTo && (
                          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                            <User className="w-3 h-3" />
                            {item.assignedTo}
                          </div>
                        )}
                        {item.completed && item.completedBy && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded">
                            <CheckCircle className="w-3 h-3" />
                            Completed by {item.completedBy}
                          </div>
                        )}
                        {item.completed && item.completedAt && (
                          <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            <Clock className="w-3 h-3" />
                            {new Date(item.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DailyChecks;
