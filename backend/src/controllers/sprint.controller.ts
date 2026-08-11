/**
 * @file sprint.controller.ts
 * @description HTTP Controller handling active sprint plans.
 */

import { Request, Response } from 'express';
import { sprintService } from '../services/sprint.service';
import { UnauthorizedError } from '../utils/errors';

export class SprintController {
  public getActiveSprint = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const sprintName = (req.query.name as string) || 'Sprint 1';
    const sprintDetails = await sprintService.getSprintDetails(req.user.id, sprintName);
    res.status(200).json({ success: true, data: sprintDetails });
  };

  public assignTasks = async (req: Request, res: Response): Promise<void> => {
    const { taskIds, sprintName } = req.body;
    await sprintService.bulkAssignTasksToSprint(taskIds || [], sprintName || 'Sprint 1');
    res.status(200).json({ success: true, message: 'Tasks successfully assigned to sprint' });
  };
}

export const sprintController = new SprintController();
export default sprintController;
/**
 * Sprint controller layer.
 */
