/**
 * @file sprint.service.ts
 * @description Coordinates business validation operations for Sprint Planning.
 * 
 * PURPOSE:
 * Computes active sprint parameters, story workloads, and lists sprint tasks.
 */

import { Task, ITaskDocument } from '../models/task.model';
import { aiService } from './ai.service';
import { NotFoundError } from '../utils/errors';

export interface SprintInfo {
  sprintName: string;
  totalPoints: number;
  completedPoints: number;
  tasks: ITaskDocument[];
  suggestions: {
    suggestedPointsLimit: number;
    focusArea: string;
    reasoning: string;
  };
}

export class SprintService {
  /**
   * Summarizes current sprint details and integrates AI suggestions.
   * @param userId Authenticated user context
   * @param sprintId Identifier e.g. "Sprint 1"
   */
  public async getSprintDetails(userId: string, sprintId = 'Sprint 1'): Promise<SprintInfo> {
    const tasks = await Task.find({ assigneeId: userId, sprint: sprintId }).populate('projectId', 'name key');
    
    let totalPoints = 0;
    let completedPoints = 0;
    tasks.forEach((t) => {
      totalPoints += t.points;
      if (t.status === 'DONE') {
        completedPoints += t.points;
      }
    });

    const aiSuggestions = await aiService.getSprintRecommendations(userId);

    return {
      sprintName: sprintId,
      totalPoints,
      completedPoints,
      tasks,
      suggestions: {
        suggestedPointsLimit: aiSuggestions.suggestedPointsLimit,
        focusArea: aiSuggestions.focusArea,
        reasoning: aiSuggestions.reasoning,
      },
    };
  }

  public async bulkAssignTasksToSprint(taskIds: string[], sprintName: string): Promise<void> {
    await Task.updateMany({ _id: { $in: taskIds } }, { $set: { sprint: sprintName } });
  }
}

export const sprintService = new SprintService();
export default sprintService;
/**
 * Sprint service.
 */
