/**
 * @file team.controller.ts
 * @description HTTP Controller handling team workspace metrics.
 */

import { Request, Response } from 'express';
import { teamService } from '../services/team.service';
import { requireRole } from '../middlewares/auth.middleware';

export class TeamController {
  public getTeamPerformance = async (_req: Request, res: Response): Promise<void> => {
    const performance = await teamService.getTeamPerformanceMetrics();
    res.status(200).json({ success: true, data: performance });
  };
}

export const teamController = new TeamController();
export default teamController;
/**
 * Team controller layer.
 */
