import { createLog } from '../controller/logs/logs.service.js';
import mongoose from 'mongoose';

/**
 * Auto-logging middleware that automatically logs all actions with proper IP detection and module naming
 * @param {Object} options - Configuration options
 * @param {Array} options.excludePaths - Array of paths to exclude from logging
 * @param {Array} options.excludeMethods - Array of HTTP methods to exclude from logging
 * @param {Function} options.getModuleName - Function to extract module name from request
 * @param {Function} options.getActionDescription - Function to generate action description
 */
export const autoLogger = (options = {}) => {
    const {
        excludePaths = ['/logs', '/health', '/metrics'],
        excludeMethods = [], // Log all methods by default
        getModuleName = (req) => {
            // Use originalUrl to get the full path including mount path
            const fullPath = req.originalUrl.split('?')[0]; // Remove query parameters
            const pathParts = fullPath
                .split('/')
                .filter((part) => part && !part.startsWith(':'));

            // Get the full meaningful path (skip empty strings and dynamic parameters)
            const meaningfulParts = pathParts.filter(
                (part) => part && !part.startsWith(':'),
            );

            // Handle special cases
            if (meaningfulParts[0] === 'biometric') {
                return meaningfulParts.length > 1
                    ? meaningfulParts.slice(0, 2).join('/')
                    : 'biometric';
            }

            // Return the full path or just the first part if it's a single segment
            return meaningfulParts.length > 1
                ? meaningfulParts.join('/')
                : meaningfulParts[0] || 'unknown';
        },
        getActionDescription = (req, res) => {
            const method = req.method;
            const module = getModuleName(req);
            const fullPath = req.originalUrl.split('?')[0]; // Remove query parameters

            // Create more descriptive action descriptions
            switch (method) {
                case 'POST':
                    return `Created new ${module} record`;
                case 'PUT':
                case 'PATCH':
                    return `Updated ${module} record`;
                case 'DELETE':
                    return `Deleted ${module} record`;
                case 'GET':
                    return `Retrieved ${module} data`;
                default:
                    return `${method} action on ${module}`;
            }
        },
    } = options;

    return async (req, res, next) => {
        // Skip logging for excluded paths and methods
        if (
            excludeMethods.includes(req.method) ||
            excludePaths.some((path) => req.path.startsWith(path))
        ) {
            return next();
        }

        // Flag to prevent duplicate logging
        let isLogged = false;

        // Store request data for UPDATE operations
        let requestData = null;
        if (req.method === 'PUT' || req.method === 'PATCH') {
            // Store the request body and params for later comparison
            requestData = {
                body: req.body ? JSON.parse(JSON.stringify(req.body)) : null,
                params: req.params ? JSON.parse(JSON.stringify(req.params)) : null,
                path: req.path,
                originalUrl: req.originalUrl,
            };

            // Try to fetch original data from database
            try {
                const originalData = await fetchOriginalData(req);
                if (originalData) {
                    requestData.originalData = originalData;
                }
            } catch (error) {
                // Silently handle fetch errors
            }
        }

        // Store original methods
        const originalSend = res.send;
        const originalStatus = res.status;

        // Override res.send to capture response data
        res.send = function (data) {
            // Restore original send method
            res.send = originalSend;

            // Log only if not already logged
            if (!isLogged) {
                isLogged = true;
                logAction(req, res, data, requestData).catch((err) => {
                    console.error('Auto-logging error:', err);
                });
            }

            // Call original send method
            return originalSend.call(this, data);
        };

        // Override res.status().send() pattern
        res.status = function (code) {
            const statusResponse = originalStatus.call(this, code);

            // Override the send method of the status response
            const originalStatusSend = statusResponse.send;
            statusResponse.send = function (data) {
                // Restore original send method
                statusResponse.send = originalStatusSend;

                // Log only if not already logged
                if (!isLogged) {
                    isLogged = true;
                    logAction(req, res, data, requestData).catch((err) => {
                        console.error('Auto-logging error:', err);
                    });
                }

                // Call original send method
                return originalStatusSend.call(this, data);
            };

            return statusResponse;
        };

        next();
    };
};

/**
 * Fetch original data from database before update
 */
async function fetchOriginalData(req) {
    try {
        // Extract ID from params or body (prioritize body for PUT/PATCH requests)
        const id = req.body._id || req.body.id || req.params.id || req.params._id;
        if (!id) {
            // console.log('No ID found in request');
            return null;
        }

        // Determine collection name from the route path
        const pathParts = req.originalUrl
            .split('/')
            .filter((part) => part && !part.startsWith(':'));

        let collectionName = pathParts[0]; // e.g., 'members', 'staff', 'plans'

        // Handle nested routes
        if (pathParts.length > 1) {
            if (pathParts[0] === 'biometric') {
                // For biometric routes: /biometric/attendance -> biometric_attendance
                collectionName = `biometric_${pathParts[1]}`;
            } else if (pathParts[0] === 'masters') {
                // For masters routes: /masters/batch -> batch
                collectionName = pathParts[1];
            } else if (pathParts[0] === 'cms') {
                // For cms routes: /cms/teams -> teams
                collectionName = pathParts[1];
            }
        }

        // Debug logging (remove in production)
        // console.log('Trying to fetch original data for:', {
        //     id,
        //     collectionName,
        //     pathParts,
        //     originalUrl: req.originalUrl,
        //     method: req.method,
        // });

        // Try to get the model from mongoose using the collection name directly
        let Model;
        try {
            Model = mongoose.model(collectionName);
        } catch (modelError) {
            return null;
        }

        if (!Model) {
            return null;
        }

        // Fetch the original document
        const originalDoc = await Model.findById(id).lean();
        return originalDoc;
    } catch (error) {
        // console.log('Error fetching original data:', error.message);
        return null;
    }
}

/**
 * Helper function to log the action
 */
async function logAction(req, res, responseData, requestData = null) {
    try {
        // Extract user information from request (supports both req.user and req.session)
        const userId = req.user?.id || req.user?._id || req.session?._id || null;
        const staffId = req.user?.staffId || req.session?.staffId || null;

        // Skip logging if no user (for public endpoints)
        if (!userId) {
            return;
        }

        // Determine action based on HTTP method
        let action;
        switch (req.method) {
            case 'POST':
                action = 'CREATE';
                break;
            case 'PUT':
            case 'PATCH':
                action = 'UPDATE';
                break;
            case 'DELETE':
                action = 'DELETE';
                break;
            case 'GET':
                action = 'READ';
                break;
            default:
                action = req.method;
        }

        // Extract module name using the same logic as the middleware
        const getModuleName = (req) => {
            // Use originalUrl to get the full path including mount path
            const fullPath = req.originalUrl.split('?')[0]; // Remove query parameters
            const pathParts = fullPath
                .split('/')
                .filter((part) => part && !part.startsWith(':'));

            // Get the full meaningful path (skip empty strings and dynamic parameters)
            const meaningfulParts = pathParts.filter(
                (part) => part && !part.startsWith(':'),
            );

            // Handle special cases
            if (meaningfulParts[0] === 'biometric') {
                return meaningfulParts.length > 1
                    ? meaningfulParts.slice(0, 2).join('/')
                    : 'biometric';
            }

            // Return the full path or just the first part if it's a single segment
            return meaningfulParts.length > 1
                ? meaningfulParts.join('/')
                : meaningfulParts[0] || 'unknown';
        };

        const module = getModuleName(req);

        // Generate description using full path
        const fullPath = req.originalUrl.split('?')[0]; // Remove query parameters
        const description = `${req.method} ${fullPath}`;

        // Get real client IP address
        const getClientIP = (req) => {
            return (
                req.headers['x-forwarded-for'] ||
                req.headers['x-real-ip'] ||
                req.connection?.remoteAddress ||
                req.socket?.remoteAddress ||
                (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
                req.ip ||
                '127.0.0.1'
            );
        };

        // Prepare metadata with better structure (optimized for performance)
        let metadata = {
            method: req.method,
            path: req.path,
            params: req.params,
            query: req.query,
            responseStatus: res.statusCode,
            // responseData: sanitizeResponse(responseData),
            timestamp: new Date().toISOString(),
            userRole: req.session?.roles || req.user?.roles || 'unknown',
            userEmail: req.session?.email || req.user?.email || 'unknown',
        };

        // For UPDATE operations, store original and updated data for comparison
        if ((req.method === 'PUT' || req.method === 'PATCH') && requestData) {
            // Get the response data
            const responseParsed =
                typeof responseData === 'string'
                    ? JSON.parse(responseData)
                    : responseData;
            const updatedData = responseParsed?.result || responseParsed;

            // Store original data for backup and comparison
            const originalData = requestData.originalData;

            metadata = {
                ...metadata,
                // Store essential data for comparison
                requestBody: sanitizeBody(requestData.body), // What user sent
                originalData: sanitizeBody(originalData), // Original data from database
                updatedData: sanitizeResponse({ ...requestData.body, ...updatedData }), // Updated data after save
                note: 'Original data from database vs Updated data after save - Compare manually in UI',
            };
        }

        // Create log entry
        await createLog({
            userId,
            staffId,
            action,
            module,
            description,
            metadata,
            ip: getClientIP(req),
            userAgent: req.get('User-Agent'),
        });
    } catch (error) {
        console.error('Error in auto-logger:', error);
    }
}

/**
 * Find changes between original and updated data
 */
function findChanges(originalData, updatedData) {
    if (!originalData || !updatedData) return {};

    const changes = {};

    // Compare all keys in updated data
    for (const key in updatedData) {
        if (originalData.hasOwnProperty(key)) {
            const originalValue = originalData[key];
            const updatedValue = updatedData[key];

            // Deep comparison for objects and arrays
            if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
                changes[key] = {
                    from: originalValue,
                    to: updatedValue,
                    type: getChangeType(originalValue, updatedValue),
                };
            }
        } else {
            // New field added
            changes[key] = {
                from: null,
                to: updatedData[key],
                type: 'added',
            };
        }
    }

    // Check for removed fields
    for (const key in originalData) {
        if (!updatedData.hasOwnProperty(key)) {
            changes[key] = {
                from: originalData[key],
                to: null,
                type: 'removed',
            };
        }
    }

    return changes;
}

/**
 * Get the type of change
 */
function getChangeType(from, to) {
    if (from === null || from === undefined) return 'added';
    if (to === null || to === undefined) return 'removed';
    if (typeof from !== typeof to) return 'type_changed';
    return 'modified';
}

/**
 * Sanitize request body to remove sensitive information
 */
function sanitizeBody(body) {
    if (!body) return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];

    sensitiveFields.forEach((field) => {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    });

    return sanitized;
}

/**
 * Sanitize response data to remove sensitive information
 */
function sanitizeResponse(data) {
    if (!data) return data;

    try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        const sanitized = { ...parsed };

        const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];

        sensitiveFields.forEach((field) => {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        });

        return sanitized;
    } catch (error) {
        return data;
    }
}
