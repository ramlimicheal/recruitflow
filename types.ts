
export type StageId =
  | 'req_received' | 'jd_analysis' | 'sourcing' | 'profiles_shared'
  | 'client_feedback' | 'interview_scheduled' | 'interview_completed'
  | 'interview_feedback' | 'doc_collection' | 'salary_neg'
  | 'offer_pending' | 'offer_received' | 'joining_confirmed'
  | 'joined' | 'rejected';

export interface Stage {
  id: StageId;
  label: string;
  color: string;
}

export interface StageHistory {
  stage: string;
  date: string;
  notes?: string;
  actor: string;
}

export interface EmailThread {
  id: string;
  subject: string;
  messages: {
    id: string;
    from: string;
    to: string;
    body: string;
    date: string; // ISO
    type: 'sent' | 'received';
  }[];
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  client: string;
  stage: StageId;
  daysInStage: number;
  lastUpdated: string;
  avatar: string;
  history?: StageHistory[];
  email: string;
  phone: string;
  expectedSalary: number;
  estimatedFee: number; // Revenue potential
  probability: number; // 0-100%
  tags: string[];
  owner: string;
  status?: 'Active' | 'Archived'; // For filtering
  emails?: EmailThread[]; // Integration Layer
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed' | 'Snoozed';
  dueDate: string;
  candidateName?: string;
  clientName?: string;
  type: 'Call' | 'Email' | 'Admin' | 'Meeting';
  owner: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  healthScore: number; // 0-100
  status: 'Active' | 'Warm' | 'Cold' | 'Dormant' | 'Churned';
  lastContact: string;
  openPositions: number;
  totalRevenue: number;
  logo: string;
  accountManager: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  clientName: string;
  role: string;
  date: string; // ISO string
  type: 'Virtual' | 'In-Person';
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  feedbackScore?: number; // 1-5
  notes?: string;
}

export interface Position {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Contract';
  status: 'Open' | 'Closed' | 'Draft' | 'On Hold';
  hiringManager: string;
  postedDate: string;
  applicantsCount: number;
  interviewingCount: number;
  aiAnalysis?: string;
  salaryRange: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'img' | 'xlsx';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  category: 'Resume' | 'Contract' | 'Compliance' | 'Invoice' | 'Brief';
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
}

export interface Notification {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
  actionUrl?: string;
}

export type ViewState = 'dashboard' | 'pipeline' | 'tasks' | 'clients' | 'interviews' | 'positions' | 'documents' | 'settings' | 'activity';

