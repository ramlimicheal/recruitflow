import React, { useState, useRef } from 'react';
import { Send, Paperclip, AtSign } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (text: string, mentions?: string[]) => void;
    disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
    const [message, setMessage] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [mentionSearch, setMentionSearch] = useState('');
    const [mentions, setMentions] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Mock users for @mention
    const mockUsers = [
        { id: '1', name: 'Priya Sharma' },
        { id: '2', name: 'Rahul Verma' },
        { id: '3', name: 'Anjali Patel' },
        { id: '4', name: 'Vikram Singh' }
    ];

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message, mentions);
            setMessage('');
            setMentions([]);
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setMessage(value);

        // Auto-resize
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;

        // Check for @ mention trigger
        const lastWord = value.split(' ').pop() || '';
        if (lastWord.startsWith('@')) {
            setShowMentions(true);
            setMentionSearch(lastWord.substring(1));
        } else {
            setShowMentions(false);
        }
    };

    const handleMentionSelect = (userName: string) => {
        const words = message.split(' ');
        words[words.length - 1] = `@${userName}`;
        setMessage(words.join(' ') + ' ');
        setShowMentions(false);
        setMentions([...mentions, userName]);
        textareaRef.current?.focus();
    };

    const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(mentionSearch.toLowerCase())
    );

    return (
        <div className="p-4 border-t border-slate-200 bg-white relative">
            {/* Mention Suggestions */}
            {showMentions && filteredUsers.length > 0 && (
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
                    {filteredUsers.map(user => (
                        <button
                            key={user.id}
                            onClick={() => handleMentionSelect(user.name)}
                            className="w-full px-4 py-2 text-left hover:bg-indigo-50 flex items-center gap-2 text-sm"
                        >
                            <AtSign size={14} className="text-indigo-500" />
                            <span className="font-medium text-slate-700">{user.name}</span>
                        </button>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="relative">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message... (use @ to mention)"
                    disabled={disabled}
                    rows={1}
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none max-h-32 text-sm"
                    style={{ minHeight: '44px' }}
                />

                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <button
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Attach file"
                    >
                        <Paperclip size={18} />
                    </button>
                    <button
                        type="submit"
                        disabled={!message.trim() || disabled}
                        className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;
