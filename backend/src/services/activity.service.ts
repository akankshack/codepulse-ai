/**
 * @file activity.service.ts
 * @description Coordinates business validation operations for developer activities and alerts.
 * 
 * PURPOSE:
 * Implements CRUD actions. Seeds mock timelines and notifications for new users,
 * ensuring timelines are populated on first launch.
 */

import { Activity, IActivityDocument } from '../models/activity.model';
import { Notification, INotificationDocument } from '../models/notification.model';
import { NotFoundError } from '../utils/errors';

export class ActivityService {
  /**
   * Generates mock timeline events.
   */
  public async ensureMockTimeline(userId: string): Promise<IActivityDocument[]> {
    const existing = await Activity.find({ userId });
    if (existing.length > 0) {
      return existing;
    }

    const date = new Date();
    
    const activitiesData = [
      {
        activityType: 'TASK_RESOLVE' as const,
        description: 'Resolved issue CP-42: Augment Express types for ts-node',
        projectName: 'codepulse-ai',
      },
      {
        activityType: 'GITHUB_COMMIT' as const,
        description: 'Pushed commit [b3a7f92] fix: jwt sign options type conversion',
        projectName: 'codepulse-ai',
      },
      {
        activityType: 'SESSION_LOG' as const,
        description: 'Completed 120-minute coding sprint using VS Code editor',
        projectName: 'smart-event-platform',
      },
      {
        activityType: 'GOAL_COMPLETE' as const,
        description: 'Completed milestone: TypeScript Master (log 15 coding hours)',
        projectName: 'TypeScript Mastery',
      },
    ];

    const results: IActivityDocument[] = [];
    for (let i = 0; i < activitiesData.length; i++) {
      const activeDate = new Date();
      activeDate.setHours(date.getHours() - (i * 2 + 1));
      
      const act = await Activity.create({
        userId: userId as any,
        ...activitiesData[i],
        createdAt: activeDate,
      });
      results.push(act);
    }

    return results;
  }

  /**
   * Generates mock alerts for developer feedback.
   */
  public async ensureMockNotifications(userId: string): Promise<INotificationDocument[]> {
    const existing = await Notification.find({ userId });
    if (existing.length > 0) {
      return existing;
    }

    const alert1 = await Notification.create({
      userId: userId as any,
      title: 'Burnout Alert Warning',
      message: 'Logged late-night keyboard sessions 3 nights in a row. Consider resting.',
      type: 'WARNING',
    });

    const alert2 = await Notification.create({
      userId: userId as any,
      title: 'AI Sprint Recommendation ready',
      message: 'New sprint load capacity estimates computed for upcoming cycle. suggested stories limit: 8.',
      type: 'AI_SUGGESTION',
    });

    return [alert1, alert2];
  }

  public async getMyTimeline(userId: string): Promise<IActivityDocument[]> {
    await this.ensureMockTimeline(userId);
    return Activity.find({ userId }).sort({ createdAt: -1 });
  }

  public async getMyNotifications(userId: string): Promise<INotificationDocument[]> {
    await this.ensureMockNotifications(userId);
    return Notification.find({ userId }).sort({ createdAt: -1 });
  }

  public async logActivity(userId: string, data: Partial<IActivityDocument>): Promise<IActivityDocument> {
    return Activity.create({
      ...data,
      userId: userId as any,
    });
  }

  public async markNotificationRead(id: string): Promise<INotificationDocument> {
    const updated = await Notification.findByIdAndUpdate(id, { $set: { isRead: true } }, { new: true });
    if (!updated) {
      throw new NotFoundError('Notification not found');
    }
    return updated;
  }

  public async createNotification(userId: string, data: Partial<INotificationDocument>): Promise<INotificationDocument> {
    return Notification.create({
      ...data,
      userId: userId as any,
    });
  }
}

export const activityService = new ActivityService();
export default activityService;
