/**
 * @file profile.controller.ts
 * @description HTTP Controller handling user profile queries.
 */

import { Request, Response } from 'express';
import { profileService } from '../services/profile.service';
import { UnauthorizedError } from '../utils/errors';

export class ProfileController {
  public getProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const profile = await profileService.getProfileData(req.user.id);
    res.status(200).json({ success: true, data: profile });
  };

  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    await profileService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  };
}

export const profileController = new ProfileController();
export default profileController;
/**
 * Profile controller layer.
 */
