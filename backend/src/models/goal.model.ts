/**
 * @file goal.model.ts
 * @description Mongoose Goal Schema and TypeScript interface.
 * 
 * PURPOSE:
 * Tracks developer productivity goals (e.g. log 15 hours of TypeScript, write 10 commits).
 */

import { Schema, model, Document } from 'mongoose';

export interface IGoal {
  userId: Schema.Types.ObjectId;
  title: string;
  description?: string;
  targetDate: Date;
  
  // Metrics to track
  targetMinutes: number; // target coding duration in minutes
  currentMinutes: number;
  targetCommits: number; // target commit frequency count
  currentCommits: number;
  
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

export type IGoalDocument = IGoal & Document;

const goalSchema = new Schema<IGoalDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    targetDate: {
      type: Date,
      required: true,
    },
    targetMinutes: {
      type: Number,
      default: 0,
    },
    currentMinutes: {
      type: Number,
      default: 0,
    },
    targetCommits: {
      type: Number,
      default: 0,
    },
    currentCommits: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'FAILED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

export const Goal = model<IGoalDocument>('Goal', goalSchema);
export default Goal;
