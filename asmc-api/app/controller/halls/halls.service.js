import Halls from '../../models/halls.js';
import { paginationPipeLine } from '../../helpers/aggregation-pipeline-pagination.js';
import HallBookings from '../../models/hall_booking.js';

export const readHalls = async (filter, select = {}) => {
    try {
        const result = await Halls.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readActiveHalls = async (filter, select = {}) => {
    try {
        const result = await Halls.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateHalls = async (filter, update) => {
    try {
        const result = await Halls.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteHalls = async (filter) => {
    try {
        const result = await Halls.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllHalls = async (filter, sort = {}, pageNo = 0, limit = 0) => {
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
        const result = await Halls.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createHalls = async (insertData) => {
    try {
        const result = new Halls(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const bulkHallsCreate = async (data) => {
    try {
        const result = await Halls.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

// hall booking apis
export const readHallsBooking = async (filter, select = {}) => {
    try {
        const result = await HallBookings.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readActiveHallsBooking = async (filter, select = {}) => {
    try {
        const result = await HallBookings.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateHallsBooking = async (filter, update) => {
    try {
        const result = await HallBookings.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteHallsBooking = async (filter) => {
    try {
        const result = await HallBookings.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllHallsBooking = async (filter, sort = {}, pageNo = 0, limit = 0) => {
    try {
        const extra = [
            {
                $lookup: {
                    from: 'halls',
                    localField: 'hall_id',
                    foreignField: '_id',
                    as: 'halls_data',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                hall_id: 1,
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
                    halls_data: { $arrayElemAt: ['$halls_data', 0] },
                    member_id_data: { $arrayElemAt: ['$member_id_data', 0] },
                },
            },
        ];
        const result = await HallBookings.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createHallsBooking = async (insertData) => {
    try {
        const result = new HallBookings(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};
