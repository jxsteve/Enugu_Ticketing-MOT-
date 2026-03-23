import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/', authenticate, authorize('Admin'), userController.list);
router.post('/', authenticate, authorize('Admin'), userController.create);
router.put('/:id', authenticate, authorize('Admin'), userController.update);

export default router;
