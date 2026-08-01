/**
 * @file ai.routes.ts
 * @description Express routing paths for AI productivity telemetry.
 */

import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.use(requireAuth);

router.get('/telemetry', asyncHandler(aiController.getTelemetry));
router.get('/report', asyncHandler(aiController.getWeeklyReport));
router.post('/coach', asyncHandler(aiController.askCoach));

export const aiRoutes = router;
export default aiRoutes;
