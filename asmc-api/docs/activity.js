export const activitySwagger = {
    '/activity': {
        post: {
            tags: ['Activity'],
            description: 'Create a new activity/sport',
            operationId: 'insertActivity',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['name', 'location', 'status'],
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'Badminton',
                                    description: 'Name of the activity/sport',
                                },
                                facility_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description:
                                        'Facility ID (automatically set to sports-booking)',
                                },
                                thumbnail: {
                                    type: 'string',
                                    example:
                                        'https://example.com/thumbnails/badminton.jpg',
                                    description: 'Thumbnail image URL for the activity',
                                },
                                images: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: [
                                        'https://example.com/images/badminton1.jpg',
                                        'https://example.com/images/badminton2.jpg',
                                    ],
                                    description: 'Array of image URLs for the activity',
                                },
                                short_description: {
                                    type: 'string',
                                    example:
                                        'Fast-paced racquet sport played with shuttlecock',
                                    description: 'Brief description of the activity',
                                },
                                description: {
                                    type: 'string',
                                    example:
                                        'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net. It can be played with larger teams, but the most common forms of the game are "singles" and "doubles".',
                                    description: 'Detailed description of the activity',
                                },
                                location: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            label: { type: 'string', example: 'Court 1' },
                                            value: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                        },
                                    },
                                    example: [
                                        {
                                            label: 'Court 1',
                                            value: '507f1f77bcf86cd799439011',
                                        },
                                        {
                                            label: 'Court 2',
                                            value: '507f1f77bcf86cd799439012',
                                        },
                                    ],
                                    description:
                                        'Array of locations where the activity is available',
                                },
                                batch_booking_plan: {
                                    type: 'object',
                                    description:
                                        'Booking plan configuration for the activity',
                                },
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Active status of the activity',
                                },
                                category: {
                                    type: 'string',
                                    example: 'Racquet Sports',
                                    description: 'Category of the activity',
                                },
                                show_hide: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Visibility setting for the activity',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Activity created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Activity has been created successfully',
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
            tags: ['Activity'],
            description:
                'Get single activity details by ID or activity_id with batch information and booking slots',
            operationId: 'getSingleActivity',
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'MongoDB ObjectId of the activity',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'activity_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Numeric activity ID',
                    example: '1',
                },
            ],
            responses: {
                200: {
                    description: 'Activity details retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Success' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            activity_id: { type: 'number', example: 1 },
                                            name: {
                                                type: 'string',
                                                example: 'Badminton',
                                            },
                                            thumbnail: {
                                                type: 'string',
                                                example:
                                                    'https://example.com/thumbnails/badminton.jpg',
                                            },
                                            images: {
                                                type: 'array',
                                                items: { type: 'string' },
                                            },
                                            short_description: {
                                                type: 'string',
                                                example: 'Fast-paced racquet sport',
                                            },
                                            description: {
                                                type: 'string',
                                                example: 'Detailed description...',
                                            },
                                            location: {
                                                type: 'array',
                                                items: { type: 'object' },
                                            },
                                            status: { type: 'boolean', example: true },
                                            category: {
                                                type: 'string',
                                                example: 'Racquet Sports',
                                            },
                                            show_hide: { type: 'boolean', example: true },
                                            batchData: {
                                                type: 'array',
                                                description:
                                                    'Booking batches with available slots',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: { type: 'string' },
                                                        batch_name: {
                                                            type: 'string',
                                                            example: 'Morning Session',
                                                        },
                                                        batch_code: {
                                                            type: 'string',
                                                            example: 'BAD001',
                                                        },
                                                        days: { type: 'array' },
                                                        start_time: {
                                                            type: 'string',
                                                            example: '06:00',
                                                        },
                                                        end_time: {
                                                            type: 'string',
                                                            example: '08:00',
                                                        },
                                                        batch_limit: {
                                                            type: 'number',
                                                            example: 4,
                                                        },
                                                        booked_slots: {
                                                            type: 'array',
                                                            description:
                                                                'Currently booked time slots',
                                                            items: {
                                                                type: 'object',
                                                                properties: {
                                                                    booking_date: {
                                                                        type: 'string',
                                                                        format: 'date',
                                                                    },
                                                                    booking_time: {
                                                                        type: 'string',
                                                                        example:
                                                                            '06:00-07:00',
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                            vacancies: {
                                                type: 'array',
                                                description:
                                                    'Enrollment batches with vacancies',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: { type: 'string' },
                                                        batch_name: {
                                                            type: 'string',
                                                            example: 'Beginner Class',
                                                        },
                                                        batch_code: {
                                                            type: 'string',
                                                            example: 'BAD_ENR001',
                                                        },
                                                        batch_limit: {
                                                            type: 'number',
                                                            example: 20,
                                                        },
                                                        location_title: {
                                                            type: 'string',
                                                            example: 'Main Court',
                                                        },
                                                        sublocation_title: {
                                                            type: 'string',
                                                            example: 'Court 1',
                                                        },
                                                        category_title: {
                                                            type: 'string',
                                                            example: 'Racquet Sports',
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
        },
        put: {
            tags: ['Activity'],
            description: 'Update activity details',
            operationId: 'editActivity',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id', 'name'],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the activity',
                                },
                                name: {
                                    type: 'string',
                                    example: 'Badminton',
                                    description: 'Name of the activity/sport',
                                },
                                facility_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Facility ID',
                                },
                                thumbnail: {
                                    type: 'string',
                                    example:
                                        'https://example.com/thumbnails/badminton.jpg',
                                    description: 'Thumbnail image URL for the activity',
                                },
                                images: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: [
                                        'https://example.com/images/badminton1.jpg',
                                        'https://example.com/images/badminton2.jpg',
                                    ],
                                    description: 'Array of image URLs for the activity',
                                },
                                short_description: {
                                    type: 'string',
                                    example:
                                        'Fast-paced racquet sport played with shuttlecock',
                                    description: 'Brief description of the activity',
                                },
                                description: {
                                    type: 'string',
                                    example:
                                        'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.',
                                    description: 'Detailed description of the activity',
                                },
                                location: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            label: { type: 'string', example: 'Court 1' },
                                            value: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                        },
                                    },
                                    description:
                                        'Array of locations where the activity is available',
                                },
                                batch_booking_plan: {
                                    type: 'object',
                                    description:
                                        'Booking plan configuration for the activity',
                                },
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Active status of the activity',
                                },
                                category: {
                                    type: 'string',
                                    example: 'Racquet Sports',
                                    description: 'Category of the activity',
                                },
                                show_hide: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Visibility setting for the activity',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Activity updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Activity updated successfully',
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
            tags: ['Activity'],
            description: 'Delete an activity',
            operationId: 'removeActivity',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'MongoDB ObjectId of the activity to delete',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Activity deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Activity deleted successfully',
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
    '/activity/list': {
        get: {
            tags: ['Activity'],
            description:
                'Get paginated list of activities with advanced filtering and search capabilities',
            operationId: 'getActivityList',
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
                    description:
                        'Search keywords for activity_id, name, short_description, category, or location labels',
                    example: 'badminton',
                },
                {
                    name: 'active',
                    in: 'query',
                    schema: { type: 'boolean' },
                    description: 'Filter by active status',
                    example: true,
                },
                {
                    name: 'facility_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by facility ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'batch_status',
                    in: 'query',
                    schema: { type: 'boolean' },
                    description: 'Filter by batch status',
                    example: true,
                },
                {
                    name: 'type',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by batch type',
                    example: 'booking',
                },
                {
                    name: 'activity_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by specific activity ID',
                    example: '1',
                },
                {
                    name: 'show_hide',
                    in: 'query',
                    schema: { type: 'boolean' },
                    description: 'Filter by visibility setting',
                    example: true,
                },
            ],
            responses: {
                200: {
                    description: 'Activity list retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Activity records',
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
                                                        activity_id: {
                                                            type: 'number',
                                                            example: 1,
                                                        },
                                                        name: {
                                                            type: 'string',
                                                            example: 'Badminton',
                                                        },
                                                        thumbnail: {
                                                            type: 'string',
                                                            example:
                                                                'https://example.com/thumbnails/badminton.jpg',
                                                        },
                                                        short_description: {
                                                            type: 'string',
                                                            example:
                                                                'Fast-paced racquet sport',
                                                        },
                                                        category: {
                                                            type: 'string',
                                                            example: 'Racquet Sports',
                                                        },
                                                        status: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        show_hide: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        location: {
                                                            type: 'array',
                                                            items: { type: 'object' },
                                                        },
                                                        batch_data: { type: 'object' },
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
    '/activity/active-list': {
        get: {
            tags: ['Activity'],
            description: 'Get list of active activities (public endpoint)',
            operationId: 'getActiveActivityList',
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
                    example: '1',
                },
                {
                    name: 'sortField',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Field to sort by',
                    example: 'name',
                },
                {
                    name: 'keywords',
                    in: 'query',
                    schema: { type: 'string' },
                    description:
                        'Search keywords for name, short_description, or category',
                    example: 'sports',
                },
                {
                    name: 'facility_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by facility ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'activity_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by specific activity ID',
                    example: '1',
                },
                {
                    name: 'show_hide',
                    in: 'query',
                    schema: { type: 'boolean' },
                    description: 'Filter by visibility setting',
                    example: true,
                },
            ],
            responses: {
                200: {
                    description: 'Active activities retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Activity records',
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
                                                        activity_id: {
                                                            type: 'number',
                                                            example: 1,
                                                        },
                                                        name: {
                                                            type: 'string',
                                                            example: 'Badminton',
                                                        },
                                                        thumbnail: {
                                                            type: 'string',
                                                            example:
                                                                'https://example.com/thumbnails/badminton.jpg',
                                                        },
                                                        short_description: {
                                                            type: 'string',
                                                            example:
                                                                'Fast-paced racquet sport',
                                                        },
                                                        category: {
                                                            type: 'string',
                                                            example: 'Racquet Sports',
                                                        },
                                                        status: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        show_hide: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        location: {
                                                            type: 'array',
                                                            items: { type: 'object' },
                                                        },
                                                    },
                                                },
                                            },
                                            totalCount: { type: 'number', example: 15 },
                                            totalPages: { type: 'number', example: 2 },
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
    '/activity/top-activity': {
        get: {
            tags: ['Activity'],
            description: 'Get top 10 most booked activities based on booking statistics',
            operationId: 'getTopActivityList',
            responses: {
                200: {
                    description: 'Top activities retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Activity records',
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
                                                activity_id: {
                                                    type: 'number',
                                                    example: 1,
                                                },
                                                name: {
                                                    type: 'string',
                                                    example: 'Badminton',
                                                },
                                                thumbnail: {
                                                    type: 'string',
                                                    example:
                                                        'https://example.com/thumbnails/badminton.jpg',
                                                },
                                                images: {
                                                    type: 'array',
                                                    items: { type: 'string' },
                                                },
                                                short_description: {
                                                    type: 'string',
                                                    example: 'Fast-paced racquet sport',
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
    '/activity/dropdown': {
        get: {
            tags: ['Activity'],
            description: 'Get active activities in dropdown format (label-value pairs)',
            operationId: 'getActiveActivityListDropdown',
            responses: {
                200: {
                    description: 'Activity dropdown retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Activity records',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                label: {
                                                    type: 'string',
                                                    example: 'Badminton',
                                                },
                                                value: {
                                                    type: 'string',
                                                    example: '507f1f77bcf86cd799439011',
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
};
