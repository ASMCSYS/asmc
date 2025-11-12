import Plans from "../../models/plans.js";
import { paginationPipeLine } from "../../helpers/aggregation-pipeline-pagination.js";

export const readPlans = async (filter, select = {}) => {
    try {
        const result = await Plans.findOne(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const readActivePlans = async (filter, select = {}) => {
    try {
        const result = await Plans.find(filter).select(select).lean();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const updatePlans = async (filter, update) => {
    try {
        const result = await Plans.findOneAndUpdate(filter, update);
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const deletePlans = async (filter) => {
    try {
        const result = await Plans.deleteOne(filter);
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const readAllPlans = async (
    filter,
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const result = await Plans.aggregate(paginationPipeLine(pageNo, filter, limit, sort))
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
}

export const createPlans = async (insertData) => {
    try {
        const result = new Plans(insertData);
        await result.save();
        return result.toObject();
    } catch (error) {
        throw new Error(error);
    }
}

export const bulkPlansCreate = async (data) => {
    try {
        const result = await Plans.insertMany(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
}
