/**
 * @file github.repository.ts
 * @description Encapsulates MongoDB access queries for GithubIntegrations.
 */

import { GithubIntegration, IGithubIntegrationDocument } from '../models/github.model';

export class GithubRepository {
  public async findByUserId(userId: string): Promise<IGithubIntegrationDocument | null> {
    return GithubIntegration.findOne({ userId });
  }

  public async create(integrationData: Partial<IGithubIntegrationDocument>): Promise<IGithubIntegrationDocument> {
    return GithubIntegration.create(integrationData);
  }

  public async update(userId: string, updateData: Partial<IGithubIntegrationDocument>): Promise<IGithubIntegrationDocument | null> {
    return GithubIntegration.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
  }

  public async delete(userId: string): Promise<boolean> {
    const result = await GithubIntegration.findOneAndDelete({ userId });
    return !!result;
  }
}

export const githubRepository = new GithubRepository();
export default githubRepository;
