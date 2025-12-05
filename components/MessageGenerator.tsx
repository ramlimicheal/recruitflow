import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { X, Sparkles, Copy, Send } from 'lucide-react';
import { generateClientMessage } from '../services/geminiService';

interface Props {
  client: Client;
  onClose: () => void;
}

const MessageGenerator: React.FC<Props> = ({ client, onClose }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDraft = async () => {
      const type = client.status === 'Dormant' || client.status === 'Cold' ? 'check-in' : 'update';
      const text = await generateClientMessage(client, type);
      setContent(text);
      setLoading(false);
    };
    fetchDraft();
  }, [client]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="text-violet-600" size={20} />
            <h3 className="font-bold text-slate-800">AI Draft: {client.name}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 text-sm">Gemini is drafting your message...</p>
            </div>
          ) : (
            <textarea
              className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700 leading-relaxed resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={() => { navigator.clipboard.writeText(content); }}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
          >
            <Copy size={18} /> Copy
          </button>
          <button 
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow transition-all font-medium"
          >
            <Send size={18} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageGenerator;