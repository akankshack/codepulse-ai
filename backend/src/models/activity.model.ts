/**
 * @file activity.model.ts
 * @description Mongoose Activity Schema and TypeScript interface.
 * 
 * PURPOSE:
 * Tracks developer activity events (e.g. log session, resolve task) to generate timelines.
 */

import { Schema, model, Document } from 'mongoose';

export interface IActivity {
  userId: Schema.Types.ObjectId;
  activityType: 'TASK_CREATE' | 'TASK_RESOLVE' | 'SESSION_LOG' | 'GOAL_COMPLETE' | 'GITHUB_COMMIT';
  description: string;
  projectName?: string;
  metadata?: Schema.Types.Mixed;
  createdAt: Date;
}

export type IActivityDocument = IActivity & Document;

const activitySchema = new Schema<IActivityDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    activityType: {
      type: String,
      enum: ['TASK_CREATE', 'TASK_RESOLVE', 'SESSION_LOG', 'GOAL_COMPLETE', 'GITHUB_COMMIT'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      default: '',
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only log creation time
  }
);

export const Activity = model<IActivityDocument>('Activity', activitySchema);
export default Activity;
