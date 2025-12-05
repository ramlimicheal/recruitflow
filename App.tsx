
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import PipelineBoard from './components/PipelineBoard';
import TaskList from './components/TaskList';
import ClientHealth from './components/ClientHealth';
import InterviewBoard from './components/InterviewBoard';
import PositionManager from './components/PositionManager';
import DocumentVault from './components/DocumentVault';
import SettingsPage from './components/SettingsPage';
import ActivityFeed from './components/ActivityFeed';
import LoginPage from './LoginPage';
import { ViewState } from './types';
import { RecruitProvider } from './contexts/RecruitContext';

import ChatPanel from './components/Chat/ChatPanel';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (token: string, userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Loading RecruitFlow...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'pipeline': return <PipelineBoard />;
      case 'tasks': return <TaskList />;
      case 'clients': return <ClientHealth />;
      case 'interviews': return <InterviewBoard />;
      case 'positions': return <PositionManager />;
      case 'documents': return <DocumentVault />;
      case 'settings': return <SettingsPage />;
      case 'activity': return <ActivityFeed />;
      default: return <Dashboard />;
    }
  };

  return (
    <RecruitProvider user={user} onLogout={handleLogout}>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />

        <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
          <TopBar
            user={user}
            onLogout={handleLogout}
            onChatToggle={() => setIsChatOpen(!isChatOpen)}
          />
          <main className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
            {renderView()}
          </main>

          {/* Chat Panel */}
          <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
      </div>
    </RecruitProvider>
  );
};

export default App;
