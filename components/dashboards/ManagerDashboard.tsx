import React from 'react';
import { Users, TrendingUp, AlertCircle, CheckCircle, Clock, Target, BarChart3 } from 'lucide-react';

const ManagerDashboard: React.FC = () => {
    // Mock data
    const teamMetrics = {
        totalRecruiters: 8,
        activeDeals: 34,
        completionRate: 72,
        avgResponseTime: 4.2
    };

    const recruiterPerformance = [
        { name: 'Priya Sharma', active: 6, completed: 8, conversion: 75, workload: 85 },
        { name: 'Rahul Verma', active: 5, completed: 6, conversion: 68, workload: 70 },
        { name: 'Anjali Patel', active: 4, completed: 5, conversion: 71, workload: 65 },
        { name: 'Vikram Singh', active: 7, completed: 4, conversion: 58, workload: 95 },
        { name: 'Sneha Reddy', active: 3, completed: 7, conversion: 82, workload: 55 }
    ];

    const pipelineHealth = [
        { stage: 'Sourcing', count: 12, avgDays: 3, status: 'good' },
        { stage: 'Profiles Shared', count: 8, avgDays: 5, status: 'warning' },
        { stage: 'Interview', count: 6, avgDays: 2, status: 'good' },
        { stage: 'Offer', count: 4, avgDays: 8, status: 'critical' },
        { stage: 'Joining', count: 4, avgDays: 4, status: 'good' }
    ];

    const getWorkloadColor = (workload: number) => {
        if (workload > 90) return 'bg-rose-500';
        if (workload > 75) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const getStatusColor = (status: string) => {
        if (status === 'critical') return 'text-rose-600 bg-rose-50';
        if (status === 'warning') return 'text-amber-600 bg-amber-50';
        return 'text-emerald-600 bg-emerald-50';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
                <p className="text-slate-500 mt-1">Monitor team performance and optimize resource allocation</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <Users className="text-indigo-600" size={20} />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Team Size</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{teamMetrics.totalRecruiters}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-violet-50 rounded-lg">
                            <Target className="text-violet-600" size={20} />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Active Deals</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{teamMetrics.activeDeals}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <CheckCircle className="text-emerald-600" size={20} />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Completion Rate</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{teamMetrics.completionRate}%</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <Clock className="text-amber-600" size={20} />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Avg Response</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{teamMetrics.avgResponseTime}h</div>
                </div>
            </div>

            {/* Team Performance Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="text-slate-600" size={20} />
                        <h3 className="text-lg font-bold text-slate-900">Recruiter Performance</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Recruiter</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Active</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Completed</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Conversion</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Workload</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recruiterPerformance.map((recruiter) => (
                                <tr key={recruiter.name} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                {recruiter.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-slate-900">{recruiter.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold">
                                            {recruiter.active}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold">
                                            {recruiter.completed}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm font-bold text-slate-700">{recruiter.conversion}%</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-slate-100 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${getWorkloadColor(recruiter.workload)}`}
                                                    style={{ width: `${recruiter.workload}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-slate-600 w-12">{recruiter.workload}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pipeline Health */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="text-slate-600" size={20} />
                    <h3 className="text-lg font-bold text-slate-900">Pipeline Health by Stage</h3>
                </div>
                <div className="space-y-4">
                    {pipelineHealth.map((stage) => (
                        <div key={stage.stage} className="flex items-center gap-4">
                            <div className="w-32 text-sm font-medium text-slate-700">{stage.stage}</div>
                            <div className="flex-1 flex items-center gap-4">
                                <div className="flex-1 bg-slate-100 rounded-full h-3">
                                    <div
                                        className="bg-indigo-500 h-3 rounded-full"
                                        style={{ width: `${(stage.count / 12) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="w-16 text-sm font-bold text-slate-700">{stage.count} deals</div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(stage.status)}`}>
                                {stage.avgDays}d avg
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Alerts & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="text-amber-600" size={20} />
                        <h3 className="font-bold text-amber-900">Attention Required</h3>
                    </div>
                    <ul className="space-y-2">
                        <li className="text-sm text-amber-800">• Vikram Singh is at 95% capacity - consider redistribution</li>
                        <li className="text-sm text-amber-800">• 4 deals stuck in Offer stage for 8+ days</li>
                        <li className="text-sm text-amber-800">• Profiles Shared stage showing delays (5d avg)</li>
                    </ul>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="text-emerald-600" size={20} />
                        <h3 className="font-bold text-emerald-900">Wins This Week</h3>
                    </div>
                    <ul className="space-y-2">
                        <li className="text-sm text-emerald-800">• Priya achieved 75% conversion rate</li>
                        <li className="text-sm text-emerald-800">• Team completed 30 placements this month</li>
                        <li className="text-sm text-emerald-800">• Interview stage moving 20% faster</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
