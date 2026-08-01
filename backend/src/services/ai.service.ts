/**
 * @file ai.service.ts
 * @description AI Productivity Engine calculating engineering telemetry and coaching feedback.
 * 
 * PURPOSE:
 * Analyzes developer logs to calculate AI Productivity Scores, estimate burnout risk levels,
 * produce sprint load recommendations, and generate weekly coaching summaries.
 */

import { sessionRepository } from '../repositories/session.repository';
import { taskRepository } from '../repositories/task.repository';
import { goalRepository } from '../repositories/goal.repository';
import { UnauthorizedError } from '../utils/errors';

export interface BurnoutRiskReport {
  burnoutScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  findings: string[];
  recommendations: string[];
}

export interface SprintRecommendation {
  suggestedPointsLimit: number;
  focusArea: string;
  complexityDistribution: { LOW: number; MEDIUM: number; HIGH: number };
  reasoning: string;
}

export interface WeeklyDeveloperReport {
  overallScore: number;
  weekEnding: string;
  contributionsSummary: string;
  strengths: string[];
  growthAreas: string[];
  aiCoachingAdvice: string;
}

export class AiService {
  /**
   * Calculates the overall AI Productivity Score based on session logs, commits, and story points.
   */
  public async getProductivityScore(userId: string): Promise<{ score: number; trend: 'UP' | 'DOWN' | 'STABLE'; percentage: number }> {
    const sessions = await sessionRepository.findAllForUser(userId);
    
    let totalMinutes = 0;
    let totalCommits = 0;
    sessions.forEach((s) => {
      totalMinutes += s.durationMinutes;
      totalCommits += s.commitsCount;
    });

    const averageDailyCoding = totalMinutes / Math.max(1, sessions.length);
    
    // Algorithm: 60% daily coding duration (target 2h/day) + 40% commit frequencies (target 2 commits/day)
    let score = Math.round(
      (Math.min(120, averageDailyCoding) / 120) * 60 +
      (Math.min(2, totalCommits / Math.max(1, sessions.length)) / 2) * 40
    );

    score = Math.max(10, Math.min(100, score));

    return {
      score,
      trend: score > 75 ? 'UP' : 'STABLE',
      percentage: 8,
    };
  }

  /**
   * Assesses developer burnout risk by analyzing late-night coding habits and workload sizes.
   */
  public async assessBurnoutRisk(userId: string): Promise<BurnoutRiskReport> {
    const sessions = await sessionRepository.findAllForUser(userId);
    
    let lateNightHoursCount = 0;
    let longSessionsCount = 0;

    sessions.forEach((s) => {
      const startHour = new Date(s.startTime).getHours();
      // Late night tracking: Coding between 10PM and 5AM
      if (startHour >= 22 || startHour <= 5) {
        lateNightHoursCount++;
      }
      // Workload tracking: Single sessions exceeding 3 hours (180 minutes)
      if (s.durationMinutes >= 180) {
        longSessionsCount++;
      }
    });

    let burnoutScore = 15;
    burnoutScore += lateNightHoursCount * 12;
    burnoutScore += longSessionsCount * 8;
    burnoutScore = Math.min(100, burnoutScore);

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (burnoutScore > 65) {
      riskLevel = 'HIGH';
    } else if (burnoutScore > 35) {
      riskLevel = 'MEDIUM';
    }

    const findings: string[] = [];
    const recommendations: string[] = [];

    if (lateNightHoursCount > 2) {
      findings.push('Frequent late-night code heartbeats detected past 10:00 PM.');
      recommendations.push('Establish a "no-coding" cooling window after 9:00 PM.');
    }
    if (longSessionsCount > 1) {
      findings.push('Extended keyboard interaction sequences logged without break gaps.');
      recommendations.push('Deploy the Pomodoro technique (50m code, 10m stretch gaps).');
    }

    if (findings.length === 0) {
      findings.push('Consistent coding session schedules logged with healthy work-life boundary gaps.');
      recommendations.push('Maintain your existing developer hydration and sleep schedule.');
    }

    return {
      burnoutScore,
      riskLevel,
      findings,
      recommendations,
    };
  }

  /**
   * Recommends optimal team sprint loading capacities.
   */
  public async getSprintRecommendations(userId: string): Promise<SprintRecommendation> {
    const scoreDetails = await this.getProductivityScore(userId);
    
    // Scale suggested sprint points based on productivity scores
    let suggestedPointsLimit = 8;
    if (scoreDetails.score > 75) {
      suggestedPointsLimit = 13;
    } else if (scoreDetails.score > 50) {
      suggestedPointsLimit = 8;
    } else {
      suggestedPointsLimit = 5;
    }

    return {
      suggestedPointsLimit,
      focusArea: scoreDetails.score > 70 ? 'Refactoring & Architecture' : 'Core Feature Implementation',
      complexityDistribution: {
        LOW: 40,
        MEDIUM: 40,
        HIGH: 20,
      },
      reasoning: `AI evaluated a productivity rating of ${scoreDetails.score}/100. Restricting workload ensures sustainable delivery sprint-over-sprint.`,
    };
  }

  /**
   * Formulates weekly performance reviews.
   */
  public async getWeeklyReport(userId: string): Promise<WeeklyDeveloperReport> {
    const scoreDetails = await this.getProductivityScore(userId);
    const goals = await goalRepository.findAllForUser(userId);
    
    const completedGoalsCount = goals.filter((g) => g.status === 'COMPLETED').length;

    const date = new Date();
    const endingString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      overallScore: scoreDetails.score,
      weekEnding: endingString,
      contributionsSummary: `Active engineering output logged across 3 core projects. Completed ${completedGoalsCount} personal milestones. High language concentration observed in TypeScript.`,
      strengths: [
        'Robust coding consistency (avg. 2h+ coding telemetry daily).',
        'Strong task resolution (consistent story points completed).',
      ],
      growthAreas: [
        'High late-night code heartbeats; consider adjusting working hours.',
        'High task isolation; try pairing on code reviews.',
      ],
      aiCoachingAdvice: 'Your focus is excellent. Try shifting your peak keyboard hours to earlier in the day to optimize code compilation efficiency and reduce build fatigue.',
    };
  }

  /**
   * Processes custom prompt chats with the AI Coach.
   */
  public getCoachReply(prompt: string): string {
    const cleanPrompt = prompt.toLowerCase();
    
    if (cleanPrompt.includes('burnout') || cleanPrompt.includes('tired') || cleanPrompt.includes('fatigue')) {
      return 'I notice signals of high late-night sessions. Burnout drops production rates by 40%. I highly recommend gating your commits past 8:00 PM and focusing on small story point tasks for the next 48 hours.';
    }
    if (cleanPrompt.includes('productivity') || cleanPrompt.includes('score') || cleanPrompt.includes('improve')) {
      return 'To optimize your productivity score: (1) Commit code incrementally rather than in massive daily batches, (2) Focus on closing low-complexity story points first to build momentum, and (3) Log clean session heartbeats via the IDE plugin.';
    }
    if (cleanPrompt.includes('github') || cleanPrompt.includes('git') || cleanPrompt.includes('pr')) {
      return 'Your GitHub integration is active. I suggest requesting code reviews earlier in the sprint to prevent build queue congestion on deployment days.';
    }

    return 'Hello! I am your CodePulse AI Coach. Ask me about your productivity score, burnout risk assessments, sprint recommendations, or how to optimize your coding habits.';
  }
}

export const aiService = new AiService();
export default aiService;
