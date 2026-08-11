/**
 * @file settings.service.ts
 * @description Coordinates business validation operations for Platform Settings.
 * 
 * PURPOSE:
 * Tracks mock configurations (e.g. enabling notifications, WakaTime integrations token placeholder).
 */

import { User } from '../models/user.model';
import { NotFoundError } from '../utils/errors';

export interface PlatformSettings {
  enableAIPrompts: boolean;
  wakatimeApiKey: string;
  githubPersonalToken: string;
  emailAlertsEnabled: boolean;
}

export class SettingsService {
  /**
   * Stub manager retrieving platform-level configurations.
   */
  public async getSettings(userId: string): Promise<PlatformSettings> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    // Default configuration returned if no configurations set
    return {
      enableAIPrompts: true,
      wakatimeApiKey: 'wka_••••••••••••••••••••••••••••••••',
      githubPersonalToken: 'ghp_••••••••••••••••••••••••••••••••',
      emailAlertsEnabled: true,
    };
  }

  public async updateSettings(userId: string, data: Partial<PlatformSettings>): Promise<PlatformSettings> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    // Stub save metrics
    return {
      enableAIPrompts: data.enableAIPrompts ?? true,
      wakatimeApiKey: data.wakatimeApiKey || 'wka_••••••••••••••••••••••••••••••••',
      githubPersonalToken: data.githubPersonalToken || 'ghp_••••••••••••••••••••••••••••••••',
      emailAlertsEnabled: data.emailAlertsEnabled ?? true,
    };
  }
}

export const settingsService = new SettingsService();
export default settingsService;
/**
 * Settings service.
 */
