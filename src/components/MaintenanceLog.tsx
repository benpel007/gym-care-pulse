
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertTriangle, Wrench, ClipboardCheck, Search, Filter, Calendar, User } from "lucide-react";
import { useMaintenanceLog } from "@/hooks/useMaintenanceLog";
import { LogEntry, PRIORITY_COLORS } from "@/types";

const MaintenanceLog = () => {
  const { logEntries } = useMaintenanceLog();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'priority'>('date');

  const filteredEntries = logEntries
    .filter(entry => {
      const matchesSearch = searchTerm === '' || 
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.equipmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.staff.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' || entry.type === filterType;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        default:
          return 0;
      }
    });

  const getTypeIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'check':
        return CheckCircle;
      case 'issue':
        return AlertTriangle;
      case 'repair':
      case 'maintenance':
        return Wrench;
      case 'daily-check':
        return ClipboardCheck;
      default:
        return CheckCircle;
    }
  };

  const getTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'check':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'issue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'repair':
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'daily-check':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: LogEntry['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Maintenance Log</h2>
        <p className="text-slate-600">Track all maintenance activities and issues</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search equipment, description, or staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="check">Equipment Checks</SelectItem>
                <SelectItem value="issue">Issues</SelectItem>
                <SelectItem value="repair">Repairs</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="daily-check">Daily Checks</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: 'date' | 'type' | 'priority') => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Newest First)</SelectItem>
                <SelectItem value="type">Activity Type</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardContent className="text-center py-8">
              <div className="text-slate-500 mb-2">No log entries found</div>
              <p className="text-sm text-slate-400">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Activity will appear here as staff complete tasks'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => {
            const TypeIcon = getTypeIcon(entry.type);
            return (
              <Card key={entry.id} className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(entry.type)}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={getTypeColor(entry.type)}>
                              {entry.type.replace('-', ' ')}
                            </Badge>
                            {entry.priority && (
                              <Badge variant="outline" className={PRIORITY_COLORS[entry.priority]}>
                                {entry.priority}
                              </Badge>
                            )}
                            <Badge variant="outline" className={getStatusColor(entry.status)}>
                              {entry.status}
                            </Badge>
                          </div>
                          {entry.equipmentName && (
                            <h3 className="font-semibold text-slate-800">{entry.equipmentName}</h3>
                          )}
                        </div>
                        
                        <div className="text-sm text-slate-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {entry.staff}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-slate-700 leading-relaxed">{entry.description}</p>
                      
                      {entry.photos && entry.photos.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                            📸 {entry.photos.length} photo{entry.photos.length !== 1 ? 's' : ''} attached
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {filteredEntries.length > 0 && (
        <div className="text-center text-sm text-slate-500 py-4">
          Showing {filteredEntries.length} of {logEntries.length} entries
        </div>
      )}
    </div>
  );
};

export default MaintenanceLog;
