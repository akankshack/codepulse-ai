/**
 * @file sprint.routes.ts
 * @description Express routing paths for Sprint planning.
 */

import { Router } from 'express';
import { sprintController } from '../controllers/sprint.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.use(requireAuth);

router.get('/active', asyncHandler(sprintController.getActiveSprint));
router.post('/assign', asyncHandler(sprintController.assignTasks));

export const sprintRoutes = router;
export default sprintRoutes;
/**
 * Express routing maps.
 */
