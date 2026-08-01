/**
 * @file project.service.ts
 * @description Coordinates business validation operations for Projects.
 */

import { projectRepository } from '../repositories/project.repository';
import { IProjectDocument } from '../models/project.model';
import { ConflictError, NotFoundError } from '../utils/errors';

export class ProjectService {
  public async getProject(id: string): Promise<IProjectDocument> {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    return project;
  }

  public async getMyProjects(userId: string): Promise<IProjectDocument[]> {
    return projectRepository.findAllForUser(userId);
  }

  public async createProject(
    userId: string,
    data: { name: string; key: string; description?: string; members?: string[] }
  ): Promise<IProjectDocument> {
    const existing = await projectRepository.findByKey(data.key);
    if (existing) {
      throw new ConflictError(`Project with key ${data.key} already exists`);
    }

    return projectRepository.create({
      name: data.name,
      key: data.key,
      description: data.description,
      ownerId: userId,
      members: data.members,
    });
  }

  public async updateProject(
    id: string,
    data: Partial<IProjectDocument>
  ): Promise<IProjectDocument> {
    const updated = await projectRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError('Project not found');
    }
    return updated;
  }

  public async deleteProject(id: string): Promise<void> {
    const result = await projectRepository.delete(id);
    if (!result) {
      throw new NotFoundError('Project not found');
    }
  }
}

export const projectService = new ProjectService();
export default projectService;
