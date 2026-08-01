/**
 * @file goal.repository.ts
 * @description Encapsulates MongoDB access queries for Goals.
 */

import { Goal, IGoalDocument } from '../models/goal.model';

export class GoalRepository {
  public async findById(id: string): Promise<IGoalDocument | null> {
    return Goal.findById(id);
  }

  public async findAllForUser(userId: string): Promise<IGoalDocument[]> {
    return Goal.find({ userId }).sort({ targetDate: 1 });
  }

  public async create(goalData: Partial<IGoalDocument>): Promise<IGoalDocument> {
    return Goal.create(goalData);
  }

  public async update(id: string, updateData: Partial<IGoalDocument>): Promise<IGoalDocument | null> {
    return Goal.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }

  public async delete(id: string): Promise<boolean> {
    const result = await Goal.findByIdAndDelete(id);
    return !!result;
  }
}

export const goalRepository = new GoalRepository();
export default goalRepository;
