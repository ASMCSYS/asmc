'use strict';
import express from 'express';
import reqValidator from '../../middlewares/req.validator.js';
import { authenticateUser, getAuthUser } from '../../middlewares/authentication.js';
import { checkPermission } from '../../middlewares/permission.js';
import { EVENTS_PERMISSIONS } from '../../utils/permissions.utils.js';
import {
    insertEvents,
    getEventsList,
    getActiveEventsList,
    getSingleEvents,
    editEvents,
    removeEvents,
    getActiveEventsDropdown,
    // booking event apis
    insertEventBooking,
    getEventsBookingList,
    updateEventBooking,
    getGuestEvents,
    updateEventsBookingStatus,
} from './events.controller.js';
import {
    insertEventsVal,
    getEventsListVal,
    singleEventsVal,
    editEventsVal,
    // booking event apis
    insertEventBookingVal,
    getEventsBookingListVal,
    updateEventBookingVal,
    guestEventsVal,
} from './events.validator.js';

const router = express.Router();

router.post('/', authenticateUser, checkPermission(EVENTS_PERMISSIONS.CREATE), reqValidator(insertEventsVal), insertEvents);
router.get('/active', getAuthUser, getActiveEventsList);
router.get('/dropdown', getAuthUser, getActiveEventsDropdown);
router.get('/list', getAuthUser, reqValidator(getEventsListVal), getEventsList);
router.get('/', getAuthUser, reqValidator(singleEventsVal), getSingleEvents);
router.put('/', authenticateUser, checkPermission(EVENTS_PERMISSIONS.UPDATE), reqValidator(editEventsVal), editEvents);
router.delete('/', authenticateUser, checkPermission(EVENTS_PERMISSIONS.DELETE), reqValidator(singleEventsVal), removeEvents);

// event booking
router.post('/event-booking', reqValidator(insertEventBookingVal), insertEventBooking);
router.put(
    '/event-booking',
    authenticateUser,
    checkPermission(EVENTS_PERMISSIONS.UPDATE),
    reqValidator(updateEventBookingVal),
    updateEventBooking,
);
router.get(
    '/event-booking/list',
    authenticateUser,
    checkPermission(EVENTS_PERMISSIONS.READ),
    reqValidator(getEventsBookingListVal),
    getEventsBookingList,
);
router.patch('/event-booking', authenticateUser, checkPermission(EVENTS_PERMISSIONS.UPDATE), updateEventsBookingStatus);
router.get('/guest-event-booking', reqValidator(guestEventsVal), getGuestEvents);

export default router;
