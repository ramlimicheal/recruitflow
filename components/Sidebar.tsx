
import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Kanban, CheckSquare, Users, Calendar, Settings, Zap, LogOut, Briefcase, FolderOpen, Activity } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems: { view: ViewState; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { view: 'pipeline', label: 'Pipeline', icon: <Kanban size={18} /> },
    { view: 'positions', label: 'Positions (ATS)', icon: <Briefcase size={18} /> },
    { view: 'tasks', label: 'Tasks', icon: <CheckSquare size={18} /> },
    { view: 'interviews', label: 'Interviews', icon: <Calendar size={18} /> },
    { view: 'clients', label: 'Clients', icon: <Users size={18} /> },
    { view: 'documents', label: 'Document Vault', icon: <FolderOpen size={18} /> },
    { view: 'activity', label: 'Activity Feed', icon: <Activity size={18} /> },
  ];

  return (
    <div className="w-64 bg-[#0f172a] text-slate-300 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-50">
      {/* Brand */}
      <div className="p-6 pb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-900/50">
            R
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            RecruitFlow
          </h1>
        </div>
        <p className="text-[10px] text-slate-500 font-medium pl-10 uppercase tracking-widest">Enterprise</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-2">Core Modules</div>
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${currentView === item.view
                ? 'bg-slate-800 text-white shadow-inner'
                : 'hover:bg-slate-800/50 hover:text-white'
              }`}
          >
            {currentView === item.view && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-full"></div>
            )}
            <span className={`${currentView === item.view ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'}`}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}

        <div className="mt-8">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Platform</div>
          <button
            onClick={() => onViewChange('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}>
            <Settings size={18} />
            <span>Configuration</span>
          </button>
        </div>
      </nav>

      {/* Upgrade Callout - Enterprise Style */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-gradient-to-br from-indigo-950 to-violet-950 border border-indigo-500/20 shadow-lg">
        <div className="flex items-center gap-2 text-white mb-2">
          <Zap size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold tracking-wide">ENTERPRISE TIER</span>
        </div>
        <div className="w-full bg-indigo-900/50 rounded-full h-1.5 mb-2">
          <div className="bg-gradient-to-r from-indigo-400 to-violet-400 h-1.5 rounded-full w-[75%]"></div>
        </div>
        <p className="text-[10px] text-indigo-200 leading-tight mb-3">75% of monthly tokens used.</p>
        <button className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wide rounded transition-colors">
          Manage Limits
        </button>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>v2.4.0 (Pro)</span>
          <button className="hover:text-slate-300"><LogOut size={14} /></button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
