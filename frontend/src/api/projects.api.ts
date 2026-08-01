/**
 * @file projects.api.ts
 * @description Axios API calling wrappers for Project routes.
 */

import { axiosClient } from './axiosClient';
import { ApiResponse } from '../types/api.types';

export interface ProjectData {
  _id: string;
  name: string;
  key: string;
  description: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';
  ownerId: any;
  members: any[];
  createdAt: string;
  updatedAt: string;
}

export const projectsApi = {
  getProjects: async (): Promise<ApiResponse<ProjectData[]>> => {
    const res = await axiosClient.get<ApiResponse<ProjectData[]>>('/projects');
    return res.data;
  },

  getProject: async (id: string): Promise<ApiResponse<ProjectData>> => {
    const res = await axiosClient.get<ApiResponse<ProjectData>>(`/projects/${id}`);
    return res.data;
  },

  createProject: async (payload: { name: string; key: string; description?: string }): Promise<ApiResponse<ProjectData>> => {
    const res = await axiosClient.post<ApiResponse<ProjectData>>('/projects', payload);
    return res.data;
  },

  updateProject: async (id: string, payload: Partial<ProjectData>): Promise<ApiResponse<ProjectData>> => {
    const res = await axiosClient.put<ApiResponse<ProjectData>>(`/projects/${id}`, payload);
    return res.data;
  },

  deleteProject: async (id: string): Promise<ApiResponse<void>> => {
    const res = await axiosClient.delete<ApiResponse<void>>(`/projects/${id}`);
    return res.data;
  },
};
export default projectsApi;
