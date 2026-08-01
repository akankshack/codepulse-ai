/**
 * @file goals.api.ts
 * @description Axios API calling wrappers for Goal routes.
 */

import { axiosClient } from './axiosClient';
import { ApiResponse } from '../types/api.types';

export interface GoalData {
  _id: string;
  title: string;
  description: string;
  targetDate: string;
  targetMinutes: number;
  currentMinutes: number;
  targetCommits: number;
  currentCommits: number;
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export const goalsApi = {
  getGoals: async (): Promise<ApiResponse<GoalData[]>> => {
    const res = await axiosClient.get<ApiResponse<GoalData[]>>('/goals');
    return res.data;
  },

  createGoal: async (payload: Partial<GoalData>): Promise<ApiResponse<GoalData>> => {
    const res = await axiosClient.post<ApiResponse<GoalData>>('/goals', payload);
    return res.data;
  },

  updateGoal: async (id: string, payload: Partial<GoalData>): Promise<ApiResponse<GoalData>> => {
    const res = await axiosClient.put<ApiResponse<GoalData>>(`/goals/${id}`, payload);
    return res.data;
  },

  deleteGoal: async (id: string): Promise<ApiResponse<void>> => {
    const res = await axiosClient.delete<ApiResponse<void>>(`/goals/${id}`);
    return res.data;
  },
};
export default goalsApi;
