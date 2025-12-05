import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';

interface Message {
    id: number;
    message_text: string;
    sender_id: number;
    sender_name: string;
    sender_avatar?: string;
    created_at: string;
    is_system?: boolean;
}

interface MessageListProps {
    messages: Message[];
    currentUserId: number;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs">Start the conversation!</p>
                </div>
            ) : (
                messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId;

                    return (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {msg.sender_avatar ? (
                                    <img
                                        src={msg.sender_avatar}
                                        alt={msg.sender_name}
                                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                    />
                                ) : (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${isMe ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                                        {msg.sender_name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs font-medium text-slate-700">{msg.sender_name}</span>
                                    <span className="text-[10px] text-slate-400">
                                        {format(new Date(msg.created_at), 'h:mm a')}
                                    </span>
                                </div>
                                <div
                                    className={`px-4 py-2 rounded-2xl text-sm ${isMe
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                                        }`}
                                >
                                    {msg.message_text}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={bottomRef} />
        </div>
    );
};

export default MessageList;
