/**
 * @file index.ts
 * @description Master Express Router registering and mounting all platform routing modules.
 * 
 * PURPOSE:
 * Serves as the central router registering endpoints (Health, Auth, Projects, Tasks,
 * Sessions, Goals, Activities, and AI coaching).
 * 
 * ROLE IN REQUEST FLOW:
 * Mounted in `src/app.ts` under `/api/v1` namespace.
 */

import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { authRoutes } from './auth.routes';
import { projectRoutes } from './project.routes';
import { taskRoutes } from './task.routes';
import { sessionRoutes } from './session.routes';
import { goalRoutes } from './goal.routes';
import { aiRoutes } from './ai.routes';
import { activityRoutes } from './activity.routes';

const router = Router();

// Mount system routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

// Mount business domains
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/sessions', sessionRoutes);
router.use('/goals', goalRoutes);
router.use('/ai', aiRoutes);
router.use('/activities', activityRoutes);

export const mainRouter = router;
export default mainRouter;
