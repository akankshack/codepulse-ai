/**
 * @file settings.controller.ts
 * @description HTTP Controller handling integration and alert parameters.
 */

import { Request, Response } from 'express';
import { settingsService } from '../services/settings.service';
import { UnauthorizedError } from '../utils/errors';

export class SettingsController {
  public getSettings = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const settings = await settingsService.getSettings(req.user.id);
    res.status(200).json({ success: true, data: settings });
  };

  public saveSettings = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const updated = await settingsService.updateSettings(req.user.id, req.body);
    res.status(200).json({ success: true, data: updated, message: 'Settings saved successfully' });
  };
}

export const settingsController = new SettingsController();
export default settingsController;
/**
 * Settings controller layer.
 */
