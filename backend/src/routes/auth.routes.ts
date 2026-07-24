/**
 * @file auth.routes.ts
 * @description Express routing paths for authentication modules.
 * 
 * PURPOSE:
 * Associates URL routes to respective HTTP Controller handlers under validation layers.
 * 
 * ROLE IN REQUEST FLOW:
 * Mounted in the master router aggregator (`src/routes/index.ts`) under `/api/v1/auth`.
 */

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { requireAuth } from '../middlewares/auth.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Create new user profile & log in
 * @access  Public
 */
router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(authController.register)
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate credentials & return session access token
 * @access  Public
 */
router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(authController.login)
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Clear refresh token cookies
 * @access  Public
 */
router.post(
  '/logout',
  asyncHandler(authController.logout)
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Exchange expired access token with valid session cookie refresh
 * @access  Public
 */
router.post(
  '/refresh',
  asyncHandler(authController.refresh)
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Fetch active user identity payload
 * @access  Private (Requires valid JWT Access Header)
 */
router.get(
  '/me',
  requireAuth,
  asyncHandler(authController.getMe)
);

export const authRoutes = router;
export default authRoutes;
