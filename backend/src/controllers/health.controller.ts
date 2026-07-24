/**
 * @file health.controller.ts
 * @description HTTP Controller for system health check endpoints.
 * 
 * PURPOSE:
 * Extracts request inputs, invokes `HealthService`, and sends formatted JSON HTTP responses back to clients.
 * 
 * ROLE IN REQUEST FLOW:
 * Express Route -> `HealthController.checkHealth` -> `HealthService.getHealthStatus` -> HTTP Response 200/503.
 */

import { Request, Response } from 'express';
import { healthService } from '../services/health.service';

export class HealthController {
  /**
   * Controller method handling `GET /api/v1/health` requests.
   */
  public checkHealth = async (_req: Request, res: Response): Promise<void> => {
    const healthStatus = healthService.getHealthStatus();
    const httpStatusCode = healthStatus.status === 'UP' ? 200 : 503;

    res.status(httpStatusCode).json({
      success: healthStatus.status === 'UP',
      data: healthStatus,
    });
  };
}

export const healthController = new HealthController();
