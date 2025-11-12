import Members from '../../models/members.js';
import Plans from '../../models/plans.js';
import { paginationPipeLine } from '../../helpers/aggregation-pipeline-pagination.js';

export const readMembers = async (filter, select = {}) => {
    try {
        const result = await Members.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const updateMembers = async (filter, update) => {
    try {
        const result = await Members.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteMembers = async (filter) => {
    try {
        const result = await Members.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const readAllMembers = async (
    filter,
    sort = {},
    pageNo = 0,
    limit = 0,
    extra = null,
) => {
    try {
        const result = await Members.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};

export const createMembers = async (insertData) => {
    try {
        const result = new Members(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
};

export const bulkMembersCreate = async (data) => {
    try {
        const result = await Members.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export async function findHighestMemberId() {
    const result = await Members.findOne().sort('-member_id').exec();
    return result ? result.member_id : 0; // Default starting value if collection is empty
}
