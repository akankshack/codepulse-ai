/**
 * @file task.repository.ts
 * @description Encapsulates MongoDB access queries for Tasks.
 */

import { Task, ITaskDocument } from '../models/task.model';

export class TaskRepository {
  public async findById(id: string): Promise<ITaskDocument | null> {
    return Task.findById(id)
      .populate('assigneeId', 'fullName email role avatar')
      .populate('reporterId', 'fullName email role')
      .populate('projectId', 'name key');
  }

  public async findAllForProject(projectId: string): Promise<ITaskDocument[]> {
    return Task.find({ projectId })
      .populate('assigneeId', 'fullName email role avatar')
      .sort({ aiScore: -1, createdAt: -1 }); // Prioritize higher AI scores first
  }

  public async findAllForUser(userId: string): Promise<ITaskDocument[]> {
    return Task.find({ assigneeId: userId })
      .populate('projectId', 'name key')
      .sort({ aiScore: -1, dueDate: 1 });
  }

  public async create(taskData: Partial<ITaskDocument>): Promise<ITaskDocument> {
    return Task.create(taskData);
  }

  public async update(id: string, updateData: Partial<ITaskDocument>): Promise<ITaskDocument | null> {
    return Task.findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .populate('assigneeId', 'fullName email role avatar')
      .populate('projectId', 'name key');
  }

  public async delete(id: string): Promise<boolean> {
    const result = await Task.findByIdAndDelete(id);
    return !!result;
  }
}

export const taskRepository = new TaskRepository();
export default taskRepository;
