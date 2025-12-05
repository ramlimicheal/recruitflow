
import React, { useState, useMemo } from 'react';
import { PIPELINE_STAGES } from '../constants';
import { Candidate, StageId } from '../types';
import {
    Clock, Filter, Search, Plus, UserCircle, Briefcase,
    MoreHorizontal, ArrowUpDown, AlertCircle, CheckCircle2,
    XCircle, Mail, Calendar, DollarSign, GripVertical,
    UploadCloud, FileText, Loader2, X
} from 'lucide-react';
import CandidateModal from './CandidateModal';
import AIInsightsPanel from './AIInsightsPanel';
import { useRecruit } from '../contexts/RecruitContext';

const PipelineBoard: React.FC = () => {
    // Use Global State
    const { candidates, updateCandidateStage, addCandidate } = useRecruit();

    const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Filter States
    const [filterText, setFilterText] = useState('');
    const [onlyMyCandidates, setOnlyMyCandidates] = useState(false);
    const [showStaleOnly, setShowStaleOnly] = useState(false);
    const [sortBy, setSortBy] = useState<'date' | 'value' | 'probability'>('date');

    // Add Candidate Form State
    const [isParsing, setIsParsing] = useState(false);
    const [parseSuccess, setParseSuccess] = useState(false);
    const [newCandName, setNewCandName] = useState('');
    const [newCandRole, setNewCandRole] = useState('');
    const [newCandClient, setNewCandClient] = useState('');

    // Drag & Drop Handlers
    const handleDragStart = (e: React.DragEvent, candidateId: string) => {
        e.dataTransfer.setData("candidateId", candidateId);
        e.dataTransfer.effectAllowed = "move";
        setDraggedCandidateId(candidateId);
    };

    const handleDrop = (e: React.DragEvent, stageId: StageId) => {
        e.preventDefault();
        const candidateId = e.dataTransfer.getData("candidateId");
        if (candidateId) {
            updateCandidateStage(candidateId, stageId);
        }
        setDraggedCandidateId(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    // Logic & Calculations
    const filteredCandidates = useMemo(() => {
        let result = candidates.filter(c => {
            const matchesText = c.name.toLowerCase().includes(filterText.toLowerCase()) || c.client.toLowerCase().includes(filterText.toLowerCase());
            const matchesOwner = onlyMyCandidates ? c.owner === 'Priya Sharma' : true;
            const matchesStale = showStaleOnly ? c.daysInStage > 5 : true;
            return matchesText && matchesOwner && matchesStale;
        });

        // Sorting
        return result.sort((a, b) => {
            if (sortBy === 'value') return b.estimatedFee - a.estimatedFee;
            if (sortBy === 'probability') return b.probability - a.probability;
            return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(); // Default 'date'
        });
    }, [candidates, filterText, onlyMyCandidates, showStaleOnly, sortBy]);

    const getStageMetrics = (stageId: string) => {
        const stageCands = filteredCandidates.filter(c => c.stage === stageId);
        const totalValue = stageCands.reduce((sum, c) => sum + c.estimatedFee, 0);
        const weightedValue = stageCands.reduce((sum, c) => sum + (c.estimatedFee * (c.probability / 100)), 0);
        return { count: stageCands.length, totalValue, weightedValue };
    };

    const getUrgencyStyles = (days: number) => {
        if (days >= 7) return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', icon: 'text-rose-500', label: 'Critical' };
        if (days >= 4) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', icon: 'text-amber-500', label: 'Stale' };
        return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', icon: 'text-slate-400', label: 'On Track' };
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 2, notation: "compact" }).format(amount);
    }

    // --- Resume Parsing Simulation ---
    const simulateFileUpload = () => {
        setIsParsing(true);
        setTimeout(() => {
            setIsParsing(false);
            setParseSuccess(true);
            // Mock Extracted Data
            setNewCandName("Emily Stone");
            setNewCandRole("Senior UX Designer");
            setNewCandClient("TechFlow");
        }, 2000);
    };

    const handleCreateCandidate = () => {
        const newCand: Candidate = {
            id: `c-${Date.now()}`,
            name: newCandName,
            role: newCandRole,
            client: newCandClient,
            stage: 'req_received',
            daysInStage: 0,
            lastUpdated: new Date().toISOString().split('T')[0],
            avatar: `https://ui-avatars.com/api/?name=${newCandName}&background=random`,
            email: `${newCandName.toLowerCase().replace(' ', '.')}@gmail.com`,
            phone: '',
            expectedSalary: 0,
            estimatedFee: 0,
            probability: 10,
            tags: ['Parsed'],
            owner: 'Priya Sharma',
            history: [{ stage: 'Req Received', date: new Date().toISOString().split('T')[0], notes: 'Imported via Resume Parser', actor: 'System' }]
        };
        addCandidate(newCand);
        setShowAddModal(false);
        // Reset
        setParseSuccess(false);
        setNewCandName('');
        setNewCandRole('');
        setNewCandClient('');
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col animate-fade-in">
            {/* 1. Enhanced Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">

                {/* Left: Title & Quick Toggles */}
                <div className="flex items-center gap-6">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        Pipeline
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                            {filteredCandidates.length}
                        </span>
                    </h2>
                    <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setOnlyMyCandidates(!onlyMyCandidates)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${onlyMyCandidates ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            Only My Deals
                        </button>
                        <button
                            onClick={() => setShowStaleOnly(!showStaleOnly)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${showStaleOnly ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            <AlertCircle size={14} className="inline mr-1 mb-0.5" />
                            Stale {'>'} 5 days
                        </button>
                    </div>
                </div>

                {/* Right: Search & View Controls */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search candidate, role, or client..."
                            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative group">
                        <button className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-xs font-bold shadow-sm">
                            <ArrowUpDown size={14} /> Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                        </button>
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 hidden group-hover:block z-50">
                            {['date', 'value', 'probability'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setSortBy(opt as any)}
                                    className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 font-medium capitalize first:rounded-t-lg last:rounded-b-lg"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={16} /> Add Candidate
                    </button>
                </div>
            </div>

            {/* 2. The Board */}
            <div className="flex-1 overflow-x-auto pipeline-scroll pb-4 -mx-4 px-4">
                <div className="flex gap-4 min-w-[max-content] h-full">
                    {PIPELINE_STAGES.map((stage) => {
                        const stageCandidates = filteredCandidates.filter(c => c.stage === stage.id);
                        const { weightedValue } = getStageMetrics(stage.id);

                        return (
                            <div
                                key={stage.id}
                                className="w-[320px] flex-shrink-0 flex flex-col h-full rounded-2xl bg-slate-50/50 border border-slate-200/60"
                                onDrop={(e) => handleDrop(e, stage.id)}
                                onDragOver={handleDragOver}
                            >
                                {/* Column Header */}
                                <div className={`p-4 rounded-t-2xl border-b border-slate-200 bg-white sticky top-0 z-10`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`}></span>
                                            <span className="font-bold text-slate-800 text-sm">{stage.label}</span>
                                        </div>
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">
                                            {stageCandidates.length}
                                        </span>
                                    </div>

                                    {/* Financial Summary */}
                                    {weightedValue > 0 && (
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Weighted Value</span>
                                            <span className="text-xs font-bold text-slate-700">{formatCurrency(weightedValue)}</span>
                                        </div>
                                    )}

                                    {/* Progress Bar (Visual capacity) */}
                                    <div className="w-full bg-slate-100 h-1 mt-3 rounded-full overflow-hidden">
                                        <div className={`h-full ${stage.color} opacity-50`} style={{ width: `${Math.min((stageCandidates.length / 5) * 100, 100)}%` }}></div>
                                    </div>
                                </div>

                                {/* Candidate List */}
                                <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar">
                                    {stageCandidates.map((candidate) => {
                                        const urgency = getUrgencyStyles(candidate.daysInStage);
                                        return (
                                            <div
                                                key={candidate.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, candidate.id)}
                                                onClick={() => setSelectedCandidate(candidate)}
                                                className={`
                            group relative bg-white p-3 rounded-xl border border-slate-200 shadow-sm 
                            hover:shadow-lg hover:border-indigo-300 hover:-translate-y-1 
                            cursor-grab active:cursor-grabbing transition-all duration-200
                            ${draggedCandidateId === candidate.id ? 'opacity-40 rotate-2 scale-95' : ''}
                        `}
                                            >
                                                {/* Hover Quick Actions */}
                                                <div className="absolute right-2 top-2 hidden group-hover:flex gap-1 z-20">
                                                    <button onClick={(e) => e.stopPropagation()} className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-colors" title="Email">
                                                        <Mail size={12} />
                                                    </button>
                                                    <button onClick={(e) => e.stopPropagation()} className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-colors" title="Schedule">
                                                        <Calendar size={12} />
                                                    </button>
                                                    <button onClick={(e) => e.stopPropagation()} className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-rose-600 hover:border-rose-200 shadow-sm transition-colors" title="Reject">
                                                        <XCircle size={12} />
                                                    </button>
                                                </div>

                                                {/* Card Header: Client & Probability */}
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                                        {candidate.client}
                                                    </div>
                                                    {candidate.probability > 0 && (
                                                        <div className={`text-[10px] font-bold ${candidate.probability > 70 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                            {candidate.probability}%
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Main Info */}
                                                <div className="flex items-start gap-3 mb-3">
                                                    <img src={candidate.avatar} alt="avatar" className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm object-cover bg-slate-100" />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-sm text-slate-800 truncate leading-tight group-hover:text-indigo-700 transition-colors">{candidate.name}</h4>
                                                        <div className="text-xs text-slate-500 truncate mt-0.5">{candidate.role}</div>
                                                    </div>
                                                </div>

                                                {/* Footer Metrics */}
                                                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                                                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${urgency.bg} ${urgency.text}`}>
                                                        <Clock size={10} />
                                                        {candidate.daysInStage}d
                                                    </div>

                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
                                                        <DollarSign size={10} className="text-slate-400" />
                                                        {formatCurrency(candidate.estimatedFee)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Candidate Modal - SMART IMPORT */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
                        <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>

                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Add New Candidate</h3>
                            <p className="text-sm text-slate-500">Import via resume or add manually</p>
                        </div>

                        {!parseSuccess ? (
                            <div
                                onClick={simulateFileUpload}
                                className={`border-2 border-dashed rounded-xl p-8 mb-6 flex flex-col items-center justify-center transition-all cursor-pointer group ${isParsing ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}`}
                            >
                                {isParsing ? (
                                    <>
                                        <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
                                        <p className="font-bold text-indigo-700">Analyzing Resume...</p>
                                        <p className="text-xs text-indigo-500">Extracting skills, contact info, and role</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-white group-hover:shadow-md transition-all">
                                            <UploadCloud size={32} className="text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                        <p className="font-bold text-slate-700">Drag & Drop Resume (PDF)</p>
                                        <p className="text-xs text-slate-500 mt-1">or click to browse local files</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                                <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={20} />
                                <div>
                                    <p className="font-bold text-emerald-800 text-sm">Resume Parsed Successfully!</p>
                                    <p className="text-xs text-emerald-600">We extracted the details below automatically.</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={(e) => { e.preventDefault(); handleCreateCandidate(); }} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    value={newCandName}
                                    onChange={e => setNewCandName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        value={newCandRole}
                                        onChange={e => setNewCandRole(e.target.value)}
                                        placeholder="e.g. Developer"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Client</label>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        value={newCandClient}
                                        onChange={e => setNewCandClient(e.target.value)}
                                        placeholder="e.g. TechFlow"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 transition-all">
                                    {parseSuccess ? 'Confirm & Create Candidate' : 'Create Manually'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedCandidate && (
                <CandidateModal
                    candidate={selectedCandidate}
                    onClose={() => setSelectedCandidate(null)}
                />
            )}

            {/* AI Insights Panel */}
            <AIInsightsPanel candidates={filteredCandidates} />
        </div>
    );
};

export default PipelineBoard;
