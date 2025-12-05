import React from 'react';
import { TrendingUp, Users, DollarSign, Target, Award, Clock, ArrowUp, ArrowDown, Briefcase } from 'lucide-react';

const CEODashboard: React.FC = () => {
    // Mock data - in production, fetch from API
    const kpis = {
        monthlyRevenue: 245000,
        revenueGrowth: 12.5,
        placementRate: 68,
        activeDeals: 34,
        teamSize: 12,
        avgTimeToHire: 28,
        pipelineValue: 1250000,
        clientSatisfaction: 4.6
    };

    const topPerformers = [
        { name: 'Priya Sharma', placements: 8, revenue: 85000 },
        { name: 'Rahul Verma', placements: 6, revenue: 72000 },
        { name: 'Anjali Patel', placements: 5, revenue: 58000 }
    ];

    const revenueByMonth = [
        { month: 'Jul', revenue: 180000 },
        { month: 'Aug', revenue: 195000 },
        { month: 'Sep', revenue: 210000 },
        { month: 'Oct', revenue: 225000 },
        { month: 'Nov', revenue: 245000 },
        { month: 'Dec', revenue: 260000 }
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Executive Dashboard</h1>
                    <p className="text-slate-500 mt-1">Strategic overview and key performance indicators</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-emerald-700">All Systems Operational</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Monthly Revenue */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-50 rounded-xl">
                            <DollarSign className="text-indigo-600" size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold">
                            <ArrowUp size={16} />
                            {kpis.revenueGrowth}%
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(kpis.monthlyRevenue)}</h3>
                    <p className="text-sm text-slate-500 mt-1">Monthly Revenue</p>
                </div>

                {/* Placement Rate */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-50 rounded-xl">
                            <Target className="text-emerald-600" size={24} />
                        </div>
                        <div className="text-sm font-bold text-slate-400">vs 65% target</div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{kpis.placementRate}%</h3>
                    <p className="text-sm text-slate-500 mt-1">Placement Success Rate</p>
                </div>

                {/* Active Deals */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-violet-50 rounded-xl">
                            <Briefcase className="text-violet-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{kpis.activeDeals}</h3>
                    <p className="text-sm text-slate-500 mt-1">Active Deals in Pipeline</p>
                </div>

                {/* Avg Time to Hire */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-50 rounded-xl">
                            <Clock className="text-amber-600" size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold">
                            <ArrowDown size={16} />
                            8%
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{kpis.avgTimeToHire} days</h3>
                    <p className="text-sm text-slate-500 mt-1">Avg Time to Hire</p>
                </div>
            </div>

            {/* Revenue Trend & Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Trend (6 Months)</h3>
                    <div className="flex items-end justify-between h-64 gap-4">
                        {revenueByMonth.map((data, index) => {
                            const maxRevenue = Math.max(...revenueByMonth.map(d => d.revenue));
                            const height = (data.revenue / maxRevenue) * 100;
                            return (
                                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="relative w-full bg-slate-100 rounded-t-lg overflow-hidden" style={{ height: `${height}%` }}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-indigo-400"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs font-bold text-slate-700">{data.month}</div>
                                        <div className="text-[10px] text-slate-500">{formatCurrency(data.revenue / 1000)}K</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Performers */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Award className="text-amber-500" size={20} />
                        <h3 className="text-lg font-bold text-slate-900">Top Performers</h3>
                    </div>
                    <div className="space-y-4">
                        {topPerformers.map((performer, index) => (
                            <div key={performer.name} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                        index === 1 ? 'bg-slate-100 text-slate-700' :
                                            'bg-orange-100 text-orange-700'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-slate-900 truncate">{performer.name}</div>
                                    <div className="text-xs text-slate-500">{performer.placements} placements</div>
                                </div>
                                <div className="text-sm font-bold text-slate-700">{formatCurrency(performer.revenue)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pipeline Health & Team Capacity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pipeline Value */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp size={28} />
                        <h3 className="text-xl font-bold">Total Pipeline Value</h3>
                    </div>
                    <div className="text-4xl font-bold mb-2">{formatCurrency(kpis.pipelineValue)}</div>
                    <p className="text-indigo-100 text-sm">Weighted by probability across {kpis.activeDeals} active deals</p>
                    <div className="mt-6 pt-6 border-t border-white/20">
                        <div className="flex justify-between text-sm">
                            <span className="text-indigo-100">Expected closures this month</span>
                            <span className="font-bold">{formatCurrency(kpis.pipelineValue * 0.25)}</span>
                        </div>
                    </div>
                </div>

                {/* Team Overview */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="text-slate-600" size={24} />
                        <h3 className="text-lg font-bold text-slate-900">Team Overview</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-3xl font-bold text-slate-900">{kpis.teamSize}</div>
                            <div className="text-sm text-slate-500 mt-1">Active Recruiters</div>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-xl">
                            <div className="text-3xl font-bold text-emerald-700">{kpis.clientSatisfaction}</div>
                            <div className="text-sm text-emerald-600 mt-1">Client Satisfaction</div>
                        </div>
                        <div className="col-span-2 p-4 bg-indigo-50 rounded-xl">
                            <div className="text-sm text-indigo-600 font-medium mb-2">Team Utilization</div>
                            <div className="w-full bg-indigo-200 rounded-full h-2">
                                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                            <div className="text-xs text-indigo-500 mt-1">78% capacity (optimal range)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CEODashboard;
