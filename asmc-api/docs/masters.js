export const mastersSwagger = {
    // Facility endpoints
    '/masters/facility': {
        post: {
            tags: ['Masters'],
            description: 'Create a new facility',
            operationId: 'insertFacility',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['title', 'permalink', 'banner_url'],
                            properties: {
                                title: {
                                    type: 'string',
                                    example: 'Swimming Pool',
                                    description: 'Facility title/name',
                                },
                                permalink: {
                                    type: 'string',
                                    example: 'swimming-pool',
                                    description: 'URL-friendly identifier',
                                },
                                banner_url: {
                                    type: 'string',
                                    example: 'https://example.com/banner.jpg',
                                    description: 'Banner image URL',
                                },
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Active status of the facility',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Facility created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Facility Created Successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
        get: {
            tags: ['Masters'],
            description: 'Get single facility by ID',
            operationId: 'getSingleFacility',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id'],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the facility',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Facility details retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Success' },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
        put: {
            tags: ['Masters'],
            description: 'Update facility details',
            operationId: 'editFacility',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id', 'title', 'permalink', 'banner_url'],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the facility',
                                },
                                title: {
                                    type: 'string',
                                    example: 'Swimming Pool',
                                    description: 'Facility title/name',
                                },
                                permalink: {
                                    type: 'string',
                                    example: 'swimming-pool',
                                    description: 'URL-friendly identifier',
                                },
                                banner_url: {
                                    type: 'string',
                                    example: 'https://example.com/banner.jpg',
                                    description: 'Banner image URL',
                                },
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Active status of the facility',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Facility updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Facility updated successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
        delete: {
            tags: ['Masters'],
            description: 'Delete a facility',
            operationId: 'removeFacility',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'MongoDB ObjectId of the facility to delete',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Facility deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Facility deleted successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/masters/facility/list': {
        get: {
            tags: ['Masters'],
            description: 'Get paginated list of facilities with filtering and search',
            operationId: 'getFacilityList',
            parameters: [
                {
                    name: 'pageNo',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Page number for pagination',
                    example: '0',
                },
                {
                    name: 'limit',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Number of records per page',
                    example: '10',
                },
                {
                    name: 'sortBy',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Sort order (1 for ascending, -1 for descending)',
                    example: '-1',
                },
                {
                    name: 'sortField',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Field to sort by',
                    example: 'createdAt',
                },
                {
                    name: 'keywords',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Search keywords for facility title',
                    example: 'swimming',
                },
                {
                    name: 'active',
                    in: 'query',
                    schema: { type: 'boolean' },
                    description: 'Filter by active status',
                    example: true,
                },
            ],
            responses: {
                200: {
                    description: 'Facility list retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Facility records',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            result: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439011',
                                                        },
                                                        title: {
                                                            type: 'string',
                                                            example: 'Swimming Pool',
                                                        },
                                                        permalink: {
                                                            type: 'string',
                                                            example: 'swimming-pool',
                                                        },
                                                        banner_url: {
                                                            type: 'string',
                                                            example:
                                                                'https://example.com/banner.jpg',
                                                        },
                                                        status: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        createdAt: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                        },
                                                    },
                                                },
                                            },
                                            totalCount: { type: 'number', example: 25 },
                                            totalPages: { type: 'number', example: 3 },
                                            currentPage: { type: 'number', example: 1 },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    // Location endpoints
    '/masters/location': {
        post: {
            tags: ['Masters'],
            description: 'Create a new location',
            operationId: 'insertLocation',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['title', 'address'],
                            properties: {
                                parent_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Parent location ID (optional)',
                                },
                                title: {
                                    type: 'string',
                                    example: 'Main Sports Complex',
                                    description: 'Location title/name',
                                },
                                address: {
                                    type: 'string',
                                    example: '123 Sports Avenue, City, State 12345',
                                    description: 'Complete address of the location',
                                },
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Active status of the location',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Location created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Location Created Successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
        get: {
            tags: ['Masters'],
            description: 'Get single location by ID',
            operationId: 'getSingleLocation',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id'],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the location',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Location details retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Success' },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
        put: {
            tags: ['Masters'],
            description: 'Update location details',
            operationId: 'editLocation',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id', 'title', 'address'],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the location',
                                },
                                parent_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Parent location ID (optional)',
                                },
                                title: {
                                    type: 'string',
                                    example: 'Main Sports Complex',
                                    description: 'Location title/name',
                                },
                                address: {
                                    type: 'string',
                                    example: '123 Sports Avenue, City, State 12345',
                                    description: 'Complete address of the location',
                                },
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Active status of the location',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Location updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Location updated successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
        delete: {
            tags: ['Masters'],
            description: 'Delete a location',
            operationId: 'removeLocation',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'MongoDB ObjectId of the location to delete',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Location deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Location deleted successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/masters/location/parent': {
        get: {
            tags: ['Masters'],
            description: 'Get all parent locations (locations without parent_id)',
            operationId: 'getActionParentLocation',
            responses: {
                200: {
                    description: 'Parent locations retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Location records',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                    example: '507f1f77bcf86cd799439011',
                                                },
                                                title: {
                                                    type: 'string',
                                                    example: 'Main Sports Complex',
                                                },
                                                address: {
                                                    type: 'string',
                                                    example:
                                                        '123 Sports Avenue, City, State 12345',
                                                },
                                                status: {
                                                    type: 'boolean',
                                                    example: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/masters/location/list': {
        get: {
            tags: ['Masters'],
            description: 'Get paginated list of locations with filtering and search',
            operationId: 'getLocationList',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'pageNo',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Page number for pagination',
                    example: '0',
                },
                {
                    name: 'limit',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Number of records per page',
                    example: '10',
                },
                {
                    name: 'sortBy',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Sort order (1 for ascending, -1 for descending)',
                    example: '-1',
                },
                {
                    name: 'sortField',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Field to sort by',
                    example: 'createdAt',
                },
                {
                    name: 'keywords',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Search keywords for location title',
                    example: 'sports',
                },
                {
                    name: 'active',
                    in: 'query',
                    schema: { type: 'boolean' },
                    description: 'Filter by active status',
                    example: true,
                },
                {
                    name: 'parent_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by parent location ID',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Location list retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Location records',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            result: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439011',
                                                        },
                                                        title: {
                                                            type: 'string',
                                                            example:
                                                                'Main Sports Complex',
                                                        },
                                                        address: {
                                                            type: 'string',
                                                            example:
                                                                '123 Sports Avenue, City, State 12345',
                                                        },
                                                        status: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        parent_id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439011',
                                                        },
                                                        createdAt: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                        },
                                                    },
                                                },
                                            },
                                            totalCount: { type: 'number', example: 50 },
                                            totalPages: { type: 'number', example: 5 },
                                            currentPage: { type: 'number', example: 1 },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    // Category endpoints
    '/masters/category': {
        post: {
            tags: ['Masters'],
            description: 'Create a new category',
            operationId: 'insertCategory',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['title'],
                            properties: {
                                parent_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Parent category ID (optional)',
                                },
                                title: {
                                    type: 'string',
                                    example: 'Sports & Recreation',
                                    description: 'Category title/name',
                                },
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Active status of the category',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Category created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Category Created Successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
        get: {
            tags: ['Masters'],
            description: 'Get single category by ID',
            operationId: 'getSingleCategory',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id'],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the category',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Category details retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Success' },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
        put: {
            tags: ['Masters'],
            description: 'Update category details',
            operationId: 'editCategory',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id', 'title'],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the category',
                                },
                                parent_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Parent category ID (optional)',
                                },
                                title: {
                                    type: 'string',
                                    example: 'Sports & Recreation',
                                    description: 'Category title/name',
                                },
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Active status of the category',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Category updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Category updated successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
        delete: {
            tags: ['Masters'],
            description: 'Delete a category',
            operationId: 'removeCategory',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'MongoDB ObjectId of the category to delete',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Category deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Category deleted successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/masters/category/parent': {
        get: {
            tags: ['Masters'],
            description: 'Get all parent categories (categories without parent_id)',
            operationId: 'getActionParentCategory',
            responses: {
                200: {
                    description: 'Parent categories retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Category records',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                    example: '507f1f77bcf86cd799439011',
                                                },
                                                title: {
                                                    type: 'string',
                                                    example: 'Sports & Recreation',
                                                },
                                                status: {
                                                    type: 'boolean',
                                                    example: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/masters/category/list': {
        get: {
            tags: ['Masters'],
            description: 'Get paginated list of categories with filtering and search',
            operationId: 'getCategoryList',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'pageNo',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Page number for pagination',
                    example: '0',
                },
                {
                    name: 'limit',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Number of records per page',
                    example: '10',
                },
                {
                    name: 'sortBy',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Sort order (1 for ascending, -1 for descending)',
                    example: '-1',
                },
                {
                    name: 'sortField',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Field to sort by',
                    example: 'createdAt',
                },
                {
                    name: 'keywords',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Search keywords for category title',
                    example: 'sports',
                },
                {
                    name: 'active',
                    in: 'query',
                    schema: { type: 'boolean' },
                    description: 'Filter by active status',
                    example: true,
                },
            ],
            responses: {
                200: {
                    description: 'Category list retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Category records',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            result: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439011',
                                                        },
                                                        title: {
                                                            type: 'string',
                                                            example:
                                                                'Sports & Recreation',
                                                        },
                                                        status: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        parent_id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439011',
                                                        },
                                                        createdAt: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                        },
                                                    },
                                                },
                                            },
                                            totalCount: { type: 'number', example: 30 },
                                            totalPages: { type: 'number', example: 3 },
                                            currentPage: { type: 'number', example: 1 },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
