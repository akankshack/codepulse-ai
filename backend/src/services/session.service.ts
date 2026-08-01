/**
 * @file session.service.ts
 * @description Coordinates business validation operations for WakaTime-like Coding Sessions.
 * 
 * PURPOSE:
 * Implements CRUD actions. Includes a seed generator to populate mock historical telemetry
 * when developer accounts are created, ensuring graphs are rendered.
 */

import { sessionRepository } from '../repositories/session.repository';
import { ICodingSessionDocument } from '../models/session.model';
import { NotFoundError } from '../utils/errors';

export class SessionService {
  /**
   * Automatically populates mock history for new accounts so dashboard analytics display immediately.
   */
  public async ensureMockSessions(userId: string): Promise<ICodingSessionDocument[]> {
    const existing = await sessionRepository.findAllForUser(userId);
    if (existing.length > 0) {
      return existing;
    }

    const mockProjects = ['codepulse-ai', 'smart-event-platform', 'retro-compiler'];
    const mockLanguages = [
      { name: 'TypeScript', weight: 0.6 },
      { name: 'JavaScript', weight: 0.2 },
      { name: 'CSS', weight: 0.1 },
      { name: 'HTML', weight: 0.1 },
    ];
    const mockEditors = ['VS Code', 'Neovim'];

    const createdSessions: ICodingSessionDocument[] = [];

    // Create 7 days of historical logs
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const duration = Math.floor(Math.random() * 180) + 40; // 40-220 minutes per day
      const commits = Math.floor(Math.random() * 4) + 1; // 1-5 commits

      const startTime = new Date(date);
      startTime.setHours(10, 0, 0, 0);

      const endTime = new Date(date);
      endTime.setMinutes(startTime.getMinutes() + duration);

      const langs = mockLanguages.map((l) => ({
        name: l.name,
        minutes: Math.round(duration * l.weight),
      }));

      const session = await sessionRepository.create({
        userId: userId as any,
        projectName: mockProjects[Math.floor(Math.random() * mockProjects.length)],
        editorName: mockEditors[Math.floor(Math.random() * mockEditors.length)],
        branchName: `feature/sprint-${i + 1}`,
        durationMinutes: duration,
        commitsCount: commits,
        languages: langs,
        startTime,
        endTime,
      });

      createdSessions.push(session);
    }

    return createdSessions;
  }

  public async getMySessions(userId: string): Promise<ICodingSessionDocument[]> {
    // Populate seed sessions if database query yields empty response
    await this.ensureMockSessions(userId);
    return sessionRepository.findAllForUser(userId);
  }

  public async getRecentSessions(userId: string, limit = 5): Promise<ICodingSessionDocument[]> {
    await this.ensureMockSessions(userId);
    return sessionRepository.findRecentForUser(userId, limit);
  }

  public async logSession(userId: string, data: Partial<ICodingSessionDocument>): Promise<ICodingSessionDocument> {
    return sessionRepository.create({
      ...data,
      userId: userId as any,
    });
  }

  public async deleteSession(id: string): Promise<void> {
    const result = await sessionRepository.delete(id);
    if (!result) {
      throw new NotFoundError('Coding session not found');
    }
  }
}

export const sessionService = new SessionService();
export default sessionService;
