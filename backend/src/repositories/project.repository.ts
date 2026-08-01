/**
 * @file project.repository.ts
 * @description Encapsulates MongoDB access logic for Projects.
 */

import { Project, IProjectDocument } from '../models/project.model';
import { Schema } from 'mongoose';

export class ProjectRepository {
  public async findById(id: string): Promise<IProjectDocument | null> {
    return Project.findById(id).populate('ownerId', 'fullName email role').populate('members', 'fullName email role');
  }

  public async findAllForUser(userId: string): Promise<IProjectDocument[]> {
    return Project.find({
      $or: [{ ownerId: userId }, { members: userId }],
    }).populate('ownerId', 'fullName email role');
  }

  public async findByKey(key: string): Promise<IProjectDocument | null> {
    return Project.findOne({ key: key.toUpperCase().trim() });
  }

  public async create(projectData: {
    name: string;
    key: string;
    description?: string;
    ownerId: string;
    members?: string[];
  }): Promise<IProjectDocument> {
    return Project.create({
      name: projectData.name,
      key: projectData.key.toUpperCase().trim(),
      description: projectData.description || '',
      ownerId: projectData.ownerId,
      members: projectData.members || [projectData.ownerId],
    });
  }

  public async update(id: string, updateData: Partial<IProjectDocument>): Promise<IProjectDocument | null> {
    return Project.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }

  public async delete(id: string): Promise<boolean> {
    const result = await Project.findByIdAndDelete(id);
    return !!result;
  }
}

export const projectRepository = new ProjectRepository();
export default projectRepository;
