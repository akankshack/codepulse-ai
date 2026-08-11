/**
 * @file team.routes.ts
 * @description Express routing paths for Team Workspace data.
 */

import { Router } from 'express';
import { teamController } from '../controllers/team.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.use(requireAuth);

router.get('/performance', asyncHandler(teamController.getTeamPerformance));

export const teamRoutes = router;
export default teamRoutes;
/**
 * Express routing maps.
 */
