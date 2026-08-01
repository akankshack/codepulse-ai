/**
 * @file notification.model.ts
 * @description Mongoose Notification Schema and TypeScript interface.
 * 
 * PURPOSE:
 * Represents user alerts, task warnings, and AI Coach updates.
 */

import { Schema, model, Document } from 'mongoose';

export interface INotification {
  userId: Schema.Types.ObjectId;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'AI_SUGGESTION';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type INotificationDocument = INotification & Document;

const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['INFO', 'WARNING', 'ALERT', 'AI_SUGGESTION'],
      default: 'INFO',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = model<INotificationDocument>('Notification', notificationSchema);
export default Notification;
