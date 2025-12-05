
import { Stage, Candidate, Task, Client, Interview, Position, Document, Notification, Folder } from './types';

export const PIPELINE_STAGES: Stage[] = [
  { id: 'req_received', label: 'Req Received', color: 'bg-slate-500' },
  { id: 'jd_analysis', label: 'JD Analysis', color: 'bg-slate-500' },
  { id: 'sourcing', label: 'Sourcing', color: 'bg-blue-500' },
  { id: 'profiles_shared', label: 'Profiles Shared', color: 'bg-indigo-500' },
  { id: 'client_feedback', label: 'Client Feedback', color: 'bg-violet-500' },
  { id: 'interview_scheduled', label: 'Interview', color: 'bg-purple-500' },
  { id: 'offer_pending', label: 'Offer', color: 'bg-pink-500' },
  { id: 'joined', label: 'Joined', color: 'bg-emerald-500' },
  { id: 'rejected', label: 'Rejected', color: 'bg-rose-500' },
];

export const MOCK_CANDIDATES: Candidate[] = [
  { 
    id: 'c1', 
    name: 'Arjun Mehta', 
    role: 'Senior React Dev', 
    client: 'TechFlow', 
    stage: 'client_feedback', 
    daysInStage: 3, 
    lastUpdated: '2023-10-25', 
    avatar: 'https://picsum.photos/32/32?random=1',
    email: 'arjun.m@example.com',
    phone: '+91 98765 43210',
    expectedSalary: 4500000,
    estimatedFee: 375000, // 8.33% or fixed
    probability: 60,
    tags: ['SaaS Exp', 'Immediate Joiner'],
    owner: 'Priya Sharma',
    history: [
      { stage: 'Profiles Shared', date: '2023-10-22', notes: 'Shared 2 profiles including Arjun', actor: 'Priya Sharma' },
      { stage: 'Sourcing', date: '2023-10-20', notes: 'Sourced from LinkedIn Recruiter', actor: 'Rahul' }
    ]
  },
  { 
    id: 'c2', 
    name: 'Sarah Jenkins', 
    role: 'Product Manager', 
    client: 'FinCorp', 
    stage: 'interview_scheduled', 
    daysInStage: 1, 
    lastUpdated: '2023-10-26', 
    avatar: 'https://picsum.photos/32/32?random=2',
    email: 's.jenkins@example.com',
    phone: '+1 555 0123',
    expectedSalary: 6000000,
    estimatedFee: 500000,
    probability: 75,
    tags: ['Fintech', 'Ex-Google'],
    owner: 'Priya Sharma',
    history: [
      { stage: 'Client Feedback', date: '2023-10-25', notes: 'Client loved the portfolio', actor: 'Priya Sharma' }
    ]
  },
  { 
    id: 'c3', 
    name: 'Mike Ross', 
    role: 'Legal Counsel', 
    client: 'Pearson Specter', 
    stage: 'offer_pending', 
    daysInStage: 5, 
    lastUpdated: '2023-10-20', 
    avatar: 'https://picsum.photos/32/32?random=3',
    email: 'mike.ross@example.com',
    phone: '+1 555 9999',
    expectedSalary: 8000000,
    estimatedFee: 800000,
    probability: 90,
    tags: ['Harvard', 'Corporate Law'],
    owner: 'Harvey S.',
    history: [
      { stage: 'Salary Neg', date: '2023-10-18', notes: 'Candidate requested 15% hike', actor: 'Harvey S.' }
    ]
  },
  { 
    id: 'c4', 
    name: 'Rachel Zane', 
    role: 'Paralegal', 
    client: 'Pearson Specter', 
    stage: 'profiles_shared', 
    daysInStage: 2, 
    lastUpdated: '2023-10-24', 
    avatar: 'https://picsum.photos/32/32?random=4',
    email: 'rachel@example.com',
    phone: '+1 555 8888',
    expectedSalary: 2500000,
    estimatedFee: 200000,
    probability: 40,
    tags: ['Internal Move'],
    owner: 'Mike Ross',
    history: []
  },
  { 
    id: 'c5', 
    name: 'David Kim', 
    role: 'Backend Engineer', 
    client: 'TechFlow', 
    stage: 'sourcing', 
    daysInStage: 12, 
    lastUpdated: '2023-10-15', 
    avatar: 'https://picsum.photos/32/32?random=5',
    email: 'd.kim@example.com',
    phone: '+1 555 7777',
    expectedSalary: 4000000,
    estimatedFee: 330000,
    probability: 20,
    tags: ['GoLang', 'Remote'],
    owner: 'Rahul',
    history: []
  },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Follow up on feedback', description: 'Client has not responded for 48h regarding Arjun.', priority: 'High', status: 'Pending', dueDate: 'Today', candidateName: 'Arjun Mehta', clientName: 'TechFlow', type: 'Email', owner: 'Priya Sharma' },
  { id: 't2', title: 'Confirm Interview Slot', description: 'Confirm availability for tomorrow.', priority: 'High', status: 'Pending', dueDate: 'Today', candidateName: 'Sarah Jenkins', clientName: 'FinCorp', type: 'Call', owner: 'Priya Sharma' },
  { id: 't3', title: 'Collect Aadhar Card', description: 'Mandatory for offer generation.', priority: 'Medium', status: 'Pending', dueDate: 'Tomorrow', candidateName: 'Mike Ross', clientName: 'Pearson Specter', type: 'Admin', owner: 'Harvey S.' },
  { id: 't4', title: 'Quarterly Business Review', description: 'Prepare slides for QBR with TechFlow.', priority: 'Low', status: 'Pending', dueDate: 'Next Week', clientName: 'TechFlow', type: 'Meeting', owner: 'Priya Sharma' },
  { id: 't5', title: 'Source 5 Java Devs', description: 'Top of funnel is weak for FinCorp.', priority: 'Medium', status: 'Completed', dueDate: 'Yesterday', clientName: 'FinCorp', type: 'Admin', owner: 'Rahul' },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'cl1', name: 'TechFlow', industry: 'Software', healthScore: 92, status: 'Active', lastContact: '1 day ago', openPositions: 3, totalRevenue: 125000, logo: 'https://logo.clearbit.com/techflow.com', accountManager: 'Priya Sharma' },
  { id: 'cl2', name: 'FinCorp', industry: 'Finance', healthScore: 45, status: 'Warm', lastContact: '10 days ago', openPositions: 1, totalRevenue: 85000, logo: 'https://logo.clearbit.com/fincorp.com', accountManager: 'Rahul' },
  { id: 'cl3', name: 'Pearson Specter', industry: 'Legal', healthScore: 78, status: 'Active', lastContact: '2 days ago', openPositions: 5, totalRevenue: 450000, logo: 'https://logo.clearbit.com/pearson.com', accountManager: 'Harvey S.' },
  { id: 'cl4', name: 'StartUp Inc', industry: 'E-commerce', healthScore: 20, status: 'Dormant', lastContact: '45 days ago', openPositions: 0, totalRevenue: 12000, logo: 'https://logo.clearbit.com/startup.com', accountManager: 'Priya Sharma' },
];

export const MOCK_INTERVIEWS: Interview[] = [
  { id: 'i1', candidateId: 'c2', candidateName: 'Sarah Jenkins', clientName: 'FinCorp', role: 'Product Manager', date: new Date(Date.now() + 86400000).toISOString(), type: 'Virtual', status: 'Confirmed' },
  { id: 'i2', candidateId: 'c1', candidateName: 'Arjun Mehta', clientName: 'TechFlow', role: 'Senior React Dev', date: new Date(Date.now() + 172800000).toISOString(), type: 'Virtual', status: 'Pending' },
  { id: 'i3', candidateId: 'c3', candidateName: 'Mike Ross', clientName: 'Pearson Specter', role: 'Legal Counsel', date: new Date(Date.now() - 86400000).toISOString(), type: 'In-Person', status: 'Completed', feedbackScore: 4.5, notes: 'Excellent technical knowledge.' },
];

export const MOCK_POSITIONS: Position[] = [
    { id: 'p1', title: 'Senior React Developer', department: 'Engineering', location: 'Remote (US)', type: 'Full-time', status: 'Open', hiringManager: 'Alex Chen', postedDate: '2023-10-01', applicantsCount: 45, interviewingCount: 3, salaryRange: '$120k - $150k', priority: 'High' },
    { id: 'p2', title: 'Product Design Lead', department: 'Design', location: 'New York, NY', type: 'Full-time', status: 'Open', hiringManager: 'Sarah Jenkins', postedDate: '2023-10-10', applicantsCount: 28, interviewingCount: 1, salaryRange: '$140k - $160k', priority: 'Medium' },
    { id: 'p3', title: 'Backend Engineer (Go)', department: 'Engineering', location: 'London, UK', type: 'Contract', status: 'Draft', hiringManager: 'David Kim', postedDate: '2023-10-25', applicantsCount: 0, interviewingCount: 0, salaryRange: '£600/day', priority: 'Low' },
    { id: 'p4', title: 'Marketing Manager', department: 'Marketing', location: 'Austin, TX', type: 'Full-time', status: 'Closed', hiringManager: 'Emily Davis', postedDate: '2023-09-15', applicantsCount: 112, interviewingCount: 0, salaryRange: '$90k - $110k', priority: 'Medium' },
];

export const MOCK_FOLDERS: Folder[] = [
    { id: 'f1', name: 'Candidates' },
    { id: 'f2', name: 'Contracts' },
    { id: 'f3', name: 'Invoices' },
    { id: 'f4', name: 'Internal' },
];

export const MOCK_DOCUMENTS: Document[] = [
    { id: 'd1', name: 'Arjun_Mehta_Resume_v2.pdf', type: 'pdf', size: '2.4 MB', uploadedBy: 'Priya Sharma', uploadedAt: '2023-10-22', category: 'Resume', folderId: 'f1' },
    { id: 'd2', name: 'TechFlow_MSA_Signed.pdf', type: 'pdf', size: '5.1 MB', uploadedBy: 'Admin', uploadedAt: '2023-09-01', category: 'Contract', folderId: 'f2' },
    { id: 'd3', name: 'Mike_Ross_Offer_Letter.docx', type: 'docx', size: '1.2 MB', uploadedBy: 'Priya Sharma', uploadedAt: '2023-10-18', category: 'Compliance', folderId: 'f1' },
    { id: 'd4', name: 'Q3_Invoice_FinCorp.pdf', type: 'pdf', size: '0.8 MB', uploadedBy: 'System', uploadedAt: '2023-10-01', category: 'Invoice', folderId: 'f3' },
    { id: 'd5', name: 'Recruitment_Process_Guidelines.pdf', type: 'pdf', size: '3.5 MB', uploadedBy: 'Admin', uploadedAt: '2023-08-15', category: 'Brief', folderId: 'f4' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', text: 'Arjun Mehta accepted the offer!', type: 'success', time: '2 mins ago', read: false },
    { id: 'n2', text: 'New application for Product Design Lead', type: 'info', time: '1 hour ago', read: false },
    { id: 'n3', text: 'Client Feedback overdue: FinCorp', type: 'warning', time: '4 hours ago', read: true, actionUrl: '/tasks' },
    { id: 'n4', text: 'System maintenance scheduled for Sunday', type: 'info', time: '1 day ago', read: true },
];
