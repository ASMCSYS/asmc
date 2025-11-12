import { paginationPipeLine } from '../../helpers/aggregation-pipeline-pagination.js';
import Staff from '../../models/staff.js';

export const createStaff = async (data) => Staff.create(data);
export const readStaff = async (filter, select = {}) =>
    Staff.findOne(filter).select(select).lean();
export const readAllStaff = async (filter, sort = {}, pageNo = 0, limit = 0) => {
    try {
        const result = await Staff.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, null),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};
export const updateStaff = async (filter, update) =>
    Staff.findOneAndUpdate(filter, update, { new: true });
export const deleteStaff = async (filter) => Staff.findOneAndDelete(filter);
