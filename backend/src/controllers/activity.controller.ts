/**
 * @file activity.controller.ts
 * @description HTTP Controller handling activity timelines and alerts.
 */

import { Request, Response } from 'express';
import { activityService } from '../services/activity.service';
import { UnauthorizedError } from '../utils/errors';

export class ActivityController {
  public getMyTimeline = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const timeline = await activityService.getMyTimeline(req.user.id);
    res.status(200).json({ success: true, data: timeline });
  };

  public getMyNotifications = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const notifications = await activityService.getMyNotifications(req.user.id);
    res.status(200).json({ success: true, data: notifications });
  };

  public markAsRead = async (req: Request, res: Response): Promise<void> => {
    const updated = await activityService.markNotificationRead(req.params.id);
    res.status(200).json({ success: true, data: updated });
  };

  public logActivity = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const newAct = await activityService.logActivity(req.user.id, req.body);
    res.status(201).json({ success: true, data: newAct });
  };
}

export const activityController = new ActivityController();
export default activityController;
