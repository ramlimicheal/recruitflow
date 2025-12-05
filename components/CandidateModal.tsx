
import React, { useState } from 'react';
import { Candidate } from '../types';
import { PIPELINE_STAGES } from '../constants';
import { X, Calendar, Clock, Building, Briefcase, MessageSquare, MoveRight, FileText, Share2, Mail, Send, Paperclip, ChevronDown } from 'lucide-react';

interface Props {
  candidate: Candidate;
  onClose: () => void;
}

const CandidateModal: React.FC<Props> = ({ candidate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'emails'>('overview');
  const currentStageLabel = PIPELINE_STAGES.find(s => s.id === candidate.stage)?.label || candidate.stage;

  // Stop propagation to prevent closing when clicking inside the modal
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Mock Email Data for Visualization
  const mockEmails = [
      {
          id: '1',
          subject: `Interview Availability - ${candidate.role}`,
          from: candidate.name,
          to: 'Me',
          date: 'Yesterday, 2:30 PM',
          body: "Hi,\n\nI'm available this Tuesday after 2 PM or Wednesday morning. Let me know what works for the team.\n\nBest,\n" + candidate.name.split(' ')[0],
          type: 'received'
      },
      {
          id: '2',
          subject: `Re: Interview Availability - ${candidate.role}`,
          from: 'Me',
          to: candidate.name,
          date: 'Yesterday, 10:00 AM',
          body: `Hi ${candidate.name.split(' ')[0]},\n\nGreat to see your interest in the ${candidate.role} position at ${candidate.client}. Could you share your availability for a quick screening call?\n\nRegards,\nPriya`,
          type: 'sent'
      }
  ];

  return (
    <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in" 
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative" 
        onClick={handleContentClick}
      >
        {/* Premium Header */}
        <div className="relative h-32 bg-gradient-to-r from-slate-900 to-slate-800 p-6 flex justify-end">
            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-sm transition-colors z-10">
                <X size={20} />
            </button>
        </div>

        <div className="px-8 pb-0 -mt-12 flex justify-between items-end relative z-10">
             <div className="flex items-end gap-6">
                <img src={candidate.avatar} alt={candidate.name} className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover bg-white" />
                <div className="pb-1">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{candidate.name}</h2>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 font-medium mb-4">
                        <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-slate-400"/> {candidate.role}</span>
                        <span className="flex items-center gap-1.5"><Building size={16} className="text-slate-400"/> {candidate.client}</span>
                    </div>
                </div>
             </div>
             <div className="pb-6 hidden sm:block">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {currentStageLabel}
                </span>
             </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-8 mt-4 border-b border-slate-100 flex gap-6">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('emails')}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'emails' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
            >
                <Mail size={16} /> Emails
                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md text-[10px]">2</span>
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
            {activeTab === 'overview' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Metrics Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time in Stage</span>
                                <div className="mt-1 text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Clock size={20} className={candidate.daysInStage > 5 ? 'text-rose-500' : 'text-emerald-500'} />
                                    {candidate.daysInStage} Days
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fit Score</span>
                                <div className="mt-1 text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <span className="text-emerald-600">92%</span> Match
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div>
                            <h3 className="font-bold text-slate-900 mb-6 text-lg">Activity Timeline</h3>
                            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200">
                                {/* Current */}
                                <div className="relative">
                                        <div className="absolute -left-[39px] top-0 w-6 h-6 rounded-full bg-indigo-600 border-4 border-white shadow-sm flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-indigo-900">Entered {currentStageLabel}</span>
                                                <span className="text-xs font-medium text-indigo-400">{candidate.lastUpdated}</span>
                                            </div>
                                            <p className="text-sm text-indigo-800">Candidate moved to current stage. Pending action.</p>
                                        </div>
                                </div>
                                
                                {candidate.history && candidate.history.map((h, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[39px] top-1 w-6 h-6 rounded-full bg-slate-200 border-4 border-white"></div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-semibold text-slate-700">{h.stage}</div>
                                                {h.notes && <div className="text-sm text-slate-500 mt-1">{h.notes}</div>}
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono">{h.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center gap-3 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-xl font-medium justify-center">
                                    <MoveRight size={18} /> Move Candidate
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium justify-center shadow-sm">
                                    <MessageSquare size={18} /> Log Activity
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium justify-center shadow-sm">
                                    <Calendar size={18} /> Schedule
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Documents</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-indigo-200 transition-colors cursor-pointer group shadow-sm">
                                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-rose-500 group-hover:scale-110 transition-transform">
                                        <FileText size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-slate-700 truncate">Resume_v2.pdf</div>
                                        <div className="text-xs text-slate-400">2.4 MB • Added yesterday</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* EMAIL TAB CONTENT */
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Email History</h3>
                        <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                             <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Synced with Gmail
                        </div>
                    </div>

                    <div className="space-y-6 mb-8">
                        {mockEmails.map((email) => (
                            <div key={email.id} className={`flex ${email.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-5 shadow-sm border ${email.type === 'sent' ? 'bg-white border-indigo-100 rounded-tr-none' : 'bg-white border-slate-200 rounded-tl-none'}`}>
                                    <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-2">
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{email.from}</div>
                                            <div className="text-xs text-slate-500">to {email.to}</div>
                                        </div>
                                        <div className="text-xs text-slate-400">{email.date}</div>
                                    </div>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{email.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Compose Box */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sticky bottom-0">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-xs font-bold text-slate-400 uppercase">Reply to {candidate.name}</span>
                            <button className="text-slate-400 hover:text-slate-600"><ChevronDown size={16}/></button>
                        </div>
                        <textarea 
                            className="w-full h-24 bg-transparent resize-none outline-none text-sm text-slate-700 placeholder-slate-400"
                            placeholder="Type your reply here..."
                        ></textarea>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><Paperclip size={18} /></button>
                                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><Calendar size={18} /></button>
                            </div>
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                                <Send size={16} /> Send Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;
