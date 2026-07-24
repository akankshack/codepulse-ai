/**
 * @file async.middleware.ts
 * @description Higher-Order Function wrapper for async Express route handlers.
 * 
 * PURPOSE:
 * Express 4.x does not automatically forward unhandled promise rejections in async route handlers to `next(err)`.
 * Wrapping controller methods with `asyncHandler` eliminates repetitive `try/catch` blocks across every controller.
 * Any error thrown in an async controller automatically gets passed to Express's global error handler.
 * 
 * ROLE IN REQUEST FLOW:
 * Wraps route controllers: `router.get('/', asyncHandler(controllerMethod))`
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown> | void;

/**
 * Wraps async request handlers and catches any rejected promises.
 * 
 * @param fn Async controller function
 * @returns Express RequestHandler
 */
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
