import { paginationPipeLine } from '../../helpers/aggregation-pipeline-pagination.js';
import Users from '../../models/users.js';
import { Types } from 'mongoose';

export const readUsers = async (filter, select = {}) => {
    try {
        const result = await Users.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const createUsers = async (insertData) => {
    try {
        const result = new Users(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const updateUsers = async (filter, updateData) => {
    try {
        const result = await Users.updateOne(filter, updateData);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllUsers = async (filter, sort, pageNo, limit, extra) => {
    try {
        const result = await Users.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};
