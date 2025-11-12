import { responseSend } from '../../helpers/responseSend.js';
import { httpCodes } from '../../utils/httpcodes.js';
import Log from '../../models/log.js';
import {
    createLog,
    readLogs,
    readLogsWithPagination,
    searchLogs,
    exportLogs,
} from './logs.service.js';

export const getLogsList = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const logs = await readLogsWithPagination({}, parseInt(page), parseInt(limit));
        responseSend(res, httpCodes.OK, 'Logs list', logs);
    } catch (error) {
        next(error);
    }
};

export const searchLogsByFilter = async (req, res, next) => {
    try {
        const searchParams = {
            userId: req.query.userId,
            staffId: req.query.staffId,
            action: req.query.action,
            module: req.query.module,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            keywords: req.query.keywords,
            userRole: req.query.userRole,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        };

        const logs = await searchLogs(searchParams);
        responseSend(res, httpCodes.OK, 'Filtered logs', logs);
    } catch (error) {
        next(error);
    }
};

export const exportLogsData = async (req, res, next) => {
    try {
        const searchParams = {
            userId: req.query.userId,
            staffId: req.query.staffId,
            action: req.query.action,
            module: req.query.module,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            keywords: req.query.keywords,
            userRole: req.query.userRole,
        };

        const logs = await exportLogs(searchParams);

        // Convert to CSV format
        const csvData = convertToCSV(logs);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=logs_export.csv');
        res.send(csvData);
    } catch (error) {
        next(error);
    }
};

// Helper function to convert logs to CSV
const convertToCSV = (logs) => {
    const headers = [
        'Timestamp',
        'Action',
        'Module',
        'Description',
        'User Name',
        'User Email',
        'User Role',
        'Staff Name',
        'Staff Email',
        'Staff Designation',
        'IP Address',
        'User Agent',
        'Metadata',
    ];

    const csvRows = [headers.join(',')];

    logs.forEach((log) => {
        // Get user information
        const userName = log.userInfo
            ? log.userInfo.name
            : log.staffInfo
            ? log.staffInfo.name
            : 'Unknown User';
        const userEmail = log.userInfo
            ? log.userInfo.email
            : log.staffInfo
            ? log.staffInfo.email
            : '';
        const userRole = log.userInfo ? log.userInfo.roles : log.staffInfo ? 'Staff' : '';

        // Get staff information
        const staffName = log.staffInfo ? log.staffInfo.name : '';
        const staffEmail = log.staffInfo ? log.staffInfo.email : '';
        const staffDesignation = log.staffInfo ? log.staffInfo.designation : '';

        const row = [
            log.createdAt ? new Date(log.createdAt).toISOString() : '',
            log.action || '',
            log.module || '',
            `"${(log.description || '').replace(/"/g, '""')}"`,
            `"${userName.replace(/"/g, '""')}"`,
            `"${userEmail.replace(/"/g, '""')}"`,
            `"${userRole.replace(/"/g, '""')}"`,
            `"${staffName.replace(/"/g, '""')}"`,
            `"${staffEmail.replace(/"/g, '""')}"`,
            `"${staffDesignation.replace(/"/g, '""')}"`,
            log.ip || '',
            `"${(log.userAgent || '').replace(/"/g, '""')}"`,
            `"${JSON.stringify(log.metadata || {}).replace(/"/g, '""')}"`,
        ];
        csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
};

export const getLogsStats = async (req, res, next) => {
    try {
        const totalLogs = await Log.countDocuments({});
        const todayLogs = await Log.countDocuments({
            createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
        });
        const thisWeekLogs = await Log.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        });

        responseSend(res, httpCodes.OK, 'Logs statistics', {
            totalLogs,
            todayLogs,
            thisWeekLogs,
        });
    } catch (error) {
        next(error);
    }
};
