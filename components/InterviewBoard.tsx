
import React, { useState } from 'react';
import { Interview } from '../types';
import { Calendar, Clock, Video, MapPin, Check, X, Plus } from 'lucide-react';
import { useRecruit } from '../contexts/RecruitContext';

const InterviewBoard: React.FC = () => {
  const { interviews, addInterview, updateInterviewStatus } = useRecruit();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // Form State
  const [candidateName, setCandidateName] = useState('');
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<'Virtual' | 'In-Person'>('Virtual');

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !clientName || !date || !time) return;

    const newInterview: Interview = {
        id: `i-${Date.now()}`,
        candidateId: 'temp-id', // In a real app, this would be selected
        candidateName,
        clientName,
        role: 'Pending Role',
        date: new Date(`${date}T${time}`).toISOString(),
        type,
        status: 'Pending'
    };

    addInterview(newInterview);
    setShowScheduleModal(false);
    
    // Reset form
    setCandidateName('');
    setClientName('');
    setDate('');
    setTime('');
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Interview Schedule</h2>
        <button 
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
            <Plus size={18} /> Schedule Interview
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-slate-100">
          {interviews.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((interview) => (
            <div key={interview.id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-slate-50 transition-colors">
              {/* Date Box */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-lg text-blue-700">
                <span className="text-xs font-bold uppercase">{new Date(interview.date).toLocaleString('default', { month: 'short' })}</span>
                <span className="text-2xl font-bold">{new Date(interview.date).getDate()}</span>
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-800">{interview.candidateName}</h3>
                  <span className="hidden md:inline text-slate-300">•</span>
                  <span className="text-slate-600 font-medium">{interview.role}</span>
                </div>
                <div className="text-sm text-slate-500 mb-3">
                  with <span className="font-semibold text-slate-700">{interview.clientName}</span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    {new Date(interview.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {interview.type === 'Virtual' ? <Video size={16} /> : <MapPin size={16} />}
                    {interview.type}
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-4">
                {interview.status === 'Confirmed' ? (
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <Check size={14} /> Confirmed
                  </div>
                ) : interview.status === 'Cancelled' ? (
                     <div className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <X size={14} /> Cancelled
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <Clock size={14} /> Pending
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateInterviewStatus(interview.id, 'Confirmed')}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                    title="Confirm"
                  >
                    <Check size={18} />
                  </button>
                  <button 
                    onClick={() => updateInterviewStatus(interview.id, 'Cancelled')}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                    title="Cancel"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

       {/* Schedule Modal */}
       {showScheduleModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Schedule Interview</h3>
                    <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <form onSubmit={handleSchedule} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Candidate Name</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Jane Doe"
                            value={candidateName}
                            onChange={e => setCandidateName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Client / Company</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. TechFlow"
                            value={clientName}
                            onChange={e => setClientName(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                             <input 
                                type="date"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                             />
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                             <input 
                                type="time"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                             />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                        <select 
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        value={type}
                        onChange={e => setType(e.target.value as any)}
                        >
                        <option value="Virtual">Virtual (Zoom/Meet)</option>
                        <option value="In-Person">In-Person</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        disabled={!candidateName || !clientName}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
                    >
                        Confirm Schedule
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default InterviewBoard;
