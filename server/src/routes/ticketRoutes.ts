import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import * as ticketController from '../controllers/ticketController';

const router = Router();

router.get('/', authenticate, ticketController.list);
router.get('/:id', authenticate, ticketController.getById);
router.post('/', authenticate, ticketController.create);
router.put('/:id/cancel', authenticate, authorize('Admin', 'Supervisor'), ticketController.cancel);
router.put('/:id/waive', authenticate, authorize('Admin'), ticketController.waive);

export default router;
