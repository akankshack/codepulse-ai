/**
 * @file ai.api.ts
 * @description Axios API calling wrappers for AI telemetry.
 */

import { axiosClient } from './axiosClient';
import { ApiResponse } from '../types/api.types';

export interface TelemetryData {
  productivity: {
    score: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
    percentage: number;
  };
  burnout: {
    burnoutScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    findings: string[];
    recommendations: string[];
  };
  sprint: {
    suggestedPointsLimit: number;
    focusArea: string;
    complexityDistribution: { LOW: number; MEDIUM: number; HIGH: number };
    reasoning: string;
  };
}

export interface WeeklyReportData {
  overallScore: number;
  weekEnding: string;
  contributionsSummary: string;
  strengths: string[];
  growthAreas: string[];
  aiCoachingAdvice: string;
}

export const aiApi = {
  getTelemetry: async (): Promise<ApiResponse<TelemetryData>> => {
    const res = await axiosClient.get<ApiResponse<TelemetryData>>('/ai/telemetry');
    return res.data;
  },

  getWeeklyReport: async (): Promise<ApiResponse<WeeklyReportData>> => {
    const res = await axiosClient.get<ApiResponse<WeeklyReportData>>('/ai/report');
    return res.data;
  },

  askCoach: async (prompt: string): Promise<ApiResponse<{ reply: string }>> => {
    const res = await axiosClient.post<ApiResponse<{ reply: string }>>('/ai/coach', { prompt });
    return res.data;
  },
};
export default aiApi;
