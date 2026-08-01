/**
 * @file sessions.api.ts
 * @description Axios API calling wrappers for CodingSession logs.
 */

import { axiosClient } from './axiosClient';
import { ApiResponse } from '../types/api.types';

export interface LanguageBreakdown {
  name: string;
  minutes: number;
}

export interface CodingSessionData {
  _id: string;
  projectName: string;
  editorName: string;
  branchName: string;
  durationMinutes: number;
  commitsCount: number;
  languages: LanguageBreakdown[];
  startTime: string;
  endTime: string;
}

export const sessionsApi = {
  getSessions: async (): Promise<ApiResponse<CodingSessionData[]>> => {
    const res = await axiosClient.get<ApiResponse<CodingSessionData[]>>('/sessions');
    return res.data;
  },

  getRecentSessions: async (limit = 5): Promise<ApiResponse<CodingSessionData[]>> => {
    const res = await axiosClient.get<ApiResponse<CodingSessionData[]>>(`/sessions/recent?limit=${limit}`);
    return res.data;
  },

  logSession: async (payload: Partial<CodingSessionData>): Promise<ApiResponse<CodingSessionData>> => {
    const res = await axiosClient.post<ApiResponse<CodingSessionData>>('/sessions/log', payload);
    return res.data;
  },
};
export default sessionsApi;
