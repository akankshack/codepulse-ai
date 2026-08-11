/**
 * @file profile.service.ts
 * @description Coordinates business validation operations for User Profile statistics and badges.
 * 
 * PURPOSE:
 * Gathers developer profile summaries and evaluates achievement benchmarks
 * (TypeScript Mastery, Commit Machine) based on MongoDB records.
 */

import { User } from '../models/user.model';
import { Task } from '../models/task.model';
import { CodingSession } from '../models/session.model';
import { Goal } from '../models/goal.model';
import { NotFoundError } from '../utils/errors';

export interface DeveloperBadge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlockedAt: Date | null;
}

export interface ProfileSummary {
  userEmail: string;
  fullName: string;
  role: string;
  avatar: string;
  stats: {
    totalSessionsCount: number;
    totalCommitsCount: number;
    completedGoalsCount: number;
    resolvedTasksCount: number;
  };
  badges: DeveloperBadge[];
}

export class ProfileService {
  /**
   * Evaluates developer milestones and unlocks corresponding portfolio badges.
   */
  public async getProfileData(userId: string): Promise<ProfileSummary> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const sessions = await CodingSession.find({ userId });
    const tasks = await Task.find({ assigneeId: userId, status: 'DONE' });
    const goals = await Goal.find({ userId, status: 'COMPLETED' });

    let totalCommits = 0;
    let tsMinutes = 0;
    sessions.forEach((s) => {
      totalCommits += s.commitsCount;
      s.languages.forEach((l) => {
        if (l.name.toLowerCase() === 'typescript') {
          tsMinutes += l.minutes;
        }
      });
    });

    const badges: DeveloperBadge[] = [
      {
        id: 'ts-master',
        name: 'TypeScript Architect',
        description: 'Log over 300 minutes coding TypeScript',
        iconName: 'Code',
        unlockedAt: tsMinutes >= 300 ? new Date() : null,
      },
      {
        id: 'commit-machine',
        name: 'Commit Machine',
        description: 'Publish 10 commits on active repositories',
        iconName: 'GitCommit',
        unlockedAt: totalCommits >= 10 ? new Date() : null,
      },
      {
        id: 'goal-crusher',
        name: 'Milestone Crusher',
        description: 'Complete at least 1 declared goal target',
        iconName: 'Target',
        unlockedAt: goals.length >= 1 ? new Date() : null,
      },
    ];

    return {
      userEmail: user.email,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar || '',
      stats: {
        totalSessionsCount: sessions.length,
        totalCommitsCount: totalCommits,
        completedGoalsCount: goals.length,
        resolvedTasksCount: tasks.length,
      },
      badges,
    };
  }

  public async updateProfile(userId: string, data: { fullName?: string; avatar?: string }): Promise<void> {
    const user = await User.findByIdAndUpdate(userId, { $set: data }, { new: true });
    if (!user) {
      throw new NotFoundError('User not found');
    }
  }
}

export const profileService = new ProfileService();
export default profileService;
/**
 * Profile service.
 */
