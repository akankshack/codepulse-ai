/**
 * @file task.routes.ts
 * @description Express routing paths for Task issues CRUD actions.
 */

import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.use(requireAuth);

router.get('/my', asyncHandler(taskController.getMyTasks));
router.get('/project/:projectId', asyncHandler(taskController.getProjectTasks));
router.get('/:id', asyncHandler(taskController.getTaskDetails));
router.post('/', asyncHandler(taskController.createTask));
router.put('/:id', asyncHandler(taskController.updateTask));
router.delete('/:id', asyncHandler(taskController.deleteTask));

export const taskRoutes = router;
export default taskRoutes;
