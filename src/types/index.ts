
export interface Equipment {
  id: string;
  name: string;
  category: 'cardio' | 'weight-machines' | 'free-weights';
  location: string;
  status: 'operational' | 'maintenance' | 'broken';
  lastCheck: string;
  nextDue: string;
  issueCount: number;
  photoCount: number;
  notes?: string;
}

export interface LogEntry {
  id: string;
  equipmentId?: string;
  equipmentName?: string;
  type: 'check' | 'issue' | 'repair' | 'maintenance' | 'daily-check';
  description: string;
  staff: string;
  timestamp: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status: 'completed' | 'in-progress' | 'pending';
  photos?: string[];
}

export interface ChecklistItem {
  id: string;
  category: 'safety' | 'cleanliness' | 'equipment' | 'facility';
  task: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  notes?: string;
  assignedTo?: string;
}

export interface IssueReport {
  id: string;
  equipmentId: string;
  equipmentName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  reportedBy: string;
  reportedAt: string;
  photos: string[];
  status: 'open' | 'in-progress' | 'resolved';
}

export interface Photo {
  id: string;
  equipmentId: string;
  url: string;
  caption?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export const STAFF_MEMBERS = [
  'John Smith',
  'Sarah Johnson',
  'Mike Davis',
  'Lisa Wilson',
  'David Brown',
  'Emma Taylor'
];

export const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200'
};

export const STATUS_COLORS = {
  operational: 'bg-green-100 text-green-800 border-green-200',
  maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  broken: 'bg-red-100 text-red-800 border-red-200'
};
