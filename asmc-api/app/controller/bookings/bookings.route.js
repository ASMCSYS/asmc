'use strict';

import express from 'express';
import reqValidator from '../../middlewares/req.validator.js';

import {
    insertBookings,
    getBookingsList,
    getSingleBookings,
    editBookings,
    updateStatusBookings,
    removeBookings,
    paymentUpdateBookings,
    tempUpdateStatus,
    updateRenewButton,
    insertBatchBookings,
} from './bookings.controller.js';

import {
    insertBookingsVal,
    getBookingsListVal,
    singleBookingsVal,
    statusBookingsVal,
    editBookingsVal,
    paymentBookingsVal,
    insertEnrollmentVal,
} from './bookings.validator.js';
import { authenticateUser } from '../../middlewares/authentication.js';
import { imageProcessingSingle } from '../../middlewares/image.processing.js';
import { checkPermission } from '../../middlewares/permission.js';
import { BOOKINGS_PERMISSIONS } from '../../utils/permissions.utils.js';

const router = express.Router();

router.post('/', authenticateUser, checkPermission(BOOKINGS_PERMISSIONS.CREATE), reqValidator(insertEnrollmentVal), insertBookings);
router.post('/batch-booking', authenticateUser, checkPermission(BOOKINGS_PERMISSIONS.CREATE), insertBatchBookings);
router.get('/list', authenticateUser, checkPermission(BOOKINGS_PERMISSIONS.READ), reqValidator(getBookingsListVal), getBookingsList);
router.get('/', reqValidator(singleBookingsVal), getSingleBookings);
router.put('/', authenticateUser, checkPermission(BOOKINGS_PERMISSIONS.UPDATE), reqValidator(editBookingsVal), editBookings);
router.put(
    '/status',
    authenticateUser,
    checkPermission(BOOKINGS_PERMISSIONS.UPDATE),
    reqValidator(statusBookingsVal),
    updateStatusBookings,
);
router.put(
    '/payment',
    imageProcessingSingle,
    reqValidator(paymentBookingsVal),
    paymentUpdateBookings,
);
router.delete('/', authenticateUser, checkPermission(BOOKINGS_PERMISSIONS.DELETE), reqValidator(singleBookingsVal), removeBookings);

router.put('/renew-button', updateRenewButton);

// temp update payment status and status to active
router.get('/temp-update', tempUpdateStatus);

export default router;
