import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, TrendingUp, X } from 'lucide-react';
import { detectBottlenecks, getSmartPrioritization, BottleneckInsight } from '../services/aiInsights';
import { Candidate } from '../types';

interface AIInsightsPanelProps {
    candidates: Candidate[];
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ candidates }) => {
    const [bottlenecks, setBottlenecks] = useState<BottleneckInsight[]>([]);
    const [recommendations, setRecommendations] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        analyzePipeline();
    }, [candidates]);

    const analyzePipeline = async () => {
        setLoading(true);
        try {
            const bottleneckData = await detectBottlenecks(candidates);
            setBottlenecks(bottleneckData);

            const recs = await getSmartPrioritization(candidates);
            setRecommendations(recs);
        } catch (error) {
            console.error('AI analysis failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        if (severity === 'high') return 'bg-rose-50 border-rose-200 text-rose-700';
        if (severity === 'medium') return 'bg-amber-50 border-amber-200 text-amber-700';
        return 'bg-slate-50 border-slate-200 text-slate-700';
    };

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed bottom-6 right-6 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-2xl hover:shadow-violet-300 transition-all flex items-center gap-2 z-50"
            >
                <Sparkles size={18} className="animate-pulse" />
                <span className="font-semibold">AI Insights</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles size={20} />
                    <h3 className="font-bold">AI Pipeline Insights</h3>
                </div>
                <button onClick={() => setIsExpanded(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Bottlenecks */}
                        {bottlenecks.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle size={16} className="text-amber-600" />
                                    <h4 className="font-semibold text-slate-900">Detected Bottlenecks</h4>
                                </div>
                                <div className="space-y-2">
                                    {bottlenecks.map((bottleneck, index) => (
                                        <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(bottleneck.severity)}`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-sm capitalize">{bottleneck.stage.replace('_', ' ')}</span>
                                                <span className="text-xs font-bold uppercase">{bottleneck.severity}</span>
                                            </div>
                                            <div className="text-xs mb-2">
                                                {bottleneck.affectedCandidates} candidates • {bottleneck.avgDays}d avg
                                            </div>
                                            <p className="text-xs">{bottleneck.recommendation}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recommendations */}
                        {recommendations && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp size={16} className="text-indigo-600" />
                                    <h4 className="font-semibold text-slate-900">Smart Recommendations</h4>
                                </div>
                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                                    <p className="text-sm text-indigo-900 leading-relaxed whitespace-pre-line">{recommendations}</p>
                                </div>
                            </div>
                        )}

                        {/* Refresh Button */}
                        <button
                            onClick={analyzePipeline}
                            className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Refresh Analysis
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AIInsightsPanel;
