import Joi from 'joi';

/**
 * Validation schemas for documentation endpoints
 */

// Component validation
export const componentSchema = Joi.string()
    .valid('asmc-api', 'asmc-admin', 'asmcdae-mobile', 'asmc-next', 'system-deployment')
    .required()
    .messages({
        'any.only':
            'Component must be one of: asmc-api, asmc-admin, asmcdae-mobile, asmc-next, system-deployment',
        'any.required': 'Component is required',
    });

// Filename validation
export const filenameSchema = Joi.string()
    .pattern(/^[a-zA-Z0-9._-]+$/)
    .min(1)
    .max(100)
    .required()
    .messages({
        'string.pattern.base':
            'Filename can only contain alphanumeric characters, dots, hyphens, and underscores',
        'string.min': 'Filename must be at least 1 character long',
        'string.max': 'Filename cannot exceed 100 characters',
        'any.required': 'Filename is required',
    });

// Search query validation
export const searchQuerySchema = Joi.string().min(2).max(100).required().messages({
    'string.min': 'Search query must be at least 2 characters long',
    'string.max': 'Search query cannot exceed 100 characters',
    'any.required': 'Search query is required',
});

// Format validation for downloads
export const formatSchema = Joi.string().valid('md', 'txt').default('md').messages({
    'any.only': 'Format must be either md or txt',
});

/**
 * Validation middleware functions
 */

// Validate component parameter
export const validateComponent = (req, res, next) => {
    const { error } = componentSchema.validate(req.params.component);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
            result: {
                field: 'component',
                value: req.params.component,
                validValues: [
                    'asmc-api',
                    'asmc-admin',
                    'asmcdae-mobile',
                    'asmc-next',
                    'system-deployment',
                ],
            },
        });
    }
    next();
};

// Validate filename parameter
export const validateFilename = (req, res, next) => {
    const { error } = filenameSchema.validate(req.params.filename);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
            result: {
                field: 'filename',
                value: req.params.filename,
                pattern: 'Alphanumeric characters, dots, hyphens, and underscores only',
            },
        });
    }
    next();
};

// Validate search query
export const validateSearchQuery = (req, res, next) => {
    const { error } = searchQuerySchema.validate(req.query.q);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
            result: {
                field: 'q',
                value: req.query.q,
                minLength: 2,
                maxLength: 100,
            },
        });
    }
    next();
};

// Validate component query parameter (optional)
export const validateComponentQuery = (req, res, next) => {
    if (req.query.component) {
        const { error } = componentSchema.validate(req.query.component);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                result: {
                    field: 'component',
                    value: req.query.component,
                    validValues: [
                        'asmc-api',
                        'asmc-admin',
                        'asmcdae-mobile',
                        'asmc-next',
                        'system-deployment',
                    ],
                },
            });
        }
    }
    next();
};

// Validate format query parameter
export const validateFormat = (req, res, next) => {
    if (req.query.format) {
        const { error } = formatSchema.validate(req.query.format);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                result: {
                    field: 'format',
                    value: req.query.format,
                    validValues: ['md', 'txt'],
                },
            });
        }
    }
    next();
};

/**
 * Combined validation middleware
 */

// Validate get documentation file request
export const validateGetFile = [validateComponent, validateFilename];

// Validate download file request
export const validateDownloadFile = [validateComponent, validateFilename, validateFormat];

// Validate search request
export const validateSearch = [validateSearchQuery, validateComponentQuery];

/**
 * Custom validation functions
 */

// Check if file exists
export const checkFileExists = (req, res, next) => {
    const fs = require('fs');
    const path = require('path');
    const { component, filename } = req.params;

    const filePath = path.join(
        __dirname,
        '../../../tech-documents',
        component,
        `${filename}.md`,
    );

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            message: 'Documentation file not found',
            result: {
                component,
                filename,
                path: `/documentation/${component}/${filename}`,
            },
        });
    }

    req.filePath = filePath;
    next();
};

// Check if component directory exists
export const checkComponentExists = (req, res, next) => {
    const fs = require('fs');
    const path = require('path');
    const { component } = req.params;

    const componentPath = path.join(__dirname, '../../../tech-documents', component);

    if (!fs.existsSync(componentPath)) {
        return res.status(404).json({
            success: false,
            message: 'Documentation component not found',
            result: {
                component,
                path: `/documentation/${component}`,
            },
        });
    }

    req.componentPath = componentPath;
    next();
};

/**
 * Sanitization functions
 */

// Sanitize search query
export const sanitizeSearchQuery = (req, res, next) => {
    if (req.query.q) {
        req.query.q = req.query.q.trim();
    }
    next();
};

// Sanitize filename
export const sanitizeFilename = (req, res, next) => {
    if (req.params.filename) {
        req.params.filename = req.params.filename.trim();
    }
    next();
};

/**
 * Rate limiting for search endpoint
 */
export const searchRateLimit = (req, res, next) => {
    // Simple in-memory rate limiting for search
    if (!global.searchRequests) {
        global.searchRequests = new Map();
    }

    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 10; // 10 requests per minute

    if (!global.searchRequests.has(clientId)) {
        global.searchRequests.set(clientId, []);
    }

    const requests = global.searchRequests.get(clientId);

    // Remove old requests outside the window
    const validRequests = requests.filter((time) => now - time < windowMs);
    global.searchRequests.set(clientId, validRequests);

    if (validRequests.length >= maxRequests) {
        return res.status(429).json({
            success: false,
            message: 'Too many search requests. Please try again later.',
            result: {
                limit: maxRequests,
                window: '1 minute',
                retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000),
            },
        });
    }

    // Add current request
    validRequests.push(now);
    global.searchRequests.set(clientId, validRequests);

    next();
};

/**
 * Error handling middleware
 */
export const handleValidationError = (error, req, res, next) => {
    if (error.isJoi) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            result: {
                details: error.details.map((detail) => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                    value: detail.context.value,
                })),
            },
        });
    }
    next(error);
};
