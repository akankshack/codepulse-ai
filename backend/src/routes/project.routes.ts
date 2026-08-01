/**
 * @file project.routes.ts
 * @description Express routing paths for Project CRUD actions.
 */

import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(projectController.getMyProjects));
router.get('/:id', asyncHandler(projectController.getProjectDetails));
router.post('/', asyncHandler(projectController.createProject));
router.put('/:id', asyncHandler(projectController.updateProject));
router.delete('/:id', asyncHandler(projectController.deleteProject));

export const projectRoutes = router;
export default projectRoutes;
