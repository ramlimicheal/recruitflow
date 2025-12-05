import { generateText } from './geminiService';
import { Candidate } from '../types';

/**
 * AI Insights Service
 * Provides intelligent analysis for recruitment pipeline
 */

export interface BottleneckInsight {
    stage: string;
    severity: 'low' | 'medium' | 'high';
    avgDays: number;
    affectedCandidates: number;
    recommendation: string;
}

export interface DealScore {
    candidateId: string;
    score: number; // 0-100
    confidence: 'low' | 'medium' | 'high';
    factors: string[];
    recommendation: string;
}

/**
 * Detect bottlenecks in the recruitment pipeline
 */
export const detectBottlenecks = async (candidates: Candidate[]): Promise<BottleneckInsight[]> => {
    // Group candidates by stage
    const stageGroups: { [key: string]: Candidate[] } = {};
    candidates.forEach(candidate => {
        if (!stageGroups[candidate.stage]) {
            stageGroups[candidate.stage] = [];
        }
        stageGroups[candidate.stage].push(candidate);
    });

    const insights: BottleneckInsight[] = [];

    // Analyze each stage
    for (const [stage, stageCandidates] of Object.entries(stageGroups)) {
        const avgDays = stageCandidates.reduce((sum, c) => sum + c.daysInStage, 0) / stageCandidates.length;

        let severity: 'low' | 'medium' | 'high' = 'low';
        if (avgDays > 7) severity = 'high';
        else if (avgDays > 4) severity = 'medium';

        if (severity !== 'low' || stageCandidates.length > 5) {
            insights.push({
                stage,
                severity,
                avgDays: Math.round(avgDays),
                affectedCandidates: stageCandidates.length,
                recommendation: generateRecommendation(stage, avgDays, stageCandidates.length)
            });
        }
    }

    return insights.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
    });
};

/**
 * Score a deal's probability of success
 */
export const scoreDeal = (candidate: Candidate): DealScore => {
    let score = 50; // Base score
    const factors: string[] = [];

    // Factor 1: Stage progression
    const stageScores: { [key: string]: number } = {
        'req_received': 10,
        'jd_analysis': 15,
        'sourcing': 20,
        'profiles_shared': 30,
        'client_feedback': 40,
        'interview_scheduled': 60,
        'interview_completed': 70,
        'interview_feedback': 75,
        'doc_collection': 80,
        'salary_neg': 85,
        'offer_pending': 90,
        'offer_received': 95,
        'joining_confirmed': 98
    };

    const stageScore = stageScores[candidate.stage] || 10;
    score = stageScore;
    factors.push(`Stage: ${candidate.stage} (${stageScore}pts)`);

    // Factor 2: Time in stage (penalty for delays)
    if (candidate.daysInStage > 7) {
        score -= 15;
        factors.push('Delayed in stage (-15pts)');
    } else if (candidate.daysInStage < 3) {
        score += 5;
        factors.push('Moving quickly (+5pts)');
    }

    // Factor 3: Estimated fee (higher value = more attention)
    if (candidate.estimatedFee > 50000) {
        score += 10;
        factors.push('High-value deal (+10pts)');
    }

    // Factor 4: Existing probability
    if (candidate.probability > 70) {
        score += 10;
        factors.push('High client interest (+10pts)');
    } else if (candidate.probability < 30) {
        score -= 10;
        factors.push('Low client interest (-10pts)');
    }

    // Clamp score between 0-100
    score = Math.max(0, Math.min(100, score));

    // Determine confidence
    let confidence: 'low' | 'medium' | 'high' = 'medium';
    if (candidate.history && candidate.history.length > 5) {
        confidence = 'high';
    } else if (candidate.history && candidate.history.length < 2) {
        confidence = 'low';
    }

    // Generate recommendation
    let recommendation = '';
    if (score > 75) {
        recommendation = 'High priority - focus on closing this deal';
    } else if (score > 50) {
        recommendation = 'Medium priority - maintain momentum';
    } else {
        recommendation = 'Low priority - consider deprioritizing';
    }

    return {
        candidateId: candidate.id,
        score: Math.round(score),
        confidence,
        factors,
        recommendation
    };
};

/**
 * Get smart prioritization recommendations
 */
export const getSmartPrioritization = async (candidates: Candidate[]): Promise<string> => {
    const scores = candidates.map(c => scoreDeal(c));
    const topDeals = scores.filter(s => s.score > 70).length;
    const stalledDeals = candidates.filter(c => c.daysInStage > 7).length;

    const prompt = `As a recruitment AI assistant, analyze this pipeline:
- Total active candidates: ${candidates.length}
- High-priority deals (score > 70): ${topDeals}
- Stalled deals (>7 days in stage): ${stalledDeals}

Provide 3 specific, actionable recommendations to improve pipeline efficiency. Be concise and direct.`;

    try {
        const insights = await generateText(prompt);
        return insights;
    } catch (error) {
        return `Focus on the ${topDeals} high-priority deals and address the ${stalledDeals} stalled candidates.`;
    }
};

/**
 * Helper function to generate stage-specific recommendations
 */
function generateRecommendation(stage: string, avgDays: number, count: number): string {
    if (avgDays > 7) {
        return `Critical: ${count} candidates stuck for ${avgDays} days. Immediate action required.`;
    } else if (avgDays > 4) {
        return `Warning: ${count} candidates moving slowly. Review and accelerate.`;
    } else if (count > 5) {
        return `High volume: ${count} candidates in this stage. Consider resource allocation.`;
    }
    return `${count} candidates progressing normally.`;
}

export default {
    detectBottlenecks,
    scoreDeal,
    getSmartPrioritization
};
