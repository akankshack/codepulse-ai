/**
 * @file github.model.ts
 * @description Mongoose GithubIntegration Schema and TypeScript interface.
 * 
 * PURPOSE:
 * Tracks user integrated repositories, repository statistics, pull requests, and commit timelines.
 * 
 * ROLE IN REQUEST FLOW:
 * Queried by GithubRepository and mutated by GithubService on repository synchronization.
 */

import { Schema, model, Document } from 'mongoose';

export interface ICommitInfo {
  hash: string;
  message: string;
  authorName: string;
  date: Date;
}

export interface IGithubRepo {
  repoName: string;
  repoUrl: string;
  starsCount: number;
  openIssuesCount: number;
  syncedBranches: string[];
}

export interface IGithubIntegration {
  userId: Schema.Types.ObjectId;
  connectedAccountName: string;
  avatarUrl?: string;
  repositories: IGithubRepo[];
  recentCommits: ICommitInfo[];
  syncedAt: Date;
}

export type IGithubIntegrationDocument = IGithubIntegration & Document;

const commitInfoSchema = new Schema<ICommitInfo>(
  {
    hash: { type: String, required: true },
    message: { type: String, required: true },
    authorName: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { _id: false }
);

const githubRepoSchema = new Schema<IGithubRepo>(
  {
    repoName: { type: String, required: true },
    repoUrl: { type: String, required: true },
    starsCount: { type: Number, default: 0 },
    openIssuesCount: { type: Number, default: 0 },
    syncedBranches: [{ type: String }],
  },
  { _id: false }
);

const githubIntegrationSchema = new Schema<IGithubIntegrationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    connectedAccountName: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    repositories: [githubRepoSchema],
    recentCommits: [commitInfoSchema],
    syncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const GithubIntegration = model<IGithubIntegrationDocument>('GithubIntegration', githubIntegrationSchema);
export default GithubIntegration;
