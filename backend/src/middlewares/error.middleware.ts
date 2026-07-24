/**
 * @file error.middleware.ts
 * @description Centralized global Express error handling middleware.
 * 
 * PURPOSE:
 * Intercepts all errors thrown across controllers, services, and middlewares.
 * Formats responses into a predictable JSON structure (`{ success: false, error: { message, code, details } }`).
 * Hides stack traces in production to avoid security leaks.
 * 
 * ROLE IN REQUEST FLOW:
 * Placed at the very end of the Express application middleware pipeline (`app.use(errorHandler)`).
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { env } from '../config/environment';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'An unexpected internal error occurred';
  let details: unknown = null;

  // Handle known operational AppErrors (e.g. 400 Bad Request, 401 Unauthorized, 404 Not Found)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    // Mongoose schema validation error fallback
    statusCode = 400;
    message = 'Database validation error';
    details = err.message;
  } else if (err.name === 'MongoServerError' && (err as unknown as { code: number }).code === 11000) {
    // Mongoose duplicate key error fallback
    statusCode = 409;
    message = 'Duplicate field value entered';
  } else {
    // Log unhandled non-operational system errors
    logger.error('Unhandled System Error:', err);
  }

  const responsePayload: {
    success: boolean;
    error: {
      message: string;
      statusCode: number;
      details?: unknown;
      stack?: string;
    };
  } = {
    success: false,
    error: {
      message,
      statusCode,
      ...(details ? { details } : {}),
      ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    },
  };

  res.status(statusCode).json(responsePayload);
};
