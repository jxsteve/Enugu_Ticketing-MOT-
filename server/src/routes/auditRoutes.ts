import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import * as auditController from '../controllers/auditController';

const router = Router();

router.get('/', authenticate, authorize('Admin', 'Supervisor'), auditController.list);

export default router;
