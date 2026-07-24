/**
 * @file axiosClient.ts
 * @description Centralized Axios HTTP client instance with request & response interceptors.
 * 
 * PURPOSE:
 * Provides a configured HTTP client pointing to `VITE_API_BASE_URL`.
 * Handles JWT token injection into `Authorization` headers (ready for Module 2)
 * and normalizes HTTP errors across all API calls.
 * 
 * ROLE IN FRONTEND:
 * Imported by feature API services and custom TanStack Query hooks to communicate with Express backend.
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

/**
 * Request Interceptor: Automatically attaches JWT access token stored in localStorage (for Module 2 Auth).
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('codepulse_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Normalizes error structures and handles expired token redirects.
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // If backend returns a structured error object, format it cleanly
    const serverError = error.response?.data as { error?: { message?: string } } | undefined;
    const errorMessage = serverError?.error?.message || error.message || 'An unknown network error occurred';
    
    // Log error in non-production environments
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, errorMessage);
    }

    return Promise.reject(new Error(errorMessage));
  }
);
