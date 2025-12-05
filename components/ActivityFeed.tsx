import React, { useState, useEffect } from 'react';
import { Activity, Filter, Search, MessageSquare, UserPlus, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { activityAPI } from '../services/api';
import { format } from 'date-fns';

interface ActivityItem {
    id: number;
    action_type: string;
    entity_type: string;
    entity_id: number;
    performed_by_id: number;
    description: string;
    created_at: string;
    performer_name?: string;
}

const ActivityFeed: React.FC = () => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('All');
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            const data = await activityAPI.getAll();
            setActivities(data);
        } catch (err) {
            console.error('Failed to load activities:', err);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'candidate_moved':
            case 'candidate_created':
                return <UserPlus size={16} className="text-indigo-500" />;
            case 'task_created':
            case 'task_completed':
                return <CheckCircle size={16} className="text-emerald-500" />;
            case 'interview_scheduled':
                return <Clock size={16} className="text-amber-500" />;
            case 'comment_added':
                return <MessageSquare size={16} className="text-violet-500" />;
            default:
                return <Activity size={16} className="text-slate-500" />;
        }
    };

    const filteredActivities = activities.filter(activity => {
        const matchesType = filterType === 'All' || activity.entity_type === filterType;
        const matchesSearch = activity.description.toLowerCase().includes(searchText.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <div className="max-w-5xl mx-auto h-full animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-end mb-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Activity size={28} className="text-indigo-600" />
                        Activity Feed
                    </h2>
                    <p className="text-slate-500 mt-1">Real-time updates across your recruitment pipeline</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Filter Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {['All', 'candidate', 'task', 'interview'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${filterType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search activities..."
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>

            {/* Activity List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-slate-500">Loading activities...</p>
                    </div>
                ) : filteredActivities.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Activity size={48} className="mx-auto mb-3 text-slate-300" />
                        <p className="font-medium">No activities found</p>
                        <p className="text-sm mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredActivities.map((activity) => (
                            <div key={activity.id} className="p-5 hover:bg-slate-50 transition-colors group">
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                                        {getActivityIcon(activity.action_type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800 leading-relaxed">
                                            {activity.description}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs text-slate-500">
                                                {format(new Date(activity.created_at), 'MMM d, yyyy • h:mm a')}
                                            </span>
                                            {activity.entity_type && (
                                                <>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    <span className="text-xs text-slate-400 capitalize">{activity.entity_type}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Badge */}
                                    <div className="flex-shrink-0">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium capitalize">
                                            {activity.action_type.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
