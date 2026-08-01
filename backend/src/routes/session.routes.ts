/**
 * @file session.routes.ts
 * @description Express routing paths for WakaTime-like Coding Sessions.
 */

import { Router } from 'express';
import { sessionController } from '../controllers/session.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(sessionController.getMySessions));
router.get('/recent', asyncHandler(sessionController.getRecentSessions));
router.post('/log', asyncHandler(sessionController.logSession));
router.delete('/:id', asyncHandler(sessionController.deleteSession));

export const sessionRoutes = router;
export default sessionRoutes;
