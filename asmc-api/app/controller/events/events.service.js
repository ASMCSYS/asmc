import Events from '../../models/events.js';
import { paginationPipeLine } from '../../helpers/aggregation-pipeline-pagination.js';
import EventBookings from '../../models/event_booking.js';

export const readEvents = async (filter, select = {}) => {
    try {
        const result = await Events.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readActiveEvents = async (filter, select = {}) => {
    try {
        const result = await Events.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateEvents = async (filter, update) => {
    try {
        const result = await Events.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteEvents = async (filter) => {
    try {
        const result = await Events.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllEvents = async (filter, sort = {}, pageNo = 0, limit = 0) => {
    try {
        const extra = [
            {
                $lookup: {
                    from: 'locations',
                    localField: 'location_id',
                    foreignField: '_id',
                    as: 'location_data',
                    pipeline: [{ $project: { _id: 1, title: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'sublocation_id',
                    foreignField: '_id',
                    as: 'sublocation_data',
                    pipeline: [{ $project: { _id: 1, title: 1 } }],
                },
            },
            {
                $addFields: {
                    location_data: { $arrayElemAt: ['$location_data', 0] },
                    sublocation_data: { $arrayElemAt: ['$sublocation_data', 0] },
                },
            },
        ];
        const result = await Events.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createEvents = async (insertData) => {
    try {
        const result = new Events(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const bulkEventsCreate = async (data) => {
    try {
        const result = await Events.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

// event booking apis
export const readEventsBooking = async (filter, select = {}) => {
    try {
        const result = await EventBookings.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readActiveEventsBooking = async (filter, select = {}) => {
    try {
        const result = await EventBookings.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateEventsBooking = async (filter, update) => {
    try {
        const result = await EventBookings.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteEventsBooking = async (filter) => {
    try {
        const result = await EventBookings.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllEventsBooking = async (filter, sort = {}, pageNo = 0, limit = 0) => {
    try {
        const extra = [
            {
                $lookup: {
                    from: 'events',
                    localField: 'event_id',
                    foreignField: '_id',
                    as: 'events_data',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                event_name: 1,
                                event_id: 1,
                                category_data: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'member_id',
                    foreignField: '_id',
                    as: 'member_id_data',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                member_id: 1,
                                name: 1,
                                mobile: 1,
                                email: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    events_data: { $arrayElemAt: ['$events_data', 0] },
                    member_id_data: { $arrayElemAt: ['$member_id_data', 0] },
                },
            },
        ];
        const result = await EventBookings.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createEventsBooking = async (insertData) => {
    try {
        const result = new EventBookings(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const bulkEventsBookingCreate = async (data) => {
    try {
        const result = await EventBookings.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};
