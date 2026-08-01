/**
 * @file activity.routes.ts
 * @description Express routing paths for Activity Timelines and Alerts.
 */

import { Router } from 'express';
import { activityController } from '../controllers/activity.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.use(requireAuth);

router.get('/timeline', asyncHandler(activityController.getMyTimeline));
router.get('/notifications', asyncHandler(activityController.getMyNotifications));
router.patch('/notifications/:id/read', asyncHandler(activityController.markAsRead));
router.post('/timeline', asyncHandler(activityController.logActivity));

export const activityRoutes = router;
export default activityRoutes;
