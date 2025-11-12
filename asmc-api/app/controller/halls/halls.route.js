'use strict';
import express from 'express';
import reqValidator from '../../middlewares/req.validator.js';
import { authenticateUser, getAuthUser } from '../../middlewares/authentication.js';
import { checkPermission } from '../../middlewares/permission.js';
import { HALLS_PERMISSIONS } from '../../utils/permissions.utils.js';
import {
    insertHalls,
    getHallsList,
    getActiveHallsList,
    getSingleHalls,
    editHalls,
    removeHalls,
    // booking hall apis
    insertHallBooking,
    getHallsBookingList,
    updateHallBooking,
    getHallsBookedDates,
    updateHallsBookingStatus,
} from './halls.controller.js';
import {
    insertHallsVal,
    getHallsListVal,
    singleHallsVal,
    editHallsVal,
    // booking hall apis
    insertHallBookingVal,
    getHallsBookingListVal,
    updateHallBookingVal,
} from './halls.validator.js';

const router = express.Router();

router.post(
    '/',
    authenticateUser,
    checkPermission(HALLS_PERMISSIONS.CREATE),
    reqValidator(insertHallsVal),
    insertHalls,
);
router.get('/active', reqValidator(getHallsListVal), getActiveHallsList);
router.get(
    '/list',
    authenticateUser,
    checkPermission(HALLS_PERMISSIONS.READ),
    reqValidator(getHallsListVal),
    getHallsList,
);
router.get('/', reqValidator(singleHallsVal), getSingleHalls);
router.put(
    '/',
    authenticateUser,
    checkPermission(HALLS_PERMISSIONS.UPDATE),
    reqValidator(editHallsVal),
    editHalls,
);
router.delete(
    '/',
    authenticateUser,
    checkPermission(HALLS_PERMISSIONS.DELETE),
    reqValidator(singleHallsVal),
    removeHalls,
);

// hall booking
router.post('/hall-booking', reqValidator(insertHallBookingVal), insertHallBooking);
router.put(
    '/hall-booking',
    authenticateUser,
    checkPermission(HALLS_PERMISSIONS.UPDATE),
    reqValidator(updateHallBookingVal),
    updateHallBooking,
);
router.get(
    '/hall-booking/list',
    authenticateUser,
    checkPermission(HALLS_PERMISSIONS.READ),
    reqValidator(getHallsBookingListVal),
    getHallsBookingList,
);
router.patch(
    '/hall-booking',
    authenticateUser,
    checkPermission(HALLS_PERMISSIONS.UPDATE),
    updateHallsBookingStatus,
);
router.get('/get-booked-halls-dates', authenticateUser, getHallsBookedDates);

export default router;
