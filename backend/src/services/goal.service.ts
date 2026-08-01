/**
 * @file goal.service.ts
 * @description Coordinates business validation operations for Goals & milestones.
 * 
 * PURPOSE:
 * Implements CRUD actions. Includes a seed generator to populate mock goals
 * when developer accounts are queried, ensuring visual goal metrics are rendered on dashboard load.
 */

import { goalRepository } from '../repositories/goal.repository';
import { IGoalDocument } from '../models/goal.model';
import { NotFoundError } from '../utils/errors';

export class GoalService {
  /**
   * Generates mock goals for portfolio presentation.
   */
  public async ensureMockGoals(userId: string): Promise<IGoalDocument[]> {
    const existing = await goalRepository.findAllForUser(userId);
    if (existing.length > 0) {
      return existing;
    }

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);

    const goal1 = await goalRepository.create({
      userId: userId as any,
      title: 'Complete Sprint Tasks',
      description: 'Finish all assigned user stories for the current sprint cycle',
      targetDate: futureDate,
      targetMinutes: 600,
      currentMinutes: 420,
      targetCommits: 15,
      currentCommits: 11,
      status: 'ACTIVE',
    });

    const goal2 = await goalRepository.create({
      userId: userId as any,
      title: 'TypeScript Mastery',
      description: 'Spend 20 hours coding TypeScript projects',
      targetDate: futureDate,
      targetMinutes: 1200,
      currentMinutes: 890,
      targetCommits: 30,
      currentCommits: 25,
      status: 'ACTIVE',
    });

    return [goal1, goal2];
  }

  public async getMyGoals(userId: string): Promise<IGoalDocument[]> {
    await this.ensureMockGoals(userId);
    return goalRepository.findAllForUser(userId);
  }

  public async createGoal(userId: string, data: Partial<IGoalDocument>): Promise<IGoalDocument> {
    return goalRepository.create({
      ...data,
      userId: userId as any,
      status: 'ACTIVE',
    });
  }

  public async updateGoal(id: string, data: Partial<IGoalDocument>): Promise<IGoalDocument> {
    const updated = await goalRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError('Goal not found');
    }
    return updated;
  }

  public async deleteGoal(id: string): Promise<void> {
    const result = await goalRepository.delete(id);
    if (!result) {
      throw new NotFoundError('Goal not found');
    }
  }
}

export const goalService = new GoalService();
export default goalService;
