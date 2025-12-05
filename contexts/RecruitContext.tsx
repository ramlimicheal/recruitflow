import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Candidate, Task, Client, Interview, Position, StageId } from '../types';
import { 
    MOCK_CANDIDATES, MOCK_TASKS, MOCK_CLIENTS, MOCK_INTERVIEWS, MOCK_POSITIONS 
} from '../constants';

interface RecruitContextType {
    candidates: Candidate[];
    tasks: Task[];
    clients: Client[];
    interviews: Interview[];
    positions: Position[];
    
    // Actions
    updateCandidateStage: (id: string, stage: StageId) => void;
    addCandidate: (candidate: Candidate) => void;
    addTask: (task: Task) => void;
    toggleTaskStatus: (id: string) => void;
    deleteTask: (id: string) => void;
    addInterview: (interview: Interview) => void;
    updateInterviewStatus: (id: string, status: Interview['status']) => void;
}

const RecruitContext = createContext<RecruitContextType | undefined>(undefined);

interface RecruitProviderProps {
  children: ReactNode;
  user?: any;
  onLogout?: () => void;
}

export const RecruitProvider: React.FC<RecruitProviderProps> = ({ children, user, onLogout }) => {
    // Initialize State with Mock Data
    const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
    const [interviews, setInterviews] = useState<Interview[]>(MOCK_INTERVIEWS);
    const [positions, setPositions] = useState<Position[]>(MOCK_POSITIONS);

    // --- Candidate Logic ---
    const updateCandidateStage = (id: string, stage: StageId) => {
        setCandidates(prev => prev.map(c => {
            if (c.id === id) {
                // Create history entry
                const historyEntry = {
                    stage: c.stage, // Previous stage
                    date: new Date().toISOString().split('T')[0],
                    notes: `Moved to ${stage}`,
                    actor: 'Priya Sharma' // Hardcoded current user
                };
                
                return {
                    ...c,
                    stage,
                    daysInStage: 0,
                    lastUpdated: new Date().toISOString().split('T')[0],
                    history: [historyEntry, ...(c.history || [])]
                };
            }
            return c;
        }));
    };

    const addCandidate = (candidate: Candidate) => {
        setCandidates(prev => [candidate, ...prev]);
    };

    // --- Task Logic ---
    const addTask = (task: Task) => {
        setTasks(prev => [task, ...prev]);
    };

    const toggleTaskStatus = (id: string) => {
        setTasks(prev => prev.map(t => 
            t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t
        ));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    // --- Interview Logic ---
    const addInterview = (interview: Interview) => {
        setInterviews(prev => [interview, ...prev]);
        // Auto-create a task for this interview
        const newTask: Task = {
            id: `t-auto-${Date.now()}`,
            title: `Interview Prep: ${interview.candidateName}`,
            description: `Upcoming interview with ${interview.clientName}`,
            priority: 'High',
            status: 'Pending',
            dueDate: new Date(interview.date).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : 'Upcoming',
            candidateName: interview.candidateName,
            clientName: interview.clientName,
            type: 'Meeting',
            owner: 'Priya Sharma'
        };
        addTask(newTask);
    };

    const updateInterviewStatus = (id: string, status: Interview['status']) => {
        setInterviews(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    };

    return (
        <RecruitContext.Provider value={{
            candidates, tasks, clients, interviews, positions,
            updateCandidateStage, addCandidate,
            addTask, toggleTaskStatus, deleteTask,
            addInterview, updateInterviewStatus
        }}>
            {children}
        </RecruitContext.Provider>
    );
};

export const useRecruit = () => {
    const context = useContext(RecruitContext);
    if (!context) {
        throw new Error('useRecruit must be used within a RecruitProvider');
    }
    return context;
};