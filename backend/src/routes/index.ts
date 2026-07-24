/**
 * @file index.ts
 * @description Master router aggregating all feature routers under the `/api/v1` namespace.
 * 
 * PURPOSE:
 * Centralized entry point for mounting API endpoints cleanly (health, auth, tasks, projects, etc.).
 * 
 * ROLE IN REQUEST FLOW:
 * Mounted in `src/app.ts` as `app.use('/api/v1', mainRouter)` -> Routes incoming requests to specific feature routers.
 */

import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { authRoutes } from './auth.routes';

const router = Router();

// Mount feature routers
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

export const mainRouter = router;
