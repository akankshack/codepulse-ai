/**
 * @file express.d.ts
 * @description Custom TypeScript type definitions extending Express Request interface.
 * 
 * PURPOSE:
 * Express Request by default does not contain custom properties like `user`.
 * This declaration file extends Express's global Request interface to type-safely attach
 * authenticated user information (`req.user`) populated by authentication middlewares in Module 2.
 * 
 * ROLE IN REQUEST FLOW:
 * Activated whenever `req.user` is accessed inside any Express middleware or controller.
 */

declare global {
  namespace Express {
    interface Request {
      /**
       * User payload attached by authentication middleware upon successful JWT verification.
       */
      user?: {
        id: string;
        email: string;
        role: 'ADMIN' | 'DEVELOPER' | 'LEAD';
      };
    }
  }
}

export {};
