import { paginationPipeLine } from '../../helpers/aggregation-pipeline-pagination.js';
import ContactUsModel from '../../models/contactus.js';
import DatabaseBackup from '../../models/database_backup.js';

export const insertContactUs = async (data) => {
    try {
        const result = await ContactUsModel.create(data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};
export const readAllContactData = async (
    filter,
    select = { _id: 1 },
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const extra = [
            {
                $lookup: {
                    from: 'sansthas',
                    localField: 'sanstha_id',
                    foreignField: '_id',
                    as: 'sanstha_data',
                },
            },
        ];
        const result = await ContactUsModel.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, select, extra),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};
export const readAllDatabaseBackup = async (
    filter,
    select = { _id: 1 },
    sort = {},
    pageNo = 0,
    limit = 0,
) => {
    try {
        const result = await DatabaseBackup.aggregate(
            paginationPipeLine(pageNo, filter, limit, sort, select),
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
};
