/**
 * @file task.controller.ts
 * @description HTTP Controller handling issue CRUD actions.
 */

import { Request, Response } from 'express';
import { taskService } from '../services/task.service';
import { UnauthorizedError } from '../utils/errors';

export class TaskController {
  public getMyTasks = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const tasks = await taskService.getMyTasks(req.user.id);
    res.status(200).json({ success: true, data: tasks });
  };

  public getProjectTasks = async (req: Request, res: Response): Promise<void> => {
    const tasks = await taskService.getTasksForProject(req.params.projectId);
    res.status(200).json({ success: true, data: tasks });
  };

  public getTaskDetails = async (req: Request, res: Response): Promise<void> => {
    const task = await taskService.getTask(req.params.id);
    res.status(200).json({ success: true, data: task });
  };

  public createTask = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const newTask = await taskService.createTask(req.user.id, req.body);
    res.status(201).json({ success: true, data: newTask });
  };

  public updateTask = async (req: Request, res: Response): Promise<void> => {
    const updated = await taskService.updateTask(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  };

  public deleteTask = async (req: Request, res: Response): Promise<void> => {
    await taskService.deleteTask(req.params.id);
    res.status(200).json({ success: true, message: 'Task successfully deleted' });
  };
}

export const taskController = new TaskController();
export default taskController;
