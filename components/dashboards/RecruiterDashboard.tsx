import React from 'react';
import { Briefcase, Clock, Calendar, TrendingUp, Plus, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';

const RecruiterDashboard: React.FC = () => {
    // Mock data
    const myStats = {
        activeCandidates: 6,
        pendingTasks: 4,
        upcomingInterviews: 2,
        monthlyPlacements: 3,
        revenue: 32000,
        conversionRate: 68
    };

    const myCandidates = [
        { id: '1', name: 'Arjun Kumar', role: 'Senior Developer', client: 'TechFlow', stage: 'Interview', daysInStage: 2, priority: 'high' },
        { id: '2', name: 'Meera Patel', role: 'Product Manager', client: 'FinCorp', stage: 'Offer', daysInStage: 1, priority: 'high' },
        { id: '3', name: 'Rohan Singh', role: 'UX Designer', client: 'StartupX', stage: 'Profiles Shared', daysInStage: 5, priority: 'medium' },
        { id: '4', name: 'Kavya Reddy', role: 'Data Analyst', client: 'DataCo', stage: 'Sourcing', daysInStage: 1, priority: 'low' }
    ];

    const upcomingTasks = [
        { id: '1', title: 'Follow up with TechFlow on Arjun', priority: 'High', dueDate: 'Today', type: 'Call' },
        { id: '2', title: 'Send offer details to Meera', priority: 'High', dueDate: 'Today', type: 'Email' },
        { id: '3', title: 'Schedule interview for Rohan', priority: 'Medium', dueDate: 'Tomorrow', type: 'Admin' }
    ];

    const upcomingInterviews = [
        { candidate: 'Arjun Kumar', client: 'TechFlow', time: 'Today, 2:00 PM', type: 'Virtual' },
        { candidate: 'Meera Patel', client: 'FinCorp', time: 'Tomorrow, 10:00 AM', type: 'In-Person' }
    ];

    const getPriorityColor = (priority: string) => {
        if (priority === 'high' || priority === 'High') return 'bg-rose-100 text-rose-700 border-rose-200';
        if (priority === 'medium' || priority === 'Medium') return 'bg-amber-100 text-amber-700 border-amber-200';
        return 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Pipeline</h1>
                    <p className="text-slate-500 mt-1">Track your candidates and stay on top of your tasks</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                    <Plus size={18} />
                    Add Candidate
                </button>
            </div>

            {/* Personal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-2xl font-bold text-indigo-600">{myStats.activeCandidates}</div>
                    <div className="text-xs text-slate-500 mt-1">Active Candidates</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-2xl font-bold text-amber-600">{myStats.pendingTasks}</div>
                    <div className="text-xs text-slate-500 mt-1">Pending Tasks</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-2xl font-bold text-violet-600">{myStats.upcomingInterviews}</div>
                    <div className="text-xs text-slate-500 mt-1">Interviews Today</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-2xl font-bold text-emerald-600">{myStats.monthlyPlacements}</div>
                    <div className="text-xs text-slate-500 mt-1">This Month</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-2xl font-bold text-slate-900">{formatCurrency(myStats.revenue)}</div>
                    <div className="text-xs text-slate-500 mt-1">Revenue MTD</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-2xl font-bold text-slate-900">{myStats.conversionRate}%</div>
                    <div className="text-xs text-slate-500 mt-1">Conversion Rate</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Active Candidates */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Briefcase className="text-slate-600" size={20} />
                            <h3 className="text-lg font-bold text-slate-900">My Active Candidates</h3>
                        </div>
                        <span className="text-sm text-slate-500">{myCandidates.length} active</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {myCandidates.map((candidate) => (
                            <div key={candidate.id} className="p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {candidate.name}
                                        </h4>
                                        <p className="text-sm text-slate-500">{candidate.role} • {candidate.client}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getPriorityColor(candidate.priority)}`}>
                                        {candidate.priority}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded font-medium">
                                        {candidate.stage}
                                    </span>
                                    <span className="text-slate-500 flex items-center gap-1">
                                        <Clock size={12} />
                                        {candidate.daysInStage}d in stage
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Interviews */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-violet-50">
                            <div className="flex items-center gap-2">
                                <Calendar className="text-violet-600" size={18} />
                                <h3 className="font-bold text-violet-900">Upcoming Interviews</h3>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            {upcomingInterviews.map((interview, index) => (
                                <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="font-medium text-sm text-slate-900 mb-1">{interview.candidate}</div>
                                    <div className="text-xs text-slate-500">{interview.client}</div>
                                    <div className="flex items-center gap-2 mt-2 text-xs">
                                        <Clock size={12} className="text-violet-600" />
                                        <span className="text-violet-700 font-medium">{interview.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Today's Tasks */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-amber-50">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="text-amber-600" size={18} />
                                <h3 className="font-bold text-amber-900">Priority Tasks</h3>
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            {upcomingTasks.map((task) => (
                                <div key={task.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                    <input type="checkbox" className="mt-1 rounded border-slate-300" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-slate-900 truncate">{task.title}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                            <span className="text-xs text-slate-500">{task.dueDate}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl hover:shadow-md transition-all text-left group">
                    <Plus className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
                    <div className="font-semibold text-slate-900">Add New Candidate</div>
                    <div className="text-sm text-slate-500 mt-1">Import resume or add manually</div>
                </button>

                <button className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl hover:shadow-md transition-all text-left group">
                    <Calendar className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
                    <div className="font-semibold text-slate-900">Schedule Interview</div>
                    <div className="text-sm text-slate-500 mt-1">Book time with candidates</div>
                </button>

                <button className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:shadow-md transition-all text-left group">
                    <TrendingUp className="text-amber-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
                    <div className="font-semibold text-slate-900">View Full Pipeline</div>
                    <div className="text-sm text-slate-500 mt-1">See all candidates in detail</div>
                </button>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
