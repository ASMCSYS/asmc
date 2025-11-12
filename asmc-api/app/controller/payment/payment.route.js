'use strict';
import express from 'express';
import { authenticateUser, getAuthUser } from '../../middlewares/authentication.js';
import { checkPermission } from '../../middlewares/permission.js';
import { PAYMENT_PERMISSIONS } from '../../utils/permissions.utils.js';
import {
    initiatePayment,
    gePaymentHistoryList,
    updatePaymentStatus,
    ccavenueResponse,
    ccavenueRenewResponse,
    renewPayment,
    bookingPayment,
    ccavenueBookingPaymentResponse,
    handleOfflinePayment,
    ccavenueStatusReconcile,
    initiateEventPayment,
    ccavenueResponseEventPayment,
    updatePaymentRemarks,
    initiateHallPayment,
    ccavenueResponseHallPayment,
    initiateRemainHallPayment,
    ccavenueResponseRemainHallPayment,
} from './payment.controller.js';
import {
    gePaymentHistoryListVal,
    updatePaymentStatusVal,
    updateRemarkVal,
} from './payment.validator.js';
import reqValidator from '../../middlewares/req.validator.js';

const router = express.Router();

router.post('/initiate-payment', authenticateUser, initiatePayment);

router.get(
    '/payment-list',
    authenticateUser,
    checkPermission(PAYMENT_PERMISSIONS.READ),
    reqValidator(gePaymentHistoryListVal),
    gePaymentHistoryList,
);

router.patch(
    '/update-remark',
    authenticateUser,
    checkPermission(PAYMENT_PERMISSIONS.READ),
    reqValidator(updateRemarkVal),
    updatePaymentRemarks,
);

router.post('/ccavenue-response', ccavenueResponse);

router.put(
    '/payment-status',
    authenticateUser,
    reqValidator(updatePaymentStatusVal),
    updatePaymentStatus,
);

router.post('/renew-payment', authenticateUser, renewPayment);

router.post('/ccavenue-renew-response', ccavenueRenewResponse);

router.post('/booking-payment', authenticateUser, bookingPayment);

router.post('/ccavenue-booking-payment-response', ccavenueBookingPaymentResponse);

router.post('/offline-payment', handleOfflinePayment);

router.post('/ccavenue-status-reconcile', ccavenueStatusReconcile);

router.post('/initiate-event-payment', getAuthUser, initiateEventPayment);
router.post('/ccavenue-event-payment-response', ccavenueResponseEventPayment);

router.post('/initiate-hall-payment', getAuthUser, initiateHallPayment);
router.post('/ccavenue-hall-payment-response', ccavenueResponseHallPayment);

router.post('/initiate-remain-hall-payment', getAuthUser, initiateRemainHallPayment);
router.post('/ccavenue-remain-hall-payment-response', ccavenueResponseRemainHallPayment);

export default router;
