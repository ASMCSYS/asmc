'use strict';
import express from 'express';
import { autoLogger } from '../middlewares/autoLogger.js';

import authRoutes from '../controller/auth/auth.route.js';
import membersRoutes from '../controller/members/members.route.js';
import plansRoutes from '../controller/plans/plans.route.js';
import commonRoutes from '../controller/common/common.route.js';
import mastersRoutes from '../controller/masters/masters.route.js';
import activityRoutes from '../controller/activity/activity.route.js';
import bookingsRoutes from '../controller/bookings/bookings.route.js';
import paymentRoutes from '../controller/payment/payment.route.js';
import eventsRoutes from '../controller/events/events.route.js';
import reportsRoutes from '../controller/reports/reports.route.js';
import hallsRoutes from '../controller/halls/halls.route.js';
import staffRoutes from '../controller/staff/staff.route.js';
import logsRoutes from '../controller/logs/logs.route.js';

// Biometric routes
import biometricMachineRoutes from '../controller/biometric/machines/machines.route.js';
import biometricAttendanceRoutes from '../controller/biometric/attendance/attendance.route.js';
import biometricStaffRoutes from '../controller/biometric/staff/staff.route.js';
import biometricRegularizationRoutes from '../controller/biometric/regularization/regularization.route.js';
import biometricNotificationRoutes from '../controller/biometric/notifications/notifications.route.js';
import documentationRoutes from '../controller/documentation/documentation.route.js';

const router = express.Router();

// Apply auto-logging middleware to all routes
router.use(
    autoLogger({
        excludePaths: [
            '/logs',
            '/health',
            '/metrics',
            '/auth/login',
            '/auth/refresh',
            '/common/upload-single-image',
            '/common/upload-multiple-image',
        ],
        excludeMethods: ['HEAD', 'OPTIONS'],
    }),
);

router.use('/auth', authRoutes);
router.use('/members', membersRoutes);
router.use('/plans', plansRoutes);
router.use('/common', commonRoutes);
router.use('/masters', mastersRoutes);
router.use('/activity', activityRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/payment', paymentRoutes);
router.use('/events', eventsRoutes);
router.use('/reports', reportsRoutes);
router.use('/halls', hallsRoutes);
router.use('/staff', staffRoutes);
router.use('/logs', logsRoutes);

// Biometric routes
router.use('/biometric/machines', biometricMachineRoutes);
router.use('/biometric/attendance', biometricAttendanceRoutes);
router.use('/biometric/staff', biometricStaffRoutes);
router.use('/biometric/regularization', biometricRegularizationRoutes);
router.use('/biometric/notifications', biometricNotificationRoutes);

// Documentation routes
router.use('/documentation', documentationRoutes);

export default router;
