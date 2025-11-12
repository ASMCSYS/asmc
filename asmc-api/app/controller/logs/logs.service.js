import Log from '../../models/log.js';
import Staff from '../../models/staff.js';
import mongoose from 'mongoose';

export const createLog = async (logData) => Log.create(logData);

export const readLogs = async (filter = {}, select = {}) =>
    Log.find(filter).select(select).lean();

export const readLogsWithPagination = async (filter = {}, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    // Base pipeline stages
    const baseStages = [{ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit }];

    // Add match stage if filters exist
    if (Object.keys(filter).length > 0) {
        baseStages.unshift({ $match: filter });
    }

    // Add lookup for staff and user information
    const pipeline = [
        ...baseStages,
        {
            $lookup: {
                from: 'staffs',
                localField: 'staffId',
                foreignField: '_id',
                as: 'staffInfo',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userInfo',
            },
        },
        {
            $addFields: {
                staffInfo: {
                    $cond: {
                        if: { $gt: [{ $size: '$staffInfo' }, 0] },
                        then: { $arrayElemAt: ['$staffInfo', 0] },
                        else: null,
                    },
                },
                userInfo: {
                    $cond: {
                        if: { $gt: [{ $size: '$userInfo' }, 0] },
                        then: { $arrayElemAt: ['$userInfo', 0] },
                        else: null,
                    },
                },
            },
        },
    ];

    return Log.aggregate(pipeline);
};

export const searchLogs = async (searchParams) => {
    const {
        userId,
        staffId,
        action,
        module,
        startDate,
        endDate,
        keywords,
        userRole,
        page = 1,
        limit = 10,
    } = searchParams;

    // Build match conditions array
    const matchConditions = [];

    // Add direct field filters
    if (userId) matchConditions.push({ userId });
    if (staffId) matchConditions.push({ staffId });
    if (action) matchConditions.push({ action }); // Exact match for action
    if (module) matchConditions.push({ module }); // Exact match for module
    if (userRole) matchConditions.push({ 'metadata.userRole': userRole }); // Filter by user role
    if (startDate || endDate) {
        const dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);
        matchConditions.push({ createdAt: dateFilter });
    }

    // Add keywords search
    if (keywords) {
        matchConditions.push({
            $or: [
                { description: { $regex: keywords, $options: 'i' } },
                { 'metadata.userEmail': { $regex: keywords, $options: 'i' } },
                { 'metadata.userRole': { $regex: keywords, $options: 'i' } },
                { 'metadata.loginType': { $regex: keywords, $options: 'i' } },
                { 'metadata.attemptedEmail': { $regex: keywords, $options: 'i' } },
                { 'metadata.errorMessage': { $regex: keywords, $options: 'i' } },
                { ip: { $regex: keywords, $options: 'i' } },
                { userAgent: { $regex: keywords, $options: 'i' } },
                { 'staffInfo.name': { $regex: keywords, $options: 'i' } },
                { 'staffInfo.email': { $regex: keywords, $options: 'i' } },
                { 'staffInfo.designation': { $regex: keywords, $options: 'i' } },
                { 'userInfo.name': { $regex: keywords, $options: 'i' } },
                { 'userInfo.email': { $regex: keywords, $options: 'i' } },
            ],
        });
    }

    // Construct final filter
    let filter = {};
    if (matchConditions.length === 1) {
        // If only one condition, use it directly
        filter = matchConditions[0];
    } else if (matchConditions.length > 1) {
        // If multiple conditions, wrap in $and
        filter = { $and: matchConditions };
    }

    const result = await readLogsWithPagination(filter, page, limit);

    // Get total count for pagination
    const total = await Log.countDocuments(filter);

    return {
        data: result,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
    };
};

export const exportLogs = async (searchParams) => {
    const { userId, staffId, action, module, startDate, endDate, keywords, userRole } =
        searchParams;

    // Build match conditions array
    const matchConditions = [];

    // Add direct field filters
    if (userId) matchConditions.push({ userId });
    if (staffId) matchConditions.push({ staffId });
    if (action) matchConditions.push({ action }); // Exact match for action
    if (module) matchConditions.push({ module }); // Exact match for module
    if (userRole) matchConditions.push({ 'metadata.userRole': userRole }); // Filter by user role
    if (startDate || endDate) {
        const dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);
        matchConditions.push({ createdAt: dateFilter });
    }

    // Add keywords search
    if (keywords) {
        matchConditions.push({
            $or: [
                { description: { $regex: keywords, $options: 'i' } },
                { 'metadata.userEmail': { $regex: keywords, $options: 'i' } },
                { 'metadata.userRole': { $regex: keywords, $options: 'i' } },
                { 'metadata.loginType': { $regex: keywords, $options: 'i' } },
                { 'metadata.attemptedEmail': { $regex: keywords, $options: 'i' } },
                { 'metadata.errorMessage': { $regex: keywords, $options: 'i' } },
                { ip: { $regex: keywords, $options: 'i' } },
                { userAgent: { $regex: keywords, $options: 'i' } },
                { 'staffInfo.name': { $regex: keywords, $options: 'i' } },
                { 'staffInfo.email': { $regex: keywords, $options: 'i' } },
                { 'staffInfo.designation': { $regex: keywords, $options: 'i' } },
                { 'userInfo.name': { $regex: keywords, $options: 'i' } },
                { 'userInfo.email': { $regex: keywords, $options: 'i' } },
            ],
        });
    }

    // Construct final filter
    let filter = {};
    if (matchConditions.length === 1) {
        // If only one condition, use it directly
        filter = matchConditions[0];
    } else if (matchConditions.length > 1) {
        // If multiple conditions, wrap in $and
        filter = { $and: matchConditions };
    }

    const pipeline = [
        { $match: filter },
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: 'staffs',
                localField: 'staffId',
                foreignField: '_id',
                as: 'staffInfo',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userInfo',
            },
        },
        {
            $addFields: {
                staffInfo: {
                    $cond: {
                        if: { $gt: [{ $size: '$staffInfo' }, 0] },
                        then: { $arrayElemAt: ['$staffInfo', 0] },
                        else: null,
                    },
                },
                userInfo: {
                    $cond: {
                        if: { $gt: [{ $size: '$userInfo' }, 0] },
                        then: { $arrayElemAt: ['$userInfo', 0] },
                        else: null,
                    },
                },
            },
        },
    ];

    return Log.aggregate(pipeline);
};
