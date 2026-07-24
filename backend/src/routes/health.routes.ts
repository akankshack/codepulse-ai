/**
 * @file health.routes.ts
 * @description Express router declaring health check API routes.
 * 
 * PURPOSE:
 * Maps HTTP GET requests for `/health` to `HealthController.checkHealth`.
 * 
 * ROLE IN REQUEST FLOW:
 * Mounted in `src/routes/index.ts` under `/api/v1/health`.
 */

import { Router } from 'express';
import { healthController } from '../controllers/health.controller';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    System health & MongoDB connection readiness check
 * @access  Public
 */
router.get('/', asyncHandler(healthController.checkHealth));

export const healthRoutes = router;
