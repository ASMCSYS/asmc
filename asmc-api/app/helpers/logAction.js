import { createLog } from '../controller/logs/logs.service.js';

/**
 * Simple helper function to log custom actions
 * @param {Object} req - Express request object
 * @param {string} action - Action type (CREATE, UPDATE, DELETE, CUSTOM)
 * @param {string} module - Module name
 * @param {string} description - Action description
 * @param {Object} metadata - Additional metadata
 */
export const logAction = async (req, action, module, description, metadata = {}) => {
    try {
        // Extract user information from request (supports both req.user and req.session)
        const userId = req.user?.id || req.user?._id || req.session?._id || null;
        const staffId = req.user?.staffId || req.session?.staffId || null;
        
        if (!userId) {
            console.warn('logAction: No user found in request');
            return;
        }

        // Prepare log data
        const logData = {
            userId,
            staffId,
            action,
            module,
            description,
            metadata: {
                ...metadata,
                method: req.method,
                path: req.path,
                timestamp: new Date().toISOString()
            },
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        };

        // Create log entry asynchronously (don't block the request)
        createLog(logData).catch(err => {
            console.error('Error creating custom log:', err);
        });

    } catch (error) {
        console.error('Error in logAction helper:', error);
    }
};

/**
 * Convenience functions for common actions
 */
export const logCreate = (req, module, description, metadata) => 
    logAction(req, 'CREATE', module, description, metadata);

export const logUpdate = (req, module, description, metadata) => 
    logAction(req, 'UPDATE', module, description, metadata);

export const logDelete = (req, module, description, metadata) => 
    logAction(req, 'DELETE', module, description, metadata);

export const logCustom = (req, action, module, description, metadata) => 
    logAction(req, action, module, description, metadata);

/**
 * Special function for logging login events where user is not yet authenticated
 * @param {Object} req - Express request object
 * @param {string} userId - User ID for the login attempt
 * @param {string} action - Action type
 * @param {string} module - Module name
 * @param {string} description - Action description
 * @param {Object} metadata - Additional metadata
 */
export const logLoginAction = async (req, userId, action, module, description, metadata = {}) => {
    try {
        // For failed login attempts, userId might be null, which is acceptable
        if (userId === undefined) {
            console.warn('logLoginAction: No userId provided');
            return;
        }

        // Extract staffId from metadata if provided
        const staffId = metadata.staffId || null;

        // Prepare log data
        const logData = {
            userId,
            staffId: staffId,
            action,
            module,
            description,
            metadata: {
                ...metadata,
                method: req.method,
                path: req.path,
                timestamp: new Date().toISOString()
            },
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        };

        // Create log entry asynchronously (don't block the request)
        createLog(logData).catch(err => {
            console.error('Error creating login log:', err);
        });

    } catch (error) {
        console.error('Error in logLoginAction helper:', error);
    }
}; 