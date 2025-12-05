
import React from 'react';
import { useRecruit } from '../contexts/RecruitContext';
import CEODashboard from './dashboards/CEODashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import RecruiterDashboard from './dashboards/RecruiterDashboard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, ArrowRight, Zap, Target, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { candidates, tasks, interviews, user } = useRecruit();

  // Route to role-specific dashboard
  if (user?.role === 'CEO') {
    return <CEODashboard />;
  }

  if (user?.role === 'Manager') {
    return <ManagerDashboard />;
  }

  if (user?.role === 'Recruiter') {
    return <RecruiterDashboard />;
  }

  // Default/Fallback Dashboard (original overview)
  const totalRevenuePotential = candidates.reduce((acc, c) => acc + (c.estimatedFee * (c.probability / 100)), 0);
  const activeCandidates = candidates.filter(c => c.stage !== 'rejected' && c.stage !== 'joined').length;
  const interviewsThisWeek = interviews.filter(i => new Date(i.date) > new Date()).length;

  const revenueData = [
    { name: 'Jan', value: 45000 }, { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 }, { name: 'Apr', value: 61000 },
    { name: 'May', value: 55000 }, { name: 'Jun', value: 67000 },
    { name: 'Jul', value: 72000 }, { name: 'Aug', value: 85000 },
    { name: 'Sep', value: 91000 }, { name: 'Oct', value: totalRevenuePotential > 100000 ? 110000 : 95000 },
  ];

  const StatCard = ({ title, value, subtext, icon, trend, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-slate-200 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-slate-700 group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
        <p className="text-xs text-slate-400 mt-2 font-medium">{subtext}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Overview</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System operational. Data updated just now.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            Download Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Target size={16} /> Set Goals
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Forecasted Revenue"
          value={`$${(totalRevenuePotential / 1000).toFixed(1)}k`}
          subtext="Weighted pipeline value"
          icon={<DollarSign className="text-indigo-600" size={24} />}
          color="bg-indigo-600"
          trend={12.5}
        />
        <StatCard
          title="Active Pipeline"
          value={activeCandidates}
          subtext="Candidates in process"
          icon={<Users className="text-violet-600" size={24} />}
          color="bg-violet-600"
          trend={5.2}
        />
        <StatCard
          title="Efficiency Score"
          value="94/100"
          subtext="Avg time-to-hire: 24 days"
          icon={<Zap className="text-amber-500" size={24} />}
          color="bg-amber-500"
          trend={-2.1}
        />
        <StatCard
          title="Upcoming Interviews"
          value={interviewsThisWeek}
          subtext="Scheduled for this week"
          icon={<Activity className="text-rose-500" size={24} />}
          color="bg-rose-500"
          trend={8.4}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Revenue Performance</h3>
              <p className="text-sm text-slate-500">Actual vs. Forecasted fees over time</p>
            </div>
            <div className="flex gap-2">
              {['1M', '3M', '6M', 'YTD'].map(t => (
                <button key={t} className={`px-3 py-1 rounded-md text-xs font-semibold ${t === 'YTD' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Stream */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2 max-h-[350px]">
            {tasks.slice(0, 5).map((task, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white group-hover:bg-indigo-500 transition-colors"></div>
                  <div className="w-px h-full bg-slate-100 my-1 group-last:hidden"></div>
                </div>
                <div className="pb-2">
                  <p className="text-sm font-semibold text-slate-800">{task.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">assigned to <span className="text-indigo-600 font-medium">{task.owner}</span></p>
                  <span className="text-[10px] text-slate-400 mt-1 block flex items-center gap-1">
                    <Clock size={10} /> {task.dueDate}
                  </span>
                </div>
              </div>
            ))}
            {interviews.slice(0, 3).map((int, i) => (
              <div key={`int-${i}`} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-300 ring-4 ring-white group-hover:bg-emerald-500 transition-colors"></div>
                  <div className="w-px h-full bg-slate-100 my-1 group-last:hidden"></div>
                </div>
                <div className="pb-2">
                  <p className="text-sm font-semibold text-slate-800">Interview: {int.candidateName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">with {int.clientName}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block flex items-center gap-1">
                    <Clock size={10} /> {new Date(int.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
            View Full Log <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Team Leaderboard Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Team Performance</h3>
          <button className="text-sm text-slate-500 hover:text-indigo-600 font-medium">Export CSV</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Recruiter</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Active Deals</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pipeline Value</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Efficiency</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quota</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">PS</div>
                <span className="font-semibold text-slate-700">Priya Sharma</span>
              </td>
              <td className="px-6 py-4 font-medium text-slate-700">12</td>
              <td className="px-6 py-4 font-bold text-slate-900">$185,000</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">92%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">110%</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">RJ</div>
                <span className="font-semibold text-slate-700">Rahul Jain</span>
              </td>
              <td className="px-6 py-4 font-medium text-slate-700">8</td>
              <td className="px-6 py-4 font-bold text-slate-900">$95,000</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-xs font-bold text-amber-600">78%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">85%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
