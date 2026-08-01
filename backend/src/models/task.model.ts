/**
 * @file task.model.ts
 * @description Mongoose Task Schema and TypeScript interface.
 * 
 * PURPOSE:
 * Represents software engineering issues, tasks, and stories inside CodePulse AI.
 * Includes fields for story points, sprint mapping, AI prioritization scores, and complexity estimations.
 */

import { Schema, model, Document } from 'mongoose';

export interface ITask {
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  points: number; // Story points (e.g. 1, 2, 3, 5, 8)
  sprint?: string; // Sprint name or number identifier (e.g. "Sprint 3")
  dueDate?: Date;
  assigneeId?: Schema.Types.ObjectId;
  reporterId: Schema.Types.ObjectId;
  projectId: Schema.Types.ObjectId;
  
  // AI Productivity & Engineering telemetry
  aiScore: number; // calculated priority weight (1-100)
  aiComplexity?: 'LOW' | 'MEDIUM' | 'HIGH'; // AI complexity prediction
  aiReasoning?: string; // justification for prioritization
  
  createdAt: Date;
  updatedAt: Date;
}

export type ITaskDocument = ITask & Document;

const taskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
      default: 'TODO',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    points: {
      type: Number,
      default: 1,
    },
    sprint: {
      type: String,
      default: '',
    },
    dueDate: {
      type: Date,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    aiScore: {
      type: Number,
      default: 50, // Neutral priority weight
    },
    aiComplexity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    aiReasoning: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Task = model<ITaskDocument>('Task', taskSchema);
export default Task;
