import express from 'express';
import { authenticateUser } from '../../../middlewares/authentication.js';
import { checkPermission } from '../../../middlewares/permission.js';
import { BIOMETRIC_ATTENDANCE_PERMISSIONS } from '../../../utils/permissions.utils.js';
import {
    getAllStaffWithBiometric,
    assignStaffToMachine,
    removeStaffFromMachine,
    getMachineStaff,
    getStaffBiometricStats,
    syncStaffToMachine,
    startAutomaticEnrollment,
    checkEnrollmentStatus,
    cancelEnrollment,
    getAllEnrollmentStatus,
} from './staff.controller.js';

const router = express.Router();

// Staff biometric routes with proper permission checks
router.get(
    '/',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.READ),
    getAllStaffWithBiometric,
);
router.get(
    '/stats',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.READ),
    getStaffBiometricStats,
);
router.get(
    '/machine/:machine_id',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.READ),
    getMachineStaff,
);
router.post(
    '/assign',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.CREATE),
    assignStaffToMachine,
);
router.delete(
    '/:staff_id',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.DELETE),
    removeStaffFromMachine,
);

// Sync all staff to a specific machine
router.post(
    '/sync-to-machine/:machine_id',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.CREATE),
    syncStaffToMachine,
);

// Automatic biometric enrollment routes
router.post(
    '/:staff_id/enrollment/start-automatic',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.CREATE),
    startAutomaticEnrollment,
);

router.get(
    '/:staff_id/enrollment/status',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.READ),
    checkEnrollmentStatus,
);

router.delete(
    '/:staff_id/enrollment/cancel',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.DELETE),
    cancelEnrollment,
);

router.get(
    '/enrollment/status',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.READ),
    getAllEnrollmentStatus,
);

export default router;
