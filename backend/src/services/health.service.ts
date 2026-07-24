/**
 * @file health.service.ts
 * @description Domain Service layer providing system health checks and database status diagnostics.
 * 
 * PURPOSE:
 * Encapsulates system telemetry and status checks (uptime, memory usage, MongoDB state, environment).
 * Decouples business logic from HTTP controller transport mechanisms.
 * 
 * ROLE IN REQUEST FLOW:
 * Invoked by `HealthController` -> Returns health status telemetry data payload.
 */

import mongoose from 'mongoose';

export interface HealthCheckStatus {
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

export class HealthService {
  /**
   * Evaluates current application health and database connection readiness.
   */
  public getHealthStatus(): HealthCheckStatus {
    const dbStateMap: Record<number, HealthCheckStatus['database']['status']> = {
      0: 'DISCONNECTED',
      1: 'CONNECTED',
      2: 'CONNECTING',
      3: 'DISCONNECTING',
    };

    const currentDbState = dbStateMap[mongoose.connection.readyState] || 'DISCONNECTED';
    const isDbHealthy = currentDbState === 'CONNECTED';

    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100;

    return {
      status: isDbHealthy ? 'UP' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: currentDbState,
        name: mongoose.connection.name,
      },
      system: {
        memoryUsageMB,
        nodeVersion: process.version,
      },
    };
  }
}

export const healthService = new HealthService();
