
import React, { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, MessageSquare } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../constants';

interface TopBarProps {
  user?: any;
  onLogout?: () => void;
  onChatToggle?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, onLogout, onChatToggle }) => {
  const [showMenu, setShowMenu] = useState(false);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
      {/* Search Bar - Global Command Center */}
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all shadow-inner"
            placeholder="Search candidates, clients, or jobs..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-slate-400 text-xs border border-slate-200 rounded px-1.5 py-0.5 shadow-sm">⌘K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative cursor-pointer group">
          <div className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 group-hover:text-slate-800 transition-colors">
            <Bell size={20} />
          </div>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
          )}
        </div>

        {/* Chat Toggle */}
        <button
          onClick={onChatToggle}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors relative"
          title="Team Chat"
        >
          <MessageSquare size={20} />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile with Dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setShowMenu(!showMenu)}>
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-sm">
              <div className="font-semibold text-slate-700">{user?.name}</div>
              <div className="text-xs text-slate-500">{user?.role}</div>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </div>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-1">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  onLogout?.();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
