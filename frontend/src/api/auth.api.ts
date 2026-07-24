/**
 * @file auth.api.ts
 * @description Frontend Axios API calling wrappers for Authentication routes.
 * 
 * PURPOSE:
 * Bridges components and contexts to target `/auth` HTTP REST endpoints on the Express backend.
 * 
 * ROLE IN FRONTEND:
 * Invoked inside `AuthContext.tsx` during user interaction events (e.g. login form submission).
 */

import { axiosClient } from './axiosClient';
import { ApiResponse } from '../types/api.types';

export interface UserResponseData {
  id: string;
  fullName: string;
  email: string;
  role: 'DEVELOPER' | 'LEAD' | 'ADMIN';
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password?: string;
  role: 'DEVELOPER' | 'LEAD' | 'ADMIN';
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthSuccessPayload {
  user: UserResponseData;
  accessToken: string;
}

export const authApi = {
  /**
   * Dispatches register payload and establishes a new user session.
   */
  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthSuccessPayload>> => {
    const res = await axiosClient.post<ApiResponse<AuthSuccessPayload>>('/auth/register', payload);
    return res.data;
  },

  /**
   * Dispatches login payload and receives access token.
   */
  login: async (payload: LoginPayload): Promise<ApiResponse<AuthSuccessPayload>> => {
    const res = await axiosClient.post<ApiResponse<AuthSuccessPayload>>('/auth/login', payload);
    return res.data;
  },

  /**
   * Clears session cookies in backend.
   */
  logout: async (): Promise<ApiResponse<void>> => {
    const res = await axiosClient.post<ApiResponse<void>>('/auth/logout');
    return res.data;
  },

  /**
   * Queries active session details using authorization headers.
   */
  getMe: async (): Promise<ApiResponse<{ user: UserResponseData }>> => {
    const res = await axiosClient.get<ApiResponse<{ user: UserResponseData }>>('/auth/me');
    return res.data;
  },

  /**
   * Triggers session renewal using refresh token cookie.
   */
  refresh: async (): Promise<ApiResponse<{ accessToken: string }>> => {
    const res = await axiosClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
    return res.data;
  },
};
export default authApi;
