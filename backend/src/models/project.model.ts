/**
 * @file project.model.ts
 * @description Mongoose Project Schema and TypeScript interface.
 * 
 * PURPOSE:
 * Represents software engineering projects managed inside CodePulse AI.
 */

import { Schema, model, Document } from 'mongoose';

export interface IProject {
  name: string;
  key: string; // e.g. "PROJ"
  description?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';
  ownerId: Schema.Types.ObjectId;
  members: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type IProjectDocument = IProject & Document;

const projectSchema = new Schema<IProjectDocument>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    key: {
      type: String,
      required: [true, 'Project key prefix is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED', 'COMPLETED'],
      default: 'ACTIVE',
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Project = model<IProjectDocument>('Project', projectSchema);
export default Project;
