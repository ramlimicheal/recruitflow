import React, { useState, useEffect } from 'react';
import { X, Hash, User, Plus } from 'lucide-react';
import { chatAPI } from '../../services/api';
import { useRecruit } from '../../contexts/RecruitContext';
import ChatInput from './ChatInput';
import MessageList from './MessageList';

interface ChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Channel {
    id: number;
    name: string;
    channel_type: 'team' | 'direct';
    description?: string;
}

interface Message {
    id: number;
    message_text: string;
    sender_id: number;
    sender_name: string;
    sender_avatar?: string;
    created_at: string;
    channel_id: number;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
    const { user, socket } = useRecruit();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch channels on mount
    useEffect(() => {
        if (isOpen) {
            loadChannels();
        }
    }, [isOpen]);

    // Handle channel selection and message loading
    useEffect(() => {
        if (activeChannel) {
            loadMessages(activeChannel.id);

            // Join socket room
            socket?.emit('join-channel', activeChannel.id);

            return () => {
                socket?.emit('leave-channel', activeChannel.id);
            };
        }
    }, [activeChannel, socket]);

    // Listen for incoming messages
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (newMessage: Message) => {
            if (activeChannel && newMessage.channel_id === activeChannel.id) {
                setMessages(prev => [...prev, newMessage]);
            }
        };

        socket.on('message-received', handleMessage);

        return () => {
            socket.off('message-received', handleMessage);
        };
    }, [socket, activeChannel]);

    const loadChannels = async () => {
        try {
            const data = await chatAPI.getChannels();
            setChannels(data);
            if (data.length > 0 && !activeChannel) {
                setActiveChannel(data[0]);
            }
        } catch (err) {
            console.error('Failed to load channels:', err);
        }
    };

    const loadMessages = async (channelId: number) => {
        setLoading(true);
        try {
            const data = await chatAPI.getMessages(channelId.toString());
            setMessages(data);
        } catch (err) {
            console.error('Failed to load messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (text: string, mentions: string[] = []) => {
        if (!activeChannel) return;

        try {
            // Optimistic update (optional, but good for UX)
            // For now, we'll wait for server response or socket event

            // Send via API
            await chatAPI.sendMessage(activeChannel.id.toString(), text, mentions);

            // Note: We don't manually add to messages here because the socket event 
            // will trigger and add it. This prevents duplicates.
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out z-50 flex flex-col">
            {/* Header */}
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4 bg-white">
                <h2 className="font-semibold text-slate-800">Team Chat</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Channel List (Horizontal for compactness, or a dropdown could work too) */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 overflow-x-auto flex gap-2 no-scrollbar">
                {channels.map(channel => (
                    <button
                        key={channel.id}
                        onClick={() => setActiveChannel(channel)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${activeChannel?.id === channel.id
                            ? 'bg-indigo-100 text-indigo-700 font-medium'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        {channel.channel_type === 'team' ? <Hash size={14} /> : <User size={14} />}
                        {channel.name}
                    </button>
                ))}
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-dashed border-slate-300 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-colors flex-shrink-0">
                    <Plus size={16} />
                </button>
            </div>

            {/* Channel Info */}
            {activeChannel && (
                <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                        <Hash size={16} className="text-slate-400" />
                        {activeChannel.name}
                    </div>
                    <span className="text-xs text-slate-500">{activeChannel.description}</span>
                </div>
            )}

            {/* Messages */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center bg-slate-50">
                    <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            ) : (
                <MessageList
                    messages={messages}
                    currentUserId={user?.id || 0}
                />
            )}

            {/* Input */}
            <ChatInput onSendMessage={handleSendMessage} disabled={!activeChannel} />
        </div>
    );
};

export default ChatPanel;
