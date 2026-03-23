import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import * as offenceController from '../controllers/offenceController';

const router = Router();

router.get('/', authenticate, offenceController.list);
router.put('/:code', authenticate, authorize('Admin'), offenceController.update);

export default router;
