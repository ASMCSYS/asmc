'use strict';

import mongoose from 'mongoose';
import { responseSend } from '../../helpers/responseSend.js';
import HallBookings from '../../models/hall_booking.js';
import Location from '../../models/location.js';
import { httpCodes } from '../../utils/httpcodes.js';
import {
    readHalls,
    createHalls,
    readAllHalls,
    updateHalls,
    deleteHalls,
    readActiveHalls,
    createHallsBooking,
    readAllHallsBooking,
    readHallsBooking,
    updateHallsBooking,
} from './halls.service.js';
import Halls from '../../models/halls.js';
import { deleteImageKitByUrl } from '../../middlewares/imagekit.js';

export const insertHalls = async (req, res, next) => {
    try {
        let doc = await createHalls(req.body);
        if (doc) {
            return responseSend(res, httpCodes.OK, 'Event Created Successfully', doc);
        }
    } catch (error) {
        next(error);
    }
};

export const getHallsList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = null,
        } = req.query;

        let filter = {};

        if (active == 'true') filter.status = true;
        else if (!req.session) {
            filter.status = true;
        }

        if (active === 'upcoming') {
            filter.start_date = { $gte: new Date() };
        }

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [{ name: { $regex: keywords, $options: 'i' } }],
            };

        let result = await readAllHalls(
            filter,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Halls records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getActiveHallsList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = 1,
            sortField = 'name',
            facility_id = null,
        } = req.query;

        let filter = {
            status: true,
        };

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: keywords, $options: 'i' } },
                    { short_description: { $regex: keywords, $options: 'i' } },
                    { category: { $regex: keywords, $options: 'i' } },
                ],
            };

        let result = await readAllHalls(
            filter,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );
        responseSend(res, httpCodes.OK, 'Halls records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getSingleHalls = async (req, res, next) => {
    try {
        const { _id, hall_id } = req.query;
        if (!_id && !hall_id) {
            throw new Error('Hall id is required!');
        }
        let result = await readHalls(hall_id ? { hall_id } : { _id });

        result.location_data = await Location.findOne(
            { _id: result.location_id },
            { title: 1, _id: 1 },
        );

        result.sub_location_data = await Location.findOne(
            { _id: result.sublocation_id },
            { title: 1, _id: 1 },
        );

        return responseSend(res, httpCodes.OK, 'Success', result);
    } catch (error) {
        next(error);
    }
};

export const editHalls = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let records = await readHalls({ _id });
        if (!records) {
            throw new Error('Halls does not exist!');
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
        await updateHalls({ _id }, req.body);
        records = await readHalls({ _id });
        responseSend(res, httpCodes.OK, 'Halls updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeHalls = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readHalls({ _id });
        if (!records) {
            throw new Error('Halls does not exist!');
        }

        records = await deleteHalls({ _id });
        responseSend(res, httpCodes.OK, 'Halls deleted successfully', records);
    } catch (error) {
        next(error);
    }
};

// hall booking
export const insertHallBooking = async (req, res, next) => {
    try {
        // Step 1: Check existing booking
        const {
            member_id,
            hall_id,
            is_full_payment = false,
            booking_date,
            slot_from,
            slot_to,
        } = req.body;

        const bookingCooldownMinutes = 5;
        const currentTime = new Date();
        const pendingCutoffTime = new Date(
            currentTime.getTime() - bookingCooldownMinutes * 60000,
        );
        // Step 1: Check existing booking for time conflicts
        // First, let's do a simple check to see if there are any bookings on the same date
        const sameDateBookings = await HallBookings.find({
            hall_id: mongoose.Types.ObjectId(hall_id),
            is_cancelled: false,
            $expr: {
                $eq: [
                    { $dateToString: { format: '%Y-%m-%d', date: '$booking_date' } },
                    {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: new Date(booking_date),
                        },
                    },
                ],
            },
        });

        console.log('Same date bookings found:', sameDateBookings.length);
        if (sameDateBookings.length > 0) {
            console.log(
                'Existing bookings on same date:',
                sameDateBookings.map((b) => ({
                    booking_id: b.booking_id,
                    slot_from: b.slot_from,
                    slot_to: b.slot_to,
                    payment_status: b.payment_status,
                    is_cancelled: b.is_cancelled,
                })),
            );
        }

        const alreadyBooked = await HallBookings.findOne({
            hall_id: mongoose.Types.ObjectId(hall_id),
            is_cancelled: false,
            // Check for overlapping time slots on the same date
            $and: [
                // Same date (ignoring time)
                {
                    $expr: {
                        $eq: [
                            {
                                $dateToString: {
                                    format: '%Y-%m-%d',
                                    date: '$booking_date',
                                },
                            },
                            {
                                $dateToString: {
                                    format: '%Y-%m-%d',
                                    date: new Date(booking_date),
                                },
                            },
                        ],
                    },
                },
                // Check for time slot overlap
                {
                    $or: [
                        // New slot starts during existing slot
                        {
                            $and: [
                                { slot_from: { $lte: new Date(slot_from) } },
                                { slot_to: { $gt: new Date(slot_from) } },
                            ],
                        },
                        // New slot ends during existing slot
                        {
                            $and: [
                                { slot_from: { $lt: new Date(slot_to) } },
                                { slot_to: { $gte: new Date(slot_to) } },
                            ],
                        },
                        // New slot completely contains existing slot
                        {
                            $and: [
                                { slot_from: { $gte: new Date(slot_from) } },
                                { slot_to: { $lte: new Date(slot_to) } },
                            ],
                        },
                    ],
                },
                // Only check successful or recent pending bookings
                {
                    $or: [
                        { payment_status: 'Success' },
                        { payment_status: 'Partial Paid' },
                        {
                            payment_status: 'Pending',
                            createdAt: { $gte: pendingCutoffTime },
                        },
                    ],
                },
            ],
        });

        console.log('Conflict check result:', alreadyBooked);

        if (alreadyBooked) {
            if (alreadyBooked.payment_status === 'Success') {
                throw new Error(`This hall is already booked.`);
            } else {
                const timeRemaining = Math.ceil(
                    (alreadyBooked.createdAt.getTime() +
                        bookingCooldownMinutes * 60000 -
                        currentTime.getTime()) /
                        1000,
                );
                throw new Error(
                    `Someone has a pending booking for this hall. Please wait ${timeRemaining} seconds before trying again.`,
                );
            }
        }

        // Step 2: Fetch Hall Data
        const hall = await Halls.findById(hall_id);
        if (!hall) {
            throw new Error('Hall not found.');
        }

        // Safely parse amounts
        const booking_amount = Number(hall.booking_amount || 0);
        const cleaning_charges = Number(hall.cleaning_charges || 0);
        const refundable_deposit = Number(hall.refundable_deposit || 0);
        const additional_charges = Number(hall.additional_charges || 0);
        const advance_payment_amount = Number(hall.advance_payment_amount || 0);

        // Total Booking Price
        const total_amount =
            booking_amount + cleaning_charges + refundable_deposit + additional_charges;

        // Calculate payable amount
        let amount_paid = 0;
        if (is_full_payment) {
            amount_paid = total_amount;
        } else {
            // Use advance_payment_amount if available, else default to 30% of booking + cleaning
            amount_paid =
                advance_payment_amount > 0
                    ? advance_payment_amount
                    : Math.ceil((booking_amount + cleaning_charges) * 0.3);
        }

        // Step 4: Build booking data
        const bookingPayload = {
            ...req.body,
            booking_amount,
            cleaning_charges,
            refundable_deposit,
            additional_charges,
            total_amount,
            amount_paid,
            is_full_payment,
            payment_status: 'Pending',
        };

        // Step 5: Create Booking
        const bookingDoc = await HallBookings.create(bookingPayload);

        if (bookingDoc) {
            return responseSend(
                res,
                httpCodes.OK,
                'Hall Booking Created Successfully',
                bookingDoc,
            );
        } else {
            throw new Error('Failed to create booking.');
        }
    } catch (error) {
        next(error);
    }
};

export const updateHallBooking = async (req, res, next) => {
    try {
        const { _id } = req.body;

        let records = await readHallsBooking({ _id });
        if (!records) {
            throw new Error('Halls Booking does not exist!');
        }

        records = await updateHallsBooking({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Bookings updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const updateHallsBookingStatus = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readHallsBooking({ _id });
        if (!records) {
            throw new Error('Halls Booking does not exist!');
        }

        records = await updateHallsBooking({ _id }, { status: req.query.status });
        responseSend(res, httpCodes.OK, 'Bookings updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const getHallsBookingList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = null,
            hall_id = null,
        } = req.query;
        let filter = {
            $or: [{ payment_status: 'Success' }, { payment_status: 'Partial Paid' }],
        };
        if (active == 'true') filter.status = true;
        else if (!req.session) {
            filter.status = true;
        }
        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { booking_id: parseInt(keywords) },
                    { 'halls_data.hall_id': parseInt(keywords) },
                    { 'halls_data.name': { $regex: keywords, $options: 'i' } },
                    { 'member_id_data.name': { $regex: keywords, $options: 'i' } },
                    { 'member_id_data.mobile': { $regex: keywords, $options: 'i' } },
                    { 'member_id_data.email': { $regex: keywords, $options: 'i' } },
                    { 'member_id_data.member_id': parseInt(keywords) },
                ],
            };
        if (hall_id) filter['halls_data.hall_id'] = hall_id;
        let result = await readAllHallsBooking(
            filter,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );
        responseSend(res, httpCodes.OK, 'Halls Booking records', {
            ...result,
            ...req.query,
        });
    } catch (error) {
        next(error);
    }
};

export const getHallsBookedDates = async (req, res, next) => {
    try {
        const { hall_id } = req.query;

        if (!hall_id || !mongoose.Types.ObjectId.isValid(hall_id)) {
            throw new Error('Invalid or missing hall_id');
        }

        // Get today's date (without time)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get all future bookings
        const bookings = await HallBookings.find({
            hall_id: new mongoose.Types.ObjectId(hall_id),
            payment_status: { $in: ['Success', 'Partial Paid'] },
            is_cancelled: false,
            booking_date: { $gte: today },
        }).select('booking_date');

        // Just return the dates
        const bookedDates = bookings.map((b) => b.booking_date);

        console.log('Final booked dates:', bookedDates);

        responseSend(res, httpCodes.OK, 'Booked Dates', bookedDates);
    } catch (error) {
        next(error);
    }
};
