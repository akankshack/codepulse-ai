/**
 * @file user.model.ts
 * @description Mongoose User Schema and TypeScript interfaces.
 * 
 * PURPOSE:
 * Defines the database schema, validations, and helper methods for user records in MongoDB.
 * 
 * ROLE IN REQUEST FLOW:
 * Interacted with by the Repository layer when executing DB operations (e.g. creating users, searching by email).
 */

import { Schema, model, Document } from 'mongoose';

export type UserRole = 'DEVELOPER' | 'LEAD' | 'ADMIN';

export interface IUser {
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  // Add mongoose document helpers if needed
}

const userSchema = new Schema<IUserDocument>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: {
        values: ['DEVELOPER', 'LEAD', 'ADMIN'],
        message: 'Invalid role specified',
      },
      default: 'DEVELOPER',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
    versionKey: false, // Disables the Mongoose '__v' tracking property
  }
);

// Virtual property mapping passwordHash to JSON conversion (excludes passwordHash from api outputs)
userSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    delete ret.passwordHash;
    return ret;
  },
});

export const User = model<IUserDocument>('User', userSchema);
export default User;
