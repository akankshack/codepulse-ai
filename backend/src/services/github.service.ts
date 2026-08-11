/**
 * @file github.service.ts
 * @description Coordinates business validation operations for GithubIntegrations.
 * 
 * PURPOSE:
 * Connects developer accounts with mock GitHub repositories, generating realistic commit
 * records and sync dates in MongoDB to simulate a live Git hooks layer.
 */

import { githubRepository } from '../repositories/github.repository';
import { IGithubIntegrationDocument } from '../models/github.model';
import { NotFoundError } from '../utils/errors';

export class GithubService {
  /**
   * Automatically populates mock GitHub integration data when a user queries it for the first time.
   */
  public async ensureMockIntegration(userId: string): Promise<IGithubIntegrationDocument> {
    const existing = await githubRepository.findByUserId(userId);
    if (existing) {
      return existing;
    }

    // Default mock configuration representing integrated repository state
    const defaultData = {
      userId: userId as any,
      connectedAccountName: 'dev-pulse-master',
      avatarUrl: 'https://github.com/github.png',
      repositories: [
        {
          repoName: 'codepulse-ai',
          repoUrl: 'https://github.com/developer/codepulse-ai',
          starsCount: 42,
          openIssuesCount: 4,
          syncedBranches: ['main', 'feature/auth', 'feature/timeline'],
        },
        {
          repoName: 'smart-event-platform',
          repoUrl: 'https://github.com/developer/smart-event-platform',
          starsCount: 15,
          openIssuesCount: 2,
          syncedBranches: ['main', 'dev'],
        },
      ],
      recentCommits: [
        {
          hash: 'a3d9f2e',
          message: 'feat: add AuthContext provider & axios interceptors',
          authorName: 'Lead Staff Dev',
          date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
          hash: 'e5f9a2b',
          message: 'fix: checkHealth return types and interface compatibility',
          authorName: 'Lead Staff Dev',
          date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        },
        {
          hash: 'bc7e2f1',
          message: 'docs: update implementation roadmap to mark Module 1 complete',
          authorName: 'Lead Staff Dev',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
      ],
      syncedAt: new Date(),
    };

    return githubRepository.create(defaultData);
  }

  public async getIntegration(userId: string): Promise<IGithubIntegrationDocument> {
    return this.ensureMockIntegration(userId);
  }

  public async syncIntegration(userId: string): Promise<IGithubIntegrationDocument> {
    const integration = await githubRepository.findByUserId(userId);
    if (!integration) {
      throw new NotFoundError('GitHub integration configuration not found');
    }

    // Simulate pulling fresh commit streams
    const freshCommits = [
      {
        hash: Math.random().toString(16).substring(2, 9),
        message: 'chore: configure ts-node files: true option inside tsconfig',
        authorName: 'Lead Staff Dev',
        date: new Date(),
      },
      ...integration.recentCommits,
    ].slice(0, 5); // Cap to latest 5 items

    const updated = await githubRepository.update(userId, {
      recentCommits: freshCommits,
      syncedAt: new Date(),
    } as any);

    if (!updated) {
      throw new NotFoundError('Sync failed');
    }
    return updated;
  }

  public async disconnect(userId: string): Promise<void> {
    const result = await githubRepository.delete(userId);
    if (!result) {
      throw new NotFoundError('Integration not connected');
    }
  }
}

export const githubService = new GithubService();
export default githubService;
