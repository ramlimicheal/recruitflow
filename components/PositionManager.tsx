
import React, { useState } from 'react';
import { MOCK_POSITIONS } from '../constants';
import { Position } from '../types';
import { Plus, MapPin, Users, Calendar, MoreHorizontal, Sparkles, X, Check, BarChart3, Clock, DollarSign, Filter, Search } from 'lucide-react';
import { analyzeJobDescription } from '../services/geminiService';

const PositionManager: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>(MOCK_POSITIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jdText, setJdText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if(!jdText) return;
    setLoading(true);
    const result = await analyzeJobDescription(jdText);
    setAiAnalysis(result);
    setLoading(false);
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
        case 'Open': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 'Closed': return 'bg-slate-100 text-slate-600 border-slate-200';
        case 'Draft': return 'bg-amber-100 text-amber-800 border-amber-200';
        default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getPriorityIcon = (p: string) => {
      if (p === 'High') return <span className="flex h-2 w-2 rounded-full bg-rose-500"></span>;
      if (p === 'Medium') return <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>;
      return <span className="flex h-2 w-2 rounded-full bg-slate-400"></span>;
  }

  return (
    <div className="max-w-[1600px] mx-auto animate-fade-in">
       <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Positions & Requisitions</h2>
            <p className="text-slate-500 mt-1">Centralized dashboard for all open roles and hiring velocity.</p>
        </div>
        <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Search roles..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm" />
             </div>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-medium"
            >
                <Plus size={18} /> New Requisition
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role / Dept</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pipeline Stats</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Comp Range</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hiring Manager</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {positions.map((pos) => (
                    <tr key={pos.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2 mb-1">
                                {getPriorityIcon(pos.priority)}
                                <span className="font-bold text-slate-900">{pos.title}</span>
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                <span className="flex items-center gap-1"><Users size={12}/> {pos.department}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="flex items-center gap-1"><MapPin size={12}/> {pos.location}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyle(pos.status)}`}>
                                {pos.status}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className="text-lg font-bold text-slate-900">{pos.applicantsCount}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Applied</div>
                                </div>
                                <div className="h-8 w-px bg-slate-200"></div>
                                <div>
                                    <div className="text-lg font-bold text-indigo-600">{pos.interviewingCount}</div>
                                    <div className="text-[10px] font-bold text-indigo-300 uppercase">Interviewing</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm font-medium text-slate-700 bg-slate-100 w-fit px-2 py-1 rounded">
                                <DollarSign size={14} className="text-slate-400" />
                                {pos.salaryRange}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 text-xs flex items-center justify-center font-bold text-slate-600">
                                    {pos.hiringManager.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-slate-700">{pos.hiringManager}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                         <h3 className="text-xl font-bold text-slate-800">AI Job Analysis</h3>
                         <p className="text-sm text-slate-500">Paste your JD and let Gemini structure it.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                
                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="mb-4">
                        <textarea 
                            className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm text-slate-700 font-mono bg-slate-50"
                            placeholder="Paste full job description text..."
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                        />
                    </div>

                    {aiAnalysis && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-4 animate-fade-in relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-3 text-indigo-800 font-bold">
                                <Sparkles size={16} /> Analysis Result
                            </div>
                            <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed relative z-10">
                                {aiAnalysis}
                            </div>
                            <div className="absolute -bottom-10 -right-10 text-indigo-200 opacity-20">
                                <Sparkles size={150} />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                         <button 
                            onClick={handleAnalyze}
                            disabled={loading || !jdText}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-bold text-sm"
                         >
                            {loading ? <span className="animate-spin">✨</span> : <Sparkles size={16} />} 
                            {loading ? 'Processing...' : 'Analyze Requirements'}
                         </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PositionManager;
