import express from 'express';
import { authenticateUser } from '../../../middlewares/authentication.js';
import { checkPermission } from '../../../middlewares/permission.js';
import { BIOMETRIC_MACHINE_PERMISSIONS } from '../../../utils/permissions.utils.js';
import {
    getAllMachines,
    getMachineById,
    createMachine,
    updateMachine,
    deleteMachine,
    getMachineStats,
    getMachineStaff,
    testMachineConnection,
    testNetworkConnectivity,
    getCurrentNetworkInfo,
    scanNetworkForDevices,
    testSpecificPort,
    getESSLDeviceInfo,
    getESSLAttendanceLogs,
    getESSLUsers,
} from './machines.controller.js';

const router = express.Router();

// Machine routes with proper permission checks
router.get(
    '/',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.READ),
    getAllMachines,
);
router.get(
    '/stats',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.READ),
    getMachineStats,
);
router.get(
    '/network-info',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.READ),
    getCurrentNetworkInfo,
);
router.get(
    '/scan-network',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.READ),
    scanNetworkForDevices,
);
router.post(
    '/test-network',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.READ),
    testNetworkConnectivity,
);
router.post(
    '/test-port',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.READ),
    testSpecificPort,
);
router.get(
    '/:id',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.READ),
    getMachineById,
);
router.get(
    '/:id/staff',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.READ),
    getMachineStaff,
);
router.get(
    '/:id/test-connection',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.READ),
    testMachineConnection,
);
router.get(
    '/:id/essl-info',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.READ),
    getESSLDeviceInfo,
);
router.get(
    '/:id/essl-attendance',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.READ),
    getESSLAttendanceLogs,
);
router.get(
    '/:id/essl-users',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.READ),
    getESSLUsers,
);
router.post(
    '/',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.CREATE),
    createMachine,
);
router.put(
    '/:id',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.UPDATE),
    updateMachine,
);
router.delete(
    '/:id',
    authenticateUser,
    checkPermission(BIOMETRIC_MACHINE_PERMISSIONS.DELETE),
    deleteMachine,
);

export default router;
