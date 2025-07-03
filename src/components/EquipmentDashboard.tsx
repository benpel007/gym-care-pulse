
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, CheckCircle, AlertTriangle, Edit, Calendar, Camera, MapPin } from "lucide-react";
import { useEquipmentData } from "@/hooks/useEquipmentData";
import { Equipment, STATUS_COLORS } from "@/types";
import { useToast } from "@/hooks/use-toast";
import StaffSelector from "@/components/StaffSelector";
import IssueReportModal from "@/components/IssueReportModal";

const EquipmentDashboard = () => {
  const { equipment, addEquipment, updateEquipment } = useEquipmentData();
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    category: 'cardio' as Equipment['category'],
    location: '',
    status: 'operational' as Equipment['status'],
    notes: ''
  });
  const { toast } = useToast();

  const cardioEquipment = equipment.filter(eq => eq.category === 'cardio');
  const weightMachines = equipment.filter(eq => eq.category === 'weight-machines');
  const freeWeights = equipment.filter(eq => eq.category === 'free-weights');

  const handleCompleteCheck = (equipmentItem: Equipment) => {
    if (!selectedStaff) {
      toast({
        title: "Staff Required",
        description: "Please select a staff member before completing checks.",
        variant: "destructive",
      });
      return;
    }

    const updatedEquipment = {
      ...equipmentItem,
      lastCheck: new Date().toISOString(),
      nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    updateEquipment(updatedEquipment);
    toast({
      title: "Check Completed",
      description: `${equipmentItem.name} check completed by ${selectedStaff}`,
    });
  };

  const handleReportIssue = (equipmentItem: Equipment) => {
    setSelectedEquipment(equipmentItem);
    setShowIssueModal(true);
  };

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const equipment: Equipment = {
      id: Date.now().toString(),
      name: newEquipment.name,
      category: newEquipment.category,
      location: newEquipment.location,
      status: newEquipment.status,
      lastCheck: new Date().toISOString(),
      nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      issueCount: 0,
      photoCount: 0,
      notes: newEquipment.notes
    };

    addEquipment(equipment);
    setNewEquipment({
      name: '',
      category: 'cardio',
      location: '',
      status: 'operational',
      notes: ''
    });
    setShowAddModal(false);
    toast({
      title: "Equipment Added",
      description: `${equipment.name} has been added successfully.`,
    });
  };

  const EquipmentCard = ({ item }: { item: Equipment }) => (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-800 mb-1">{item.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <MapPin className="w-4 h-4" />
              {item.location}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline" className={STATUS_COLORS[item.status]}>
              {item.status}
            </Badge>
            {item.photoCount > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Camera className="w-3 h-3 mr-1" />
                {item.photoCount}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-600 font-medium">Last Check</p>
              <p className="text-slate-800">{new Date(item.lastCheck).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Next Due</p>
              <p className={`font-medium ${new Date(item.nextDue) < new Date() ? 'text-red-600' : 'text-slate-800'}`}>
                {new Date(item.nextDue).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {item.issueCount > 0 && (
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800 font-medium">{item.issueCount} active issues</span>
            </div>
          )}
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              size="sm" 
              onClick={() => handleCompleteCheck(item)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Complete
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleReportIssue(item)}
              className="border-red-200 text-red-700 hover:bg-red-50 flex-1"
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Issue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Equipment Management</h2>
          <p className="text-slate-600">Monitor and maintain all gym equipment</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Equipment Name *</Label>
                <Input
                  id="name"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                  placeholder="Enter equipment name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newEquipment.category} onValueChange={(value: Equipment['category']) => setNewEquipment({...newEquipment, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardio">Cardio Equipment</SelectItem>
                    <SelectItem value="weight-machines">Weight Machines</SelectItem>
                    <SelectItem value="free-weights">Free Weight Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={newEquipment.location}
                  onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newEquipment.status} onValueChange={(value: Equipment['status']) => setNewEquipment({...newEquipment, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="broken">Broken</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newEquipment.notes}
                  onChange={(e) => setNewEquipment({...newEquipment, notes: e.target.value})}
                  placeholder="Additional notes..."
                />
              </div>
              <Button onClick={handleAddEquipment} className="w-full">
                Add Equipment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <StaffSelector selectedStaff={selectedStaff} onStaffChange={setSelectedStaff} />

      <Tabs defaultValue="cardio" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-slate-200">
          <TabsTrigger value="cardio" className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            Cardio ({cardioEquipment.length})
          </TabsTrigger>
          <TabsTrigger value="weight-machines" className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            Weight Machines ({weightMachines.length})
          </TabsTrigger>
          <TabsTrigger value="free-weights" className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            Free Weights ({freeWeights.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cardio">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cardioEquipment.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weight-machines">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weightMachines.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="free-weights">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeWeights.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <IssueReportModal 
        isOpen={showIssueModal} 
        onClose={() => setShowIssueModal(false)}
        equipment={selectedEquipment}
      />
    </div>
  );
};

export default EquipmentDashboard;
