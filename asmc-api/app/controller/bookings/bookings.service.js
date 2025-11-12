import Bookings from '../../models/bookings.js';
import { paginationPipeLine } from '../../helpers/aggregation-pipeline-pagination.js';

export const readSingleBookings = async (filter, select = {}) => {
    try {
        const result = await Bookings.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readBookings = async (filter, select = {}) => {
    try {
        const result = await Bookings.findOne(filter)
            .select(select)
            .populate({ path: 'member_id', as: 'member_data' })
            .populate({ path: 'activity_id', as: 'activity_data' });
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateBookings = async (filter, update) => {
    try {
        const result = await Bookings.updateMany(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteBookings = async (filter) => {
    try {
        const result = await Bookings.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllBookings = async (
    filter,
    select = null,
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const extra = [
            {
                $lookup: {
                    from: 'members',
                    localField: 'member_id',
                    foreignField: '_id',
                    as: 'member_data',
                },
            },
            {
                $lookup: {
                    from: 'activities',
                    localField: 'activity_id',
                    foreignField: '_id',
                    as: 'activity_data',
                },
            },
            {
                $lookup: {
                    from: 'batches',
                    localField: 'batch',
                    foreignField: '_id',
                    as: 'batch_data',
                },
            },
            {
                $unwind: {
                    path: '$batch_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'batch_data.location_id',
                    foreignField: '_id',
                    as: 'location_data',
                },
            },
            {
                $unwind: {
                    path: '$location_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'batch_data.sublocation_id',
                    foreignField: '_id',
                    as: 'sublocation_data',
                },
            },
            {
                $unwind: {
                    path: '$sublocation_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    activity_name: { $first: '$activity_name' }, // Replace with your actual field names
                    batch_data: {
                        $push: {
                            _id: '$batch_data._id',
                            activity_id: '$batch_data.activity_id',
                            category_id: '$batch_data.category_id',
                            subcategory_name: '$batch_data.subcategory_name',
                            location_id: '$batch_data.location_id',
                            sublocation_id: '$batch_data.sublocation_id',
                            secondary_sublocation_id:
                                '$batch_data.secondary_sublocation_id',
                            batch_type: '$batch_data.batch_type',
                            batch_code: '$batch_data.batch_code',
                            batch_name: '$batch_data.batch_name',
                            status: '$batch_data.status',
                            createdAt: '$batch_data.createdAt',
                            updatedAt: '$batch_data.updatedAt',
                            batch_limit: '$batch_data.batch_limit',
                            no_of_player: '$batch_data.no_of_player',
                            type: '$batch_data.type',
                            days: '$batch_data.days',
                            days_prices: '$batch_data.days_prices',
                            end_time: '$batch_data.end_time',
                            start_time: '$batch_data.start_time',
                            court: '$batch_data.court',
                            fees: '$batch_data.fees',
                            location_data: { $ifNull: ['$location_data', null] },
                            sublocation_data: { $ifNull: ['$sublocation_data', null] },
                        },
                    },
                    other_fields: { $first: '$$ROOT' },
                },
            },
            {
                $addFields: {
                    'other_fields.batch_data': '$batch_data',
                },
            },
            {
                $replaceRoot: {
                    newRoot: '$other_fields',
                },
            },
        ];
        const result = await Bookings.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null, extra),
        ).allowDiskUse(true);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createBookings = async (insertData) => {
    try {
        const result = new Bookings(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const bulkBookingsCreate = async (data) => {
    try {
        const result = await Bookings.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};
