'use strict';
import express from 'express';
import { authenticateUser } from '../../middlewares/authentication.js';
import { checkPermission } from '../../middlewares/permission.js';
import { REPORTS_PERMISSIONS } from '../../utils/permissions.utils.js';
import {
    exportMembers,
    exportEnrollment,
    exportBatchWise,
    exportRenewalReport,
    exportPaymentSummary,
    exportPaymentReport,
    exportEventBookings,
    exportHallBookings,
} from './reports.controller.js';
import { exportValidator } from './reports.validator.js';
import reqValidator from '../../middlewares/req.validator.js';

const router = express.Router();

router.get(
    '/members',
    authenticateUser,
    checkPermission(REPORTS_PERMISSIONS.MEMBERS.EXPORT_DATA),
    reqValidator(exportValidator),
    exportMembers,
);

router.get(
    '/enrollment',
    authenticateUser,
    checkPermission(REPORTS_PERMISSIONS.ENROLL_ACTIVITY.EXPORT_DATA),
    reqValidator(exportValidator),
    exportEnrollment,
);

router.get(
    '/batch-wise',
    authenticateUser,
    checkPermission(REPORTS_PERMISSIONS.BATCH.EXPORT_DATA),
    reqValidator(exportValidator),
    exportBatchWise,
);

router.get(
    '/renewal',
    authenticateUser,
    checkPermission(REPORTS_PERMISSIONS.RENEWAL.EXPORT_DATA),
    reqValidator(exportValidator),
    exportRenewalReport,
);

router.get(
    '/payment-summary',
    // authenticateUser,
    reqValidator(exportValidator),
    exportPaymentSummary,
);

router.get(
    '/payment-report',
    // authenticateUser,
    reqValidator(exportValidator),
    exportPaymentReport,
);

router.get(
    '/event-bookings',
    authenticateUser,
    checkPermission(REPORTS_PERMISSIONS.EVENT.EXPORT_DATA),
    reqValidator(exportValidator),
    exportEventBookings,
);

router.get(
    '/hall-bookings',
    authenticateUser,
    checkPermission(REPORTS_PERMISSIONS.HALL.EXPORT_DATA),
    reqValidator(exportValidator),
    exportHallBookings,
);

export default router;
