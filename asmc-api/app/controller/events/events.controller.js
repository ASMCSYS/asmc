'use strict';

import mongoose from 'mongoose';
import { responseSend } from '../../helpers/responseSend.js';
import Events from '../../models/events.js';
import { httpCodes } from '../../utils/httpcodes.js';
import {
    readEvents,
    createEvents,
    readAllEvents,
    updateEvents,
    deleteEvents,
    readActiveEvents,
    createEventsBooking,
    readAllEventsBooking,
    readEventsBooking,
    updateEventsBooking,
} from './events.service.js';
import Location from '../../models/location.js';
import EventBookings from '../../models/event_booking.js';
import { readPaymentHistory } from '../payment/payment.service.js';
import { readLocation } from '../masters/masters.service.js';
import { deleteImageKitByUrl } from '../../middlewares/imagekit.js';

export const insertEvents = async (req, res, next) => {
    try {
        req.body.sublocation_id = req.body.sublocation_id
            ? req.body.sublocation_id
            : null;
        req.body.status = false;
        let doc = await createEvents(req.body);
        if (doc) {
            return responseSend(res, httpCodes.OK, 'Event Created Successfully', doc);
        }
    } catch (error) {
        next(error);
    }
};

export const getEventsList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = null,
            event_id = null,
        } = req.query;

        let filter = {};

        if (active == 'true') filter.status = true;
        else if (!req.session) {
            filter.status = true;
        }

        if (active === 'upcoming') {
            filter.start_date = { $gte: new Date() };
        }

        if (event_id && event_id !== '') filter.event_id = parseInt(event_id);

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [{ event_name: { $regex: keywords, $options: 'i' } }],
            };

        let result = await readAllEvents(
            filter,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Events records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getActiveEventsList = async (req, res, next) => {
    try {
        const { event_type = null } = req.query;

        let filter = { status: true };

        if (event_type) {
            filter.event_type = event_type;
        }

        let result = await readActiveEvents(filter);

        responseSend(res, httpCodes.OK, 'Events records', result);
    } catch (error) {
        next(error);
    }
};

export const getActiveEventsDropdown = async (req, res, next) => {
    try {
        const { keywords = '', _id = null } = req.query;

        let filter = { status: true };

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [{ event_name: { $regex: keywords, $options: 'i' } }],
            };

        if (_id) filter._id = mongoose.Types.ObjectId(_id);

        let result = await Events.find(filter)
            .select('_id event_name event_type members_type')
            .limit(10)
            .lean();

        responseSend(res, httpCodes.OK, 'Events records', result);
    } catch (error) {
        next(error);
    }
};

export const getSingleEvents = async (req, res, next) => {
    try {
        const { _id, event_id } = req.query;
        if (!_id && !event_id) {
            throw new Error('Event id is required!');
        }
        let result = await readEvents(event_id ? { event_id } : { _id });

        result.location_data = await Location.find(
            { _id: result.location_id },
            { title: 1, _id: 1 },
        );

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editEvents = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let records = await readEvents({ _id });
        if (!records) {
            throw new Error('Events does not exist!');
        }

        // Delete old images in array if changed
        if (Array.isArray(records.images) && Array.isArray(req.body.images)) {
            for (let i = 0; i < records.images.length; i++) {
                const oldImg = records.images[i];
                const newImg = req.body.images[i];
                if (
                    oldImg &&
                    newImg &&
                    oldImg !== newImg &&
                    !oldImg.includes('no-image.png')
                ) {
                    await deleteImageKitByUrl(oldImg);
                }
            }
        }

        req.body.sublocation_id = req.body.sublocation_id
            ? req.body.sublocation_id
            : null;

        await updateEvents({ _id }, req.body);
        records = await readEvents({ _id });
        responseSend(res, httpCodes.OK, 'Events updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeEvents = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readEvents({ _id });
        if (!records) {
            throw new Error('Events does not exist!');
        }

        records = await deleteEvents({ _id });
        responseSend(res, httpCodes.OK, 'Events deleted successfully', records);
    } catch (error) {
        next(error);
    }
};

// event booking apis
export const insertEventBooking = async (req, res, next) => {
    try {
        // check if already have booking for any verifiedmember or nonverified member email address
        const { member_data, non_member_data, event_id } = req.body;
        const bookingCooldownMinutes = 5; // Cooldown period in minutes

        const emailsToCheck = [
            ...member_data.map((member) => member.email),
            ...non_member_data.map((nonMember) => nonMember.email),
        ];

        const currentTime = new Date();
        const pendingCutoffTime = new Date(
            currentTime.getTime() - bookingCooldownMinutes * 60000,
        );

        const alreadyBooked = await EventBookings.findOne({
            $and: [
                {
                    $or: [
                        { 'member_data.email': { $in: emailsToCheck } },
                        { 'non_member_data.email': { $in: emailsToCheck } },
                    ],
                },
                {
                    $or: [
                        { payment_status: 'Success' }, // Successful booking
                        {
                            payment_status: 'Pending',
                            createdAt: { $gte: pendingCutoffTime }, // Recent pending booking within cooldown
                        },
                    ],
                },
                { event_id: mongoose.Types.ObjectId(event_id) },
            ],
        });

        if (alreadyBooked) {
            // Find the email(s) that already have a successful booking
            const bookedEmails = [
                ...alreadyBooked.member_data.map((member) => member.email),
                ...alreadyBooked.non_member_data.map((nonMember) => nonMember.email),
            ].filter((email) => emailsToCheck.includes(email)); // Filter to return only matching emails

            if (bookedEmails.length > 0) {
                if (alreadyBooked.payment_status === 'Success') {
                    throw new Error(
                        `Booking already exists for email(s): ${bookedEmails.join(', ')}`,
                    );
                } else {
                    const timeRemaining = Math.ceil(
                        (alreadyBooked.createdAt.getTime() +
                            bookingCooldownMinutes * 60000 -
                            currentTime.getTime()) /
                            1000,
                    );
                    throw new Error(
                        `A pending booking exists for email(s): ${bookedEmails.join(
                            ', ',
                        )}. Please wait ${timeRemaining} seconds before trying again.`,
                    );
                }
            }
        }

        let doc = await createEventsBooking(req.body);
        if (doc) {
            return responseSend(
                res,
                httpCodes.OK,
                'Event Booking Created Successfully',
                doc,
            );
        }
    } catch (error) {
        next(error);
    }
};

export const updateEventBooking = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let records = await readEventsBooking({ _id });
        if (!records) {
            throw new Error('Events Booking does not exist!');
        }

        records = await updateEventsBooking({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Bookings updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const updateEventsBookingStatus = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readEventsBooking({ _id });
        if (!records) {
            throw new Error('Events Booking does not exist!');
        }

        records = await updateEventsBooking({ _id }, { status: req.query.status });
        responseSend(res, httpCodes.OK, 'Bookings updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const getEventsBookingList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = null,
            event_id = null,
        } = req.query;

        let filter = { payment_status: 'Success' };

        if (active == 'true') filter.status = true;
        else if (!req.session) {
            filter.status = true;
        }

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { booking_id: parseInt(keywords) },
                    { 'events_data.event_id': parseInt(keywords) },
                    { 'events_data.event_name': { $regex: keywords, $options: 'i' } },
                    { 'member_id_data.name': { $regex: keywords, $options: 'i' } },
                    { 'member_id_data.mobile': { $regex: keywords, $options: 'i' } },
                    { 'member_id_data.email': { $regex: keywords, $options: 'i' } },
                    { 'member_id_data.member_id': parseInt(keywords) },
                ],
            };

        if (event_id) filter['events_data.event_id'] = event_id;

        let result = await readAllEventsBooking(
            filter,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Events Booking records', {
            ...result,
            ...req.query,
        });
    } catch (error) {
        next(error);
    }
};

export const getGuestEvents = async (req, res, next) => {
    try {
        const { order_id } = req.query;
        if (!order_id) {
            throw new Error('Order id is required!');
        }
        let result = await readPaymentHistory({ order_id });

        if (!result) {
            throw new Error('Order does not exist!');
        }

        const bookedEventData = await readEventsBooking({
            _id: result.event_booking_id[0],
        });

        const eventData = await readEvents({
            _id: mongoose.Types.ObjectId(bookedEventData.event_id),
        });

        bookedEventData.event_data = eventData;
        bookedEventData.event_data.location_data = await readLocation({
            _id: mongoose.Types.ObjectId(eventData.location_id),
        });

        return responseSend(res, httpCodes.OK, 'Success', bookedEventData);
    } catch (error) {
        next(error);
    }
};
