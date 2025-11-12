import Activity from '../../models/activity.js';
import { paginationPipeLine } from '../../helpers/aggregation-pipeline-pagination.js';

export const readActivity = async (filter, select = {}) => {
    try {
        const result = await Activity.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateActivity = async (filter, update) => {
    try {
        const result = await Activity.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteActivity = async (filter) => {
    try {
        const result = await Activity.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllActivity = async (
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
                    from: 'facilities',
                    localField: 'facility_id',
                    foreignField: '_id',
                    as: 'facility_data',
                },
            },
            {
                $lookup: {
                    from: 'batches',
                    localField: '_id',
                    foreignField: 'activity_id',
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
                $match: {
                    ...(filter['batch_data.type'] && {
                        'batch_data.type': filter['batch_data.type'],
                    }),
                    ...(filter['batch_data.status'] !== undefined && {
                        'batch_data.status': filter['batch_data.status'],
                    }),
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
                $lookup: {
                    from: 'categories',
                    localField: 'batch_data.category_id',
                    foreignField: '_id',
                    as: 'category_data',
                },
            },
            {
                $unwind: {
                    path: '$category_data',
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
                            member_days_prices: '$batch_data.member_days_prices',
                            end_time: '$batch_data.end_time',
                            start_time: '$batch_data.start_time',
                            court: '$batch_data.court',
                            fees: '$batch_data.fees',
                            slots: '$batch_data.slots',
                            location_data: { $ifNull: ['$location_data', null] },
                            sublocation_data: { $ifNull: ['$sublocation_data', null] },
                            category_data: { $ifNull: ['$category_data', null] },
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

        const newSelect = {
            ...select,
            other_fields: 0,
        };
        const result = await Activity.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, newSelect, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllActivityList = async (
    filter,
    select = null,
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const result = await Activity.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, select),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createActivity = async (insertData) => {
    try {
        const result = new Activity(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const bulkActivityCreate = async (data) => {
    try {
        const result = await Activity.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};
