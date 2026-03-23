import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as driverController from '../controllers/driverController';

const router = Router();

router.get('/', authenticate, driverController.list);
router.get('/:id', authenticate, driverController.getById);
router.post('/', authenticate, driverController.create);
router.put('/:id', authenticate, driverController.update);

export default router;
