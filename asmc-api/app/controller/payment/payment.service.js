import { paginationPipeLine } from '../../helpers/aggregation-pipeline-pagination.js';
import PaymentHistory from '../../models/payment_history.js';

// payment modal service here
export const insertPaymentData = async (insertData) => {
    try {
        const result = new PaymentHistory(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const readPaymentHistory = async (filter, select = {}) => {
    try {
        const result = await PaymentHistory.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updatePaymentHistory = async (filter, update) => {
    try {
        const result = await PaymentHistory.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllPaymentHistory = async (filter, sort = {}, pageNo = 0, limit = 0) => {
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
                    from: 'plans',
                    localField: 'plan_id',
                    foreignField: '_id',
                    as: 'plans_data',
                },
            },
            {
                $lookup: {
                    from: 'bookings',
                    localField: 'booking_id',
                    foreignField: '_id',
                    as: 'bookings_data',
                },
            },
            {
                $lookup: {
                    from: 'event_bookings',
                    localField: 'event_booking_id',
                    foreignField: '_id',
                    as: 'event_bookings_data',
                },
            },
            {
                $lookup: {
                    from: 'activities',
                    localField: 'bookings_data.activity_id',
                    foreignField: '_id',
                    as: 'activity_data',
                },
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'event_bookings_data.event_id',
                    foreignField: '_id',
                    as: 'event_data',
                },
            },
        ];

        const result = await PaymentHistory.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};
