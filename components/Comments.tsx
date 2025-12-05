import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { format } from 'date-fns';

interface Comment {
    id: number;
    text: string;
    author: string;
    author_avatar?: string;
    created_at: string;
}

interface CommentsProps {
    entityType: 'candidate' | 'task';
    entityId: string;
    entityName: string;
}

const Comments: React.FC<CommentsProps> = ({ entityType, entityId, entityName }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Mock data for now
    useEffect(() => {
        // In a real app, fetch comments from API
        setComments([
            {
                id: 1,
                text: 'Great progress on this one!',
                author: 'Priya Sharma',
                created_at: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: 2,
                text: 'Need to follow up tomorrow',
                author: 'Rahul Verma',
                created_at: new Date(Date.now() - 7200000).toISOString()
            }
        ]);
    }, [entityId]);

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now(),
            text: newComment,
            author: 'Current User',
            created_at: new Date().toISOString()
        };

        setComments([...comments, comment]);
        setNewComment('');
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-indigo-300 transition-colors text-sm font-medium"
            >
                <MessageSquare size={16} />
                Comments {comments.length > 0 && `(${comments.length})`}
            </button>

            {/* Comments Panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                        <div>
                            <h4 className="font-semibold text-slate-800">Comments</h4>
                            <p className="text-xs text-slate-500 truncate">{entityName}</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="max-h-80 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {comments.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No comments yet</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs flex-shrink-0">
                                        {comment.author.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-sm font-semibold text-slate-800">{comment.author}</span>
                                            <span className="text-xs text-slate-400">
                                                {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-slate-200 bg-slate-50">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Comments;
