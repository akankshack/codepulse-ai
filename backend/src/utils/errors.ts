/**
 * @file errors.ts
 * @description Centralized custom error classes for clean, domain-driven error handling across the backend.
 * 
 * PURPOSE:
 * Provides standardized exception classes with explicit HTTP status codes, error messages, and operational flags.
 * This prevents hardcoded error responses across controllers and services, ensuring consistent JSON error outputs.
 * 
 * ROLE IN REQUEST FLOW:
 * Thrown inside Service or Controller layers -> Caught by `asyncHandler` -> Handled globally by `error.middleware.ts`.
 */

/**
 * Base Application Error class inherited by all custom operational domain errors.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  /**
   * @param message Human-readable error description
   * @param statusCode HTTP Status Code (e.g. 400, 401, 404, 500)
   * @param isOperational Distinguishes operational errors (user bad input) from system bugs
   */
  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request Error - Used for invalid client payload/query input.
 */
export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

/**
 * 401 Unauthorized Error - Used when JWT token is missing, expired, or invalid.
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

/**
 * 403 Forbidden Error - Used when user lacks required role/permissions for an action.
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
  }
}

/**
 * 404 Not Found Error - Used when requested database entity or API route does not exist.
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * 409 Conflict Error - Used when resource already exists (e.g. duplicate email registration).
 */
export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

/**
 * 500 Internal Server Error - Used for unexpected system or database failures.
 */
export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500, false);
  }
}
