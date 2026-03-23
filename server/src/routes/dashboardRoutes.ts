import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as dashboardController from '../controllers/dashboardController';

const router = Router();

router.get('/stats', authenticate, dashboardController.getStats);

export default router;
