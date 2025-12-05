
import React, { useState } from 'react';
import { Task } from '../types';
import { CheckCircle2, Circle, AlertCircle, Sparkles, Clock, CalendarDays, Phone, Mail, FileText, Users, Filter, Plus, Trash2, X } from 'lucide-react';
import { generateTaskPrioritization } from '../services/geminiService';
import { useRecruit } from '../contexts/RecruitContext';

const TaskList: React.FC = () => {
  const { tasks, addTask, toggleTaskStatus, deleteTask } = useRecruit();
  
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTaskType, setNewTaskType] = useState<'Call' | 'Email' | 'Admin'>('Email');

  const handleAiPrioritize = async () => {
    setLoadingAI(true);
    const insight = await generateTaskPrioritization(tasks.filter(t => t.status !== 'Completed'));
    setAiInsight(insight);
    setLoadingAI(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
        id: `t-${Date.now()}`,
        title: newTaskTitle,
        description: 'Added via Quick Add',
        priority: newTaskPriority,
        status: 'Pending',
        dueDate: 'Today',
        type: newTaskType,
        owner: 'Priya Sharma'
    };

    addTask(newTask);
    setShowAddModal(false);
    setNewTaskTitle('');
  };

  const getPriorityBadge = (p: string) => {
    const styles = {
      High: 'bg-rose-50 text-rose-700 border-rose-200',
      Medium: 'bg-amber-50 text-amber-700 border-amber-200',
      Low: 'bg-slate-50 text-slate-700 border-slate-200'
    };
    return styles[p as keyof typeof styles] || styles.Low;
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
        case 'Call': return <Phone size={14} className="text-blue-500" />;
        case 'Email': return <Mail size={14} className="text-violet-500" />;
        case 'Meeting': return <Users size={14} className="text-emerald-500" />;
        default: return <FileText size={14} className="text-slate-500" />;
    }
  };

  const filteredTasks = filterType === 'All' ? tasks : tasks.filter(t => t.type === filterType);

  return (
    <div className="max-w-6xl mx-auto h-full animate-fade-in relative">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Focus Zone</h2>
          <p className="text-slate-500 mt-1">Manage your daily priorities and actions.</p>
        </div>
        <div className="flex gap-4">
             <div className="flex bg-slate-100 p-1 rounded-lg">
                {['All', 'Call', 'Email', 'Admin'].map(type => (
                    <button 
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filterType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {type}
                    </button>
                ))}
             </div>
             <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors shadow-sm"
             >
                <Plus size={16} /> New Task
             </button>
             <button 
                onClick={handleAiPrioritize}
                disabled={loadingAI}
                className="group flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-medium shadow-md shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
             >
                <Sparkles size={16} className={`group-hover:animate-pulse ${loadingAI ? 'animate-spin' : ''}`} />
                {loadingAI ? 'Analyzing...' : 'AI Prioritize'}
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main List */}
        <div className="lg:col-span-8 space-y-6">
            {aiInsight && (
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-6 rounded-2xl relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Sparkles size={120} />
                    </div>
                    <div className="flex gap-4 relative z-10">
                        <div className="p-3 bg-white rounded-xl shadow-sm h-fit text-violet-600">
                            <Sparkles size={24} />
                        </div>
                        <div>
                        <h4 className="font-bold text-indigo-900 mb-2 text-lg">Smart Daily Briefing</h4>
                        <p className="text-sm text-indigo-800/80 leading-relaxed whitespace-pre-line">{aiInsight}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {filteredTasks.sort((a,b) => (a.status === 'Completed' ? 1 : -1)).map((task) => (
                <div 
                    key={task.id}
                    className={`group flex items-center gap-4 p-5 transition-all border-b border-slate-100 last:border-0 hover:bg-slate-50 ${
                    task.status === 'Completed' ? 'opacity-50 bg-slate-50/50' : ''
                    }`}
                >
                    <button 
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-1 transition-colors ${task.status === 'Completed' ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-500'}`}
                    >
                    {task.status === 'Completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-base truncate ${task.status === 'Completed' ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>
                            {task.title}
                            </h3>
                            {task.priority === 'High' && task.status !== 'Completed' && (
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 mb-2 line-clamp-1">{task.description}</p>
                        
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md font-medium border border-slate-200">
                                {getTypeIcon(task.type)} {task.type}
                            </span>
                            {(task.candidateName || task.clientName) && (
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    {task.candidateName ? task.candidateName : task.clientName}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getPriorityBadge(task.priority)}`}>
                                {task.priority}
                            </span>
                            <button 
                                onClick={() => deleteTask(task.id)} 
                                className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                title="Delete Task"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        {task.dueDate === 'Today' ? (
                            <span className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                                <AlertCircle size={12} /> Today
                            </span>
                        ) : (
                             <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                <CalendarDays size={12} /> {task.dueDate}
                            </span>
                        )}
                    </div>
                </div>
                ))}
                {filteredTasks.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <div className="inline-block p-4 bg-slate-50 rounded-full mb-3">
                            <CheckCircle2 size={32} className="text-slate-300" />
                        </div>
                        <p className="font-medium">No tasks found.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Productivity Pulse</h3>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-500">Daily Completion</span>
                    <span className="text-sm font-bold text-emerald-600">68%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
                        <div className="text-2xl font-bold text-indigo-700">{tasks.filter(t => t.status === 'Completed').length}</div>
                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mt-1">Completed</div>
                    </div>
                     <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-center">
                        <div className="text-2xl font-bold text-rose-700">{tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length}</div>
                        <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mt-1">Critical</div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-white mb-2">Upcoming Meetings</h3>
                    <div className="space-y-4 mt-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-white/10 p-2 rounded-lg text-white">
                                <Clock size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">Review with FinCorp</div>
                                <div className="text-xs text-slate-400">10:00 AM • Zoom</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                             <div className="bg-white/10 p-2 rounded-lg text-white">
                                <Clock size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">Team Sync</div>
                                <div className="text-xs text-slate-400">2:30 PM • Room A</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">New Task</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <form onSubmit={handleAddTask} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Task Title</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Call John Doe"
                            value={newTaskTitle}
                            onChange={e => setNewTaskTitle(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-bold text-slate-700 mb-1">Priority</label>
                             <select 
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                value={newTaskPriority}
                                onChange={e => setNewTaskPriority(e.target.value as any)}
                             >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                             </select>
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                             <select 
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                value={newTaskType}
                                onChange={e => setNewTaskType(e.target.value as any)}
                             >
                                <option value="Call">Call</option>
                                <option value="Email">Email</option>
                                <option value="Admin">Admin</option>
                             </select>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!newTaskTitle.trim()}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
                    >
                        Create Task
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
