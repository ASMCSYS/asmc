import { createLog } from '../controller/logs/logs.service.js';

export const logAction = async (req, userId, action, module, description = '', metadata = {}) => {
    try {
        const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.ip || '';
        const userAgent = req.get('User-Agent') || '';
        const logData = {
            userId,
            action,
            module,
            description,
            metadata,
            ip,
            userAgent,
        };

        await createLog(logData);
    } catch (error) {
        console.error('Logging failed:', error);
    }
};