/**
 * @file team.service.ts
 * @description Coordinates business validation operations for the Team Workspace.
 * 
 * PURPOSE:
 * Gathers coworker directories, developer statistics, active story loads,
 * and leadership metrics to present a unified team performance overview.
 */

import { User, IUserDocument } from '../models/user.model';
import { Task } from '../models/task.model';
import { CodingSession } from '../models/session.model';

export interface TeammateStats {
  user: IUserDocument;
  openTasksCount: number;
  completedTasksCount: number;
  totalStoryPoints: number;
  totalCodingMinutes: number;
  streakCount: number;
}

export class TeamService {
  /**
   * Aggregates stats for each developer registered on the platform.
   */
  public async getTeamPerformanceMetrics(): Promise<TeammateStats[]> {
    const users = await User.find({}).select('-passwordHash');
    const metrics: TeammateStats[] = [];

    for (const u of users) {
      // Aggregate tasks points and counts
      const openTasks = await Task.countDocuments({ assigneeId: u._id, status: { $ne: 'DONE' } });
      const completedTasks = await Task.countDocuments({ assigneeId: u._id, status: 'DONE' });

      const completedTaskDocs = await Task.find({ assigneeId: u._id, status: 'DONE' });
      let totalStoryPoints = 0;
      completedTaskDocs.forEach((t) => {
        totalStoryPoints += t.points;
      });

      // Aggregate coding durations
      const sessions = await CodingSession.find({ userId: u._id });
      let totalCodingMinutes = 0;
      sessions.forEach((s) => {
        totalCodingMinutes += s.durationMinutes;
      });

      metrics.push({
        user: u,
        openTasksCount: openTasks,
        completedTasksCount: completedTasks,
        totalStoryPoints,
        totalCodingMinutes,
        streakCount: sessions.length > 0 ? 5 : 0, // Mock coding streak
      });
    }

    return metrics;
  }
}

export const teamService = new TeamService();
export default teamService;
/**
 * Team business logic layer.
 */
