/**
 * @file goal.controller.ts
 * @description HTTP Controller handling goal CRUD actions.
 */

import { Request, Response } from 'express';
import { goalService } from '../services/goal.service';
import { UnauthorizedError } from '../utils/errors';

export class GoalController {
  public getMyGoals = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const goals = await goalService.getMyGoals(req.user.id);
    res.status(200).json({ success: true, data: goals });
  };

  public createGoal = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const newGoal = await goalService.createGoal(req.user.id, req.body);
    res.status(201).json({ success: true, data: newGoal });
  };

  public updateGoal = async (req: Request, res: Response): Promise<void> => {
    const updated = await goalService.updateGoal(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  };

  public deleteGoal = async (req: Request, res: Response): Promise<void> => {
    await goalService.deleteGoal(req.params.id);
    res.status(200).json({ success: true, message: 'Goal deleted successfully' });
  };
}

export const goalController = new GoalController();
export default goalController;
