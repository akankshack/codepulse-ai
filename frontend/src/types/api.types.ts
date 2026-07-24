/**
 * @file api.types.ts
 * @description Standardized TypeScript interfaces mirroring backend HTTP response payloads.
 * 
 * PURPOSE:
 * Ensures strong type safety when making API calls via Axios or TanStack React Query.
 * 
 * ROLE IN FRONTEND:
 * Used by `axiosClient.ts`, API service functions, and custom React Query hooks.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    message: string;
    statusCode: number;
    details?: unknown;
  };
}

export interface HealthCheckData {
  status: 'UP' | 'DEGRADED' | 'DOWN';
  timestamp: string;
  uptime: number;
  environment: string;
  database: {
    status: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' | 'DISCONNECTING';
    name?: string;
  };
  system: {
    memoryUsageMB: number;
    nodeVersion: string;
  };
}
