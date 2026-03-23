import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as paymentController from '../controllers/paymentController';

const router = Router();

router.get('/ticket/:ticketId', authenticate, paymentController.getByTicket);
router.post('/webhook', paymentController.webhook); // No auth - verified by signature

export default router;
