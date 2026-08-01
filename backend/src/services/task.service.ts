/**
 * @file task.service.ts
 * @description Coordinates business validation operations for Tasks & issue prioritizing algorithms.
 * 
 * PURPOSE:
 * Implements CRUD actions for tasks. Features a deterministic priority engine that computes
 * standard and AI-prioritized task scores (aiScore) based on deadline proximity, story points, and urgency.
 */

import { taskRepository } from '../repositories/task.repository';
import { ITaskDocument } from '../models/task.model';
import { NotFoundError } from '../utils/errors';

export class TaskService {
  /**
   * Evaluates task urgencies and computes an AI score (1 to 100).
   * Generates mock explanations for portfolio presentation.
   */
  private calculateAiScore(task: Partial<ITaskDocument>): { score: number; complexity: 'LOW' | 'MEDIUM' | 'HIGH'; reasoning: string } {
    let score = 40;
    
    // Impact of basic priority properties
    const priorityWeights = { LOW: 10, MEDIUM: 25, HIGH: 45, CRITICAL: 55 };
    score += priorityWeights[task.priority || 'MEDIUM'];

    // Impact of Story Points (complexity estimation modifier)
    const points = task.points || 1;
    let complexity: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
    if (points <= 2) {
      complexity = 'LOW';
      score += 5; // Smaller tasks get minor prioritization boosts for quick wins
    } else if (points >= 8) {
      complexity = 'HIGH';
      score -= 5; // Large stories are de-prioritized slightly to encourage sub-tasking
    }

    // Impact of Due Dates
    if (task.dueDate) {
      const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 2 && daysUntilDue >= 0) {
        score += 25; // Impending deadlines boost scores significantly
      } else if (daysUntilDue < 0) {
        score += 35; // Overdue tasks get critical priority weights
      }
    }

    score = Math.max(1, Math.min(100, score)); // Enforce boundaries [1, 100]

    let reasoning = `Automated prioritization calculated this task at score ${score}. `;
    if (task.priority === 'CRITICAL') {
      reasoning += 'Marked critical due to developer priority flags. ';
    }
    if (task.dueDate) {
      reasoning += 'Deadline proximity was factored into urgency ratings. ';
    }
    if (points <= 2) {
      reasoning += 'Promoted as a low-complexity "quick win".';
    }

    return { score, complexity, reasoning };
  }

  public async getTask(id: string): Promise<ITaskDocument> {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return task;
  }

  public async getTasksForProject(projectId: string): Promise<ITaskDocument[]> {
    return taskRepository.findAllForProject(projectId);
  }

  public async getMyTasks(userId: string): Promise<ITaskDocument[]> {
    return taskRepository.findAllForUser(userId);
  }

  public async createTask(userId: string, data: Partial<ITaskDocument>): Promise<ITaskDocument> {
    // Generate AI priorities prior to insertion
    const aiDetails = this.calculateAiScore(data);
    
    const taskData = {
      ...data,
      reporterId: userId as any,
      aiScore: aiDetails.score,
      aiComplexity: aiDetails.complexity,
      aiReasoning: aiDetails.reasoning,
    };

    return taskRepository.create(taskData);
  }

  public async updateTask(id: string, data: Partial<ITaskDocument>): Promise<ITaskDocument> {
    // Re-evaluate scores on status/priority adjustments
    const currentTask = await taskRepository.findById(id);
    if (!currentTask) {
      throw new NotFoundError('Task not found');
    }

    const merged = { ...currentTask.toJSON(), ...data };
    const aiDetails = this.calculateAiScore(merged as any);

    const updateData = {
      ...data,
      aiScore: aiDetails.score,
      aiComplexity: aiDetails.complexity,
      aiReasoning: aiDetails.reasoning,
    };

    const updated = await taskRepository.update(id, updateData);
    if (!updated) {
      throw new NotFoundError('Task not found');
    }
    return updated;
  }

  public async deleteTask(id: string): Promise<void> {
    const result = await taskRepository.delete(id);
    if (!result) {
      throw new NotFoundError('Task not found');
    }
  }
}

export const taskService = new TaskService();
export default taskService;
