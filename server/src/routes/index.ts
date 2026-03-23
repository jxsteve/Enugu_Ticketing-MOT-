import { Router } from 'express';
import authRoutes from './authRoutes';
import driverRoutes from './driverRoutes';
import ticketRoutes from './ticketRoutes';
import offenceRoutes from './offenceRoutes';
import paymentRoutes from './paymentRoutes';
import dashboardRoutes from './dashboardRoutes';
import auditRoutes from './auditRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/drivers', driverRoutes);
router.use('/tickets', ticketRoutes);
router.use('/offences', offenceRoutes);
router.use('/payments', paymentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/audit', auditRoutes);
router.use('/users', userRoutes);

export default router;
