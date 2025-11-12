'use strict';

import mongoose, { mongo } from 'mongoose';
import { responseSend } from '../../helpers/responseSend.js';
import { httpCodes } from '../../utils/httpcodes.js';
import {
    createActivity,
    deleteActivity,
    readActivity,
    readAllActivity,
    readAllActivityList,
    updateActivity,
} from './activity.service.js';
import { readFacility } from '../masters/masters.service.js';
import Batch from '../../models/batch.js';
import { updateMembers } from '../members/members.service.js';
import Activity from '../../models/activity.js';
import Bookings from '../../models/bookings.js';
import { deleteImageKitByUrl } from '../../middlewares/imagekit.js';

export const insertActivity = async (req, res, next) => {
    try {
        // get facility
        const facility = await readFacility({ permalink: 'sports-booking' });
        req.body.facility_id = facility._id;

        await createActivity(req.body);

        return responseSend(
            res,
            httpCodes.OK,
            'Activity has been created successfully',
            {},
        );
    } catch (error) {
        next(error);
    }
};

export const getActivityList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = -1,
            sortField = 'createdAt',
            active = null,
            facility_id = null,
            batch_status = null,
            type = null,
            activity_id = null,
            show_hide = null,
        } = req.query;

        let filter = {};

        if (type) {
            filter['batch_data.type'] = type;
        }

        if (batch_status) {
            filter['batch_data.status'] = true;
        }

        if (active) filter.status = true;

        if (show_hide) filter.show_hide = true;

        if (facility_id) filter.facility_id = mongoose.Types.ObjectId(facility_id);

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { activity_id: parseInt(keywords) },
                    { name: { $regex: keywords, $options: 'i' } },
                    { short_description: { $regex: keywords, $options: 'i' } },
                    { category: { $regex: keywords, $options: 'i' } },
                    {
                        location: {
                            $elemMatch: {
                                label: { $regex: keywords, $options: 'i' },
                            },
                        },
                    },
                ],
            };

        if (activity_id) {
            filter.activity_id = parseInt(activity_id);
        }

        console.log(filter, 'filter');

        let result = await readAllActivity(
            filter,
            null,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Activity records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getActiveActivityList = async (req, res, next) => {
    try {
        const {
            keywords = '',
            pageNo = 0,
            limit = 10,
            sortBy = 1,
            sortField = 'name',
            facility_id = null,
            activity_id = null,
            show_hide = null,
        } = req.query;

        let filter = {
            // "batch_data.type": "booking",
            // "batch_data.status": true,
            status: true,
        };

        if (show_hide) filter.show_hide = true;

        if (facility_id) filter.facility_id = mongoose.Types.ObjectId(facility_id);

        if (keywords && keywords !== '')
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: keywords, $options: 'i' } },
                    { short_description: { $regex: keywords, $options: 'i' } },
                    { category: { $regex: keywords, $options: 'i' } },
                ],
            };

        if (activity_id) {
            filter.activity_id = activity_id;
        }

        let result = await readAllActivityList(
            filter,
            null,
            { [sortField]: parseInt(sortBy) },
            pageNo,
            parseInt(limit),
        );

        responseSend(res, httpCodes.OK, 'Activity records', { ...result, ...req.query });
    } catch (error) {
        next(error);
    }
};

export const getTopActivityList = async (req, res, next) => {
    try {
        const bookingAggregation = await Bookings.aggregate([
            { $match: { type: 'booking' } }, // Filter documents with type 'booking'
            { $group: { _id: '$activity_id', bookingCount: { $sum: 1 } } }, // Group by activity_id
            { $sort: { bookingCount: -1 } }, // Sort by bookingCount in descending order
            { $limit: 10 }, // Limit to top 10 results
        ]);

        const activityIds = bookingAggregation.map((item) =>
            mongoose.Types.ObjectId(item._id),
        );
        const activities = await Activity.find(
            { _id: { $in: activityIds } },
            {
                activity_id: 1,
                name: 1,
                thumbnail: 1,
                images: 1,
                short_description: 1,
                status: 1,
            },
        );

        responseSend(res, httpCodes.OK, 'Activity records', activities);
    } catch (error) {
        next(error);
    }
};

export const getActiveActivityListDropdown = async (req, res, next) => {
    try {
        let result = await Activity.aggregate([
            {
                $match: { status: true },
            },
            {
                $project: {
                    label: '$name', // Rename name to label
                    value: '$_id', // Rename _id to value
                },
            },
        ]);

        responseSend(res, httpCodes.OK, 'Activity records', result);
    } catch (error) {
        next(error);
    }
};

export const getSingleActivity = async (req, res, next) => {
    try {
        const { _id, activity_id } = req.query;
        if (!_id && !activity_id) {
            throw new Error('Activity id is required!');
        }
        let result = await readActivity(activity_id ? { activity_id } : { _id });

        const batchData = await Batch.find({
            activity_id: result._id,
            status: true,
            type: 'booking',
        }).lean();

        const now = new Date();
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

        // Build a list of all slot timestamps for lookup
        const allSlotTimes = [];

        batchData.forEach((batch) => {
            if (!Array.isArray(batch.days)) return;

            batch.days.forEach((daySlot) => {
                daySlot.time_slots.forEach((slot) => {
                    allSlotTimes.push({
                        batch_id: batch._id,
                        day: daySlot.day,
                        from: new Date(slot.from),
                        to: new Date(slot.to),
                    });
                });
            });
        });

        // Create booking match filter
        const bookings = await Bookings.find({
            batch: { $in: batchData.map((b) => mongoose.Types.ObjectId(b._id)) },
            payment_status: {
                $in: ['Success', 'Pending'],
            },
            $or: [
                { payment_status: 'Success' },
                { payment_status: 'Pending', createdAt: { $gte: tenMinutesAgo } },
            ],
        }).lean();

        // Group bookings by batch_id
        const bookedMap = {};
        bookings.forEach((booking) => {
            const batchId = booking.batch.toString();
            if (!bookedMap[batchId]) {
                bookedMap[batchId] = [];
            }
            bookedMap[batchId].push({
                booking_date: booking.booking_date,
                booking_time: booking.booking_time,
            });
        });

        // Add booked_slots to each batch
        const updatedBatchData = batchData.map((batch) => ({
            ...batch,
            booked_slots: bookedMap[batch._id.toString()] || [],
        }));

        // For vacancies, also populate the titles
        // Improved: Use aggregation with $lookup to fetch related titles in a single query

        const vacancies = await Batch.aggregate([
            {
                $match: {
                    activity_id: result._id,
                    status: true,
                    type: 'enrollment',
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'location_id',
                    foreignField: '_id',
                    as: 'location',
                },
            },
            {
                $lookup: {
                    from: 'sublocations',
                    localField: 'sublocation_id',
                    foreignField: '_id',
                    as: 'sublocation',
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $project: {
                    _id: 1,
                    batch_name: 1,
                    batch_limit: 1,
                    batch_code: 1,
                    start_time: 1,
                    end_time: 1,
                    location_id: 1,
                    sublocation_id: 1,
                    category_id: 1,
                    subcategory_name: 1,
                    location_title: { $arrayElemAt: ['$location.title', 0] },
                    sublocation_title: { $arrayElemAt: ['$sublocation.title', 0] },
                    category_title: { $arrayElemAt: ['$category.title', 0] },
                },
            },
        ]);

        return responseSend(res, httpCodes.OK, 'Success', {
            ...result,
            batchData: updatedBatchData,
            vacancies,
        });
    } catch (error) {
        next(error);
    }
};

export const editActivity = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let records = await readActivity({ _id });
        if (!records) {
            throw new Error('Activity does not exist!');
        }
        // Delete old thumbnail if changed
        const oldThumb = records.thumbnail;
        const newThumb = req.body.thumbnail;
        if (
            oldThumb &&
            newThumb &&
            oldThumb !== newThumb &&
            !oldThumb.includes('no-image.png')
        ) {
            await deleteImageKitByUrl(oldThumb);
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
        // get facility
        const facility = await readFacility({ permalink: 'sports-booking' });
        req.body.facility_id = facility._id;
        // check if the activity name is changed and if changed? change the value of role_activity_name in member model
        if (records.name !== req.body.name) {
            await updateMembers(
                { role_activity_name: records.name },
                { role_activity_name: req.body.name },
            );
        }
        records = await updateActivity({ _id }, req.body);
        responseSend(res, httpCodes.OK, 'Activity updated successfully', records);
    } catch (error) {
        next(error);
    }
};

export const removeActivity = async (req, res, next) => {
    try {
        const { _id } = req.query;

        let records = await readActivity({ _id });
        if (!records) {
            throw new Error('Activity does not exist!');
        }

        records = await deleteActivity({ _id });
        responseSend(res, httpCodes.OK, 'Activity deleted successfully', records);
    } catch (error) {
        next(error);
    }
};
