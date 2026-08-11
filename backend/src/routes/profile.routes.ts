/**
 * @file profile.routes.ts
 * @description Express routing paths for Developer Profile statistics.
 */

import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(profileController.getProfile));
router.put('/', asyncHandler(profileController.updateProfile));

export const profileRoutes = router;
export default profileRoutes;
/**
 * Express routing maps.
 */
