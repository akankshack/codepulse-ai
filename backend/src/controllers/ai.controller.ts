/**
 * @file ai.controller.ts
 * @description HTTP Controller handling requests for AI Productivity Coach statistics.
 */

import { Request, Response } from 'express';
import { aiService } from '../services/ai.service';
import { UnauthorizedError } from '../utils/errors';

export class AiController {
  public getTelemetry = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const score = await aiService.getProductivityScore(req.user.id);
    const burnout = await aiService.assessBurnoutRisk(req.user.id);
    const sprint = await aiService.getSprintRecommendations(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        productivity: score,
        burnout,
        sprint,
      },
    });
  };

  public getWeeklyReport = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const report = await aiService.getWeeklyReport(req.user.id);
    res.status(200).json({ success: true, data: report });
  };

  public askCoach = async (req: Request, res: Response): Promise<void> => {
    const { prompt } = req.body;
    const reply = aiService.getCoachReply(prompt || '');
    res.status(200).json({ success: true, data: { reply } });
  };
}

export const aiController = new AiController();
export default aiController;
