/**
 * @file auth.middleware.ts
 * @description Middleware that enforces session authentication and role authorizations.
 * 
 * PURPOSE:
 * Authenticates request headers (`Authorization: Bearer <token>`), validates access tokens,
 * and restricts route access based on user role memberships.
 * 
 * ROLE IN REQUEST FLOW:
 * Intercepts incoming requests before reaching private route handlers/controllers.
 */

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { UserRole } from '../models/user.model';

/**
 * Express middleware that checks and verifies incoming JWT access tokens.
 * Extracts the user credentials payload and binds it to `req.user`.
 */
export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    const decoded = authService.verifyAccessToken(token);

    // Attach user payload to Express request context
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Express middleware builder that restricts route access to specific role hierarchies.
 * Must be mounted AFTER `requireAuth`.
 * 
 * @param allowedRoles Array of roles authorized to hit the route
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication is required to perform this action'));
    }

    const hasRole = allowedRoles.includes(req.user.role);
    if (!hasRole) {
      return next(new ForbiddenError('You are not authorized to access this resource'));
    }

    next();
  };
};
