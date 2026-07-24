/**
 * @file express.d.ts
 * @description Express Request interface type augmentation.
 * 
 * PURPOSE:
 * Augments the Express Request interface to include a type-safe `user` property.
 * Using module augmentation for 'express-serve-static-core' ensures compatibility
 * across both tsc and ts-node without compiler declaration resolution issues.
 * 
 * ROLE IN REQUEST FLOW:
 * Automatically merges the `user` property into the Express Request type,
 * accessible throughout controllers, services, and middlewares.
 */

import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: 'ADMIN' | 'DEVELOPER' | 'LEAD';
    };
  }
}
