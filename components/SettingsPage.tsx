
import React from 'react';
import { ToggleLeft, UserPlus, CreditCard, Bell, Shield } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const SettingSection = ({ title, icon, children }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-10">
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Platform Configuration</h2>

      <SettingSection title="Team Management" icon={<UserPlus size={20}/>}>
        <div className="flex justify-between items-center">
            <div>
                <div className="font-semibold text-slate-800">Allow Invitation Links</div>
                <div className="text-sm text-slate-500">Team members can invite others via link</div>
            </div>
            <ToggleLeft size={40} className="text-emerald-500 cursor-pointer" />
        </div>
        <div className="flex justify-between items-center">
            <div>
                <div className="font-semibold text-slate-800">Auto-assign new candidates</div>
                <div className="text-sm text-slate-500">Round-robin assignment for sourced profiles</div>
            </div>
            <ToggleLeft size={40} className="text-slate-300 cursor-pointer" />
        </div>
      </SettingSection>

      <SettingSection title="Billing & Usage" icon={<CreditCard size={20}/>}>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Plan</div>
                <div className="text-xl font-bold text-indigo-900">Enterprise Tier</div>
            </div>
            <button className="px-4 py-2 bg-white border border-slate-300 shadow-sm rounded-lg text-sm font-medium hover:bg-slate-50">Manage Subscription</button>
        </div>
        <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">AI Token Usage</span>
                <span className="text-slate-500">75,000 / 100,000</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full w-3/4"></div>
            </div>
        </div>
      </SettingSection>

       <SettingSection title="Notifications" icon={<Bell size={20}/>}>
         <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" defaultChecked />
                <span className="text-sm font-medium text-slate-700">Email Alerts</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" defaultChecked />
                <span className="text-sm font-medium text-slate-700">Browser Push</span>
            </label>
             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Slack Integration</span>
            </label>
         </div>
      </SettingSection>
    </div>
  );
};

export default SettingsPage;
