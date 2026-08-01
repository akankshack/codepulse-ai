/**
 * @file goal.routes.ts
 * @description Express routing paths for Goal management.
 */

import { Router } from 'express';
import { goalController } from '../controllers/goal.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(goalController.getMyGoals));
router.post('/', asyncHandler(goalController.createGoal));
router.put('/:id', asyncHandler(goalController.updateGoal));
router.delete('/:id', asyncHandler(goalController.deleteGoal));

export const goalRoutes = router;
export default goalRoutes;
