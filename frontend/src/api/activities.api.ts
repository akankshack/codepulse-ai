/**
 * @file activities.api.ts
 * @description Axios API calling wrappers for activity timelines and notifications.
 */

import { axiosClient } from './axiosClient';
import { ApiResponse } from '../types/api.types';

export interface ActivityData {
  _id: string;
  activityType: 'TASK_CREATE' | 'TASK_RESOLVE' | 'SESSION_LOG' | 'GOAL_COMPLETE' | 'GITHUB_COMMIT';
  description: string;
  projectName?: string;
  createdAt: string;
}

export interface NotificationData {
  _id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'AI_SUGGESTION';
  isRead: boolean;
  createdAt: string;
}

export const activitiesApi = {
  getTimeline: async (): Promise<ApiResponse<ActivityData[]>> => {
    const res = await axiosClient.get<ApiResponse<ActivityData[]>>('/activities/timeline');
    return res.data;
  },

  getNotifications: async (): Promise<ApiResponse<NotificationData[]>> => {
    const res = await axiosClient.get<ApiResponse<NotificationData[]>>('/activities/notifications');
    return res.data;
  },

  markNotificationRead: async (id: string): Promise<ApiResponse<NotificationData>> => {
    const res = await axiosClient.patch<ApiResponse<NotificationData>>(`/activities/notifications/${id}/read`);
    return res.data;
  },
};
export default activitiesApi;
