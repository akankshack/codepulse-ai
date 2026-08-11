/**
 * @file github.routes.ts
 * @description Express routing paths for GitHub integrations.
 */

import { Router } from 'express';
import { githubController } from '../controllers/github.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(githubController.getIntegrationDetails));
router.post('/sync', asyncHandler(githubController.syncActivity));
router.delete('/disconnect', asyncHandler(githubController.disconnectAccount));

export const githubRoutes = router;
export default githubRoutes;
/**
 * Express routing maps.
 */
