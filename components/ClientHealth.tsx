
import React, { useState } from 'react';
import { MOCK_CLIENTS } from '../constants';
import { Client } from '../types';
import { Mail, Activity, AlertTriangle, CheckCircle, TrendingUp, DollarSign, MoreHorizontal, Briefcase } from 'lucide-react';
import MessageGenerator from './MessageGenerator';

const ClientHealth: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDraft = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      Active: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle },
      Warm: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: Activity },
      Cold: { bg: 'bg-slate-100', text: 'text-slate-600', icon: AlertTriangle },
      Dormant: { bg: 'bg-rose-100', text: 'text-rose-800', icon: AlertTriangle }
    };
    const style = config[status as keyof typeof config] || config.Cold;
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
        <Icon size={12}/> {status}
      </span>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Client Portfolio</h2>
          <p className="text-slate-500 mt-1">Monitor account health, revenue, and engagement risks.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
            + New Client
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_CLIENTS.map((client) => (
          <div key={client.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <img src={client.logo} alt={client.name} className="w-12 h-12 rounded-lg object-contain border border-slate-100 bg-slate-50 p-1" onError={(e) => {e.currentTarget.src = `https://ui-avatars.com/api/?name=${client.name}&background=random`}} />
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight">{client.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{client.industry}</p>
                    </div>
                </div>
                <button className="text-slate-300 hover:text-slate-600">
                    <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase">Revenue</div>
                    <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1">
                        <DollarSign size={12} className="text-emerald-500" />
                        {client.totalRevenue.toLocaleString()}
                    </div>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase">Open Roles</div>
                    <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1">
                        <Briefcase size={12} className="text-indigo-500" />
                        {client.openPositions}
                    </div>
                 </div>
              </div>

              {/* Health Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-600">Engagement Score</span>
                  <span className={`font-bold ${client.healthScore > 70 ? 'text-emerald-600' : 'text-rose-600'}`}>{client.healthScore}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${client.healthScore > 70 ? 'bg-emerald-500' : client.healthScore > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                    style={{ width: `${client.healthScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 mb-6 font-medium">
                  <span>Last: {client.lastContact}</span>
                  <span>Owner: {client.accountManager.split(' ')[0]}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-slate-50">
               {getStatusBadge(client.status)}
               <button 
                onClick={() => handleOpenDraft(client)}
                className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                title="Draft Email"
               >
                 <Mail size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedClient && (
        <MessageGenerator 
          client={selectedClient!} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default ClientHealth;
