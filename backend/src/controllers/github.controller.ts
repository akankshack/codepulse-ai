/**
 * @file github.controller.ts
 * @description HTTP Controller handling GitHub integration endpoints.
 */

import { Request, Response } from 'express';
import { githubService } from '../services/github.service';
import { UnauthorizedError } from '../utils/errors';

export class GithubController {
  public getIntegrationDetails = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const details = await githubService.getIntegration(req.user.id);
    res.status(200).json({ success: true, data: details });
  };

  public syncActivity = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const updatedDetails = await githubService.syncIntegration(req.user.id);
    res.status(200).json({ success: true, data: updatedDetails });
  };

  public disconnectAccount = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    await githubService.disconnect(req.user.id);
    res.status(200).json({ success: true, message: 'GitHub connection disconnected successfully' });
  };
}

export const githubController = new GithubController();
export default githubController;
