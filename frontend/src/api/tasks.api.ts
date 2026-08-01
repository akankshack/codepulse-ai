/**
 * @file tasks.api.ts
 * @description Axios API calling wrappers for Task routes.
 */

import { axiosClient } from './axiosClient';
import { ApiResponse } from '../types/api.types';

export interface TaskData {
  _id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  points: number;
  sprint: string;
  dueDate?: string;
  assigneeId?: any;
  reporterId: any;
  projectId: any;
  aiScore: number;
  aiComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
  aiReasoning: string;
  createdAt: string;
  updatedAt: string;
}

export const tasksApi = {
  getMyTasks: async (): Promise<ApiResponse<TaskData[]>> => {
    const res = await axiosClient.get<ApiResponse<TaskData[]>>('/tasks/my');
    return res.data;
  },

  getProjectTasks: async (projectId: string): Promise<ApiResponse<TaskData[]>> => {
    const res = await axiosClient.get<ApiResponse<TaskData[]>>(`/tasks/project/${projectId}`);
    return res.data;
  },

  createTask: async (payload: Partial<TaskData>): Promise<ApiResponse<TaskData>> => {
    const res = await axiosClient.post<ApiResponse<TaskData>>('/tasks', payload);
    return res.data;
  },

  updateTask: async (id: string, payload: Partial<TaskData>): Promise<ApiResponse<TaskData>> => {
    const res = await axiosClient.put<ApiResponse<TaskData>>(`/tasks/${id}`, payload);
    return res.data;
  },

  deleteTask: async (id: string): Promise<ApiResponse<void>> => {
    const res = await axiosClient.delete<ApiResponse<void>>(`/tasks/${id}`);
    return res.data;
  },
};
export default tasksApi;
