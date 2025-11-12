import express from 'express';
import {
    createRegularizationRequest,
    getRegularizationRequests,
    approveRegularizationRequest,
    rejectRegularizationRequest,
    getRegularizationHistory,
} from './regularization.controller.js';
import { authenticateUser } from '../../../middlewares/authentication.js';
import { checkPermission } from '../../../middlewares/permission.js';
import { BIOMETRIC_REGULARIZATION_PERMISSIONS } from '../../../utils/permissions.utils.js';

const router = express.Router();

// Create regularization request
router.post(
    '/',
    authenticateUser,
    checkPermission(BIOMETRIC_REGULARIZATION_PERMISSIONS.CREATE),
    createRegularizationRequest,
);

// Get regularization requests
router.get(
    '/',
    authenticateUser,
    checkPermission(BIOMETRIC_REGULARIZATION_PERMISSIONS.READ),
    getRegularizationRequests,
);

// Approve regularization request
router.put(
    '/:id/approve',
    authenticateUser,
    checkPermission(BIOMETRIC_REGULARIZATION_PERMISSIONS.APPROVE),
    approveRegularizationRequest,
);

// Reject regularization request
router.put(
    '/:id/reject',
    authenticateUser,
    checkPermission(BIOMETRIC_REGULARIZATION_PERMISSIONS.REJECT),
    rejectRegularizationRequest,
);

// Get regularization history for attendance log
router.get(
    '/history/:attendance_log_id',
    authenticateUser,
    checkPermission(BIOMETRIC_REGULARIZATION_PERMISSIONS.READ),
    getRegularizationHistory,
);

export default router;
