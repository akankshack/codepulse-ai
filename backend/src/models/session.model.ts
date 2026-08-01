/**
 * @file session.model.ts
 * @description Mongoose CodingSession Schema and TypeScript interface.
 * 
 * PURPOSE:
 * Tracks coding sessions (reminiscent of WakaTime telemetry) matching duration, IDE editor,
 * branches worked, languages breakdown, and linked commits.
 */

import { Schema, model, Document } from 'mongoose';

export interface ILanguageBreakdown {
  name: string; // e.g. "TypeScript", "HTML", "CSS"
  minutes: number;
}

export interface ICodingSession {
  userId: Schema.Types.ObjectId;
  projectName: string; // matches repository/folder name
  editorName: string; // e.g. "VS Code", "WebStorm"
  branchName: string; // e.g. "main", "feature/auth"
  durationMinutes: number;
  commitsCount: number;
  languages: ILanguageBreakdown[];
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ICodingSessionDocument = ICodingSession & Document;

const languageBreakdownSchema = new Schema<ILanguageBreakdown>(
  {
    name: { type: String, required: true },
    minutes: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const codingSessionSchema = new Schema<ICodingSessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectName: {
      type: String,
      required: true,
      default: 'Unknown Project',
    },
    editorName: {
      type: String,
      default: 'VS Code',
    },
    branchName: {
      type: String,
      default: 'main',
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 0,
    },
    commitsCount: {
      type: Number,
      default: 0,
    },
    languages: [languageBreakdownSchema],
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CodingSession = model<ICodingSessionDocument>('CodingSession', codingSessionSchema);
export default CodingSession;
