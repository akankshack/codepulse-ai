/**
 * @file project.controller.ts
 * @description HTTP Controller handling project CRUD actions.
 */

import { Request, Response } from 'express';
import { projectService } from '../services/project.service';
import { UnauthorizedError } from '../utils/errors';

export class ProjectController {
  public getMyProjects = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const projects = await projectService.getMyProjects(req.user.id);
    res.status(200).json({ success: true, data: projects });
  };

  public getProjectDetails = async (req: Request, res: Response): Promise<void> => {
    const project = await projectService.getProject(req.params.id);
    res.status(200).json({ success: true, data: project });
  };

  public createProject = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const newProject = await projectService.createProject(req.user.id, req.body);
    res.status(201).json({ success: true, data: newProject });
  };

  public updateProject = async (req: Request, res: Response): Promise<void> => {
    const updated = await projectService.updateProject(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  };

  public deleteProject = async (req: Request, res: Response): Promise<void> => {
    await projectService.deleteProject(req.params.id);
    res.status(200).json({ success: true, message: 'Project successfully deleted' });
  };
}

export const projectController = new ProjectController();
export default projectController;
