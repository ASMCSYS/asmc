import express from 'express';
import { authenticateUser } from '../../../middlewares/authentication.js';
import { checkPermission } from '../../../middlewares/permission.js';
import { BIOMETRIC_ATTENDANCE_PERMISSIONS } from '../../../utils/permissions.utils.js';
import {
    getAllAttendanceLogs,
    getMachineAttendanceLogs,
    getStaffAttendanceLogs,
    createAttendanceLog,
    getAttendanceStats,
    syncAttendanceLogs,
    importMachineAttendanceData,
    validateMachineImportData,
    downloadMachineSampleFormat,
    upload,
} from './attendance.controller.js';

const router = express.Router();

// Attendance routes with proper permission checks
router.get(
    '/',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.READ),
    getAllAttendanceLogs,
);
router.get(
    '/stats',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.READ),
    getAttendanceStats,
);
router.get(
    '/machine/:machine_id',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.READ),
    getMachineAttendanceLogs,
);
router.get(
    '/staff/:staff_id',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.READ),
    getStaffAttendanceLogs,
);
router.post(
    '/sync/:machine_id',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.SYNC),
    syncAttendanceLogs,
);
router.post(
    '/',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.CREATE),
    createAttendanceLog,
);

// Machine data import routes
router.post(
    '/import',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.CREATE),
    upload.single('file'),
    importMachineAttendanceData,
);

router.post(
    '/import/validate',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.CREATE),
    upload.single('file'),
    validateMachineImportData,
);

router.get(
    '/import/sample',
    authenticateUser,
    checkPermission(BIOMETRIC_ATTENDANCE_PERMISSIONS.READ),
    downloadMachineSampleFormat,
);

export default router;
