/**
 * @file session.controller.ts
 * @description HTTP Controller handling coding session logs.
 */

import { Request, Response } from 'express';
import { sessionService } from '../services/session.service';
import { UnauthorizedError } from '../utils/errors';

export class SessionController {
  public getMySessions = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const sessions = await sessionService.getMySessions(req.user.id);
    res.status(200).json({ success: true, data: sessions });
  };

  public getRecentSessions = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    const sessions = await sessionService.getRecentSessions(req.user.id, limit);
    res.status(200).json({ success: true, data: sessions });
  };

  public logSession = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const newSession = await sessionService.logSession(req.user.id, req.body);
    res.status(201).json({ success: true, data: newSession });
  };

  public deleteSession = async (req: Request, res: Response): Promise<void> => {
    await sessionService.deleteSession(req.params.id);
    res.status(200).json({ success: true, message: 'Session logs deleted successfully' });
  };
}

export const sessionController = new SessionController();
export default sessionController;
