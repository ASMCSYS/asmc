export const eventsSwagger = {
    // Event Management
    '/events': {
        get: {
            tags: ['Events'],
            description: 'Get single event details by ID or event_id',
            operationId: 'getSingleEvents',
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Event MongoDB ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'event_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Event unique identifier',
                    example: 'EVT001',
                },
            ],
            responses: {
                200: {
                    description: 'Event details retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Event retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            event_id: {
                                                type: 'string',
                                                example: 'EVT001',
                                            },
                                            event_name: {
                                                type: 'string',
                                                example: 'Annual Tennis Championship',
                                            },
                                            event_type: {
                                                type: 'string',
                                                example: 'Team',
                                                enum: ['Single', 'Double', 'Team'],
                                            },
                                            members_type: {
                                                type: 'string',
                                                example: 'All Members',
                                            },
                                            description: {
                                                type: 'string',
                                                example:
                                                    'Annual tennis championship for all members',
                                            },
                                            text_content: {
                                                type: 'string',
                                                example:
                                                    'Detailed event information and rules',
                                            },
                                            images: {
                                                type: 'array',
                                                items: { type: 'string' },
                                                example: [
                                                    'https://imagekit.io/event1.jpg',
                                                ],
                                            },
                                            event_start_date: {
                                                type: 'string',
                                                format: 'date',
                                                example: '2024-02-15',
                                            },
                                            event_end_date: {
                                                type: 'string',
                                                format: 'date',
                                                example: '2024-02-17',
                                            },
                                            event_start_time: {
                                                type: 'string',
                                                example: '09:00',
                                            },
                                            event_end_time: {
                                                type: 'string',
                                                example: '18:00',
                                            },
                                            broadcast_start_date: {
                                                type: 'string',
                                                format: 'date',
                                                example: '2024-02-15',
                                            },
                                            broadcast_end_date: {
                                                type: 'string',
                                                format: 'date',
                                                example: '2024-02-17',
                                            },
                                            broadcast_start_time: {
                                                type: 'string',
                                                example: '09:00',
                                            },
                                            broadcast_end_time: {
                                                type: 'string',
                                                example: '18:00',
                                            },
                                            registration_start_date: {
                                                type: 'string',
                                                format: 'date',
                                                example: '2024-01-01',
                                            },
                                            registration_end_date: {
                                                type: 'string',
                                                format: 'date',
                                                example: '2024-02-10',
                                            },
                                            registration_start_time: {
                                                type: 'string',
                                                example: '00:00',
                                            },
                                            registration_end_time: {
                                                type: 'string',
                                                example: '23:59',
                                            },
                                            location_id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            sublocation_id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            court: { type: 'string', example: 'Court A' },
                                            players_limit: {
                                                type: 'number',
                                                example: 32,
                                            },
                                            min_players_limit: {
                                                type: 'number',
                                                example: 16,
                                            },
                                            member_team_event_price: {
                                                type: 'number',
                                                example: 500,
                                            },
                                            non_member_team_event_price: {
                                                type: 'number',
                                                example: 750,
                                            },
                                            category_data: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        category_name: {
                                                            type: 'string',
                                                            example: 'Men Singles',
                                                        },
                                                        member_fees: {
                                                            type: 'number',
                                                            example: 200,
                                                        },
                                                        non_member_fees: {
                                                            type: 'number',
                                                            example: 300,
                                                        },
                                                        age_group: {
                                                            type: 'string',
                                                            example: '18-35',
                                                        },
                                                        gender: {
                                                            type: 'string',
                                                            example: 'Male',
                                                        },
                                                    },
                                                },
                                            },
                                            status: { type: 'boolean', example: true },
                                            createdAt: {
                                                type: 'string',
                                                format: 'date-time',
                                                example: '2024-01-15T10:30:00Z',
                                            },
                                            updatedAt: {
                                                type: 'string',
                                                format: 'date-time',
                                                example: '2024-01-15T10:30:00Z',
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
        post: {
            tags: ['Events'],
            description: 'Create a new event',
            operationId: 'insertEvents',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'event_name',
                                'event_type',
                                'members_type',
                                'description',
                                'category_data',
                            ],
                            properties: {
                                event_name: {
                                    type: 'string',
                                    example: 'Annual Tennis Championship',
                                    description: 'Event name',
                                },
                                event_type: {
                                    type: 'string',
                                    example: 'Team',
                                    description: 'Event type',
                                    enum: ['Single', 'Double', 'Team'],
                                },
                                members_type: {
                                    type: 'string',
                                    example: 'All Members',
                                    description: 'Members type allowed',
                                },
                                description: {
                                    type: 'string',
                                    example: 'Annual tennis championship for all members',
                                    description: 'Event description',
                                },
                                text_content: {
                                    type: 'string',
                                    example: 'Detailed event information and rules',
                                    description: 'Additional text content',
                                },
                                images: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['https://imagekit.io/event1.jpg'],
                                    description: 'Event images URLs',
                                },
                                event_start_date: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-02-15',
                                    description: 'Event start date',
                                },
                                event_end_date: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-02-17',
                                    description: 'Event end date',
                                },
                                event_start_time: {
                                    type: 'string',
                                    example: '09:00',
                                    description: 'Event start time',
                                },
                                event_end_time: {
                                    type: 'string',
                                    example: '18:00',
                                    description: 'Event end time',
                                },
                                broadcast_start_date: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-02-15',
                                    description: 'Broadcast start date',
                                },
                                broadcast_end_date: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-02-17',
                                    description: 'Broadcast end date',
                                },
                                broadcast_start_time: {
                                    type: 'string',
                                    example: '09:00',
                                    description: 'Broadcast start time',
                                },
                                broadcast_end_time: {
                                    type: 'string',
                                    example: '18:00',
                                    description: 'Broadcast end time',
                                },
                                registration_start_date: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-01-01',
                                    description: 'Registration start date',
                                },
                                registration_end_date: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-02-10',
                                    description: 'Registration end date',
                                },
                                registration_start_time: {
                                    type: 'string',
                                    example: '00:00',
                                    description: 'Registration start time',
                                },
                                registration_end_time: {
                                    type: 'string',
                                    example: '23:59',
                                    description: 'Registration end time',
                                },
                                location_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Location ID',
                                },
                                sublocation_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Sub-location ID',
                                },
                                court: {
                                    type: 'string',
                                    example: 'Court A',
                                    description: 'Court information',
                                },
                                players_limit: {
                                    type: 'number',
                                    example: 32,
                                    description:
                                        'Maximum players limit (required for Team events)',
                                    minimum: 1,
                                },
                                min_players_limit: {
                                    type: 'number',
                                    example: 16,
                                    description:
                                        'Minimum players limit (required for Team events)',
                                    minimum: 1,
                                },
                                member_team_event_price: {
                                    type: 'number',
                                    example: 500,
                                    description:
                                        'Member team event price (required for Team events)',
                                    minimum: 0,
                                },
                                non_member_team_event_price: {
                                    type: 'number',
                                    example: 750,
                                    description:
                                        'Non-member team event price (required for Team events)',
                                    minimum: 0,
                                },
                                category_data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            category_name: {
                                                type: 'string',
                                                example: 'Men Singles',
                                            },
                                            member_fees: { type: 'number', example: 200 },
                                            non_member_fees: {
                                                type: 'number',
                                                example: 300,
                                            },
                                            age_group: {
                                                type: 'string',
                                                example: '18-35',
                                            },
                                            gender: { type: 'string', example: 'Male' },
                                        },
                                    },
                                    description: 'Event categories and pricing',
                                },
                                status: {
                                    type: 'boolean',
                                    example: false,
                                    description:
                                        'Event status (defaults to false for new events)',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Event created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Event Created Successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
        put: {
            tags: ['Events'],
            description: 'Update event details',
            operationId: 'editEvents',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id', 'event_name'],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Event MongoDB ID',
                                },
                                event_name: {
                                    type: 'string',
                                    example: 'Updated Annual Tennis Championship',
                                    description: 'Event name',
                                },
                                event_type: {
                                    type: 'string',
                                    example: 'Team',
                                    description: 'Event type',
                                    enum: ['Single', 'Double', 'Team'],
                                },
                                members_type: {
                                    type: 'string',
                                    example: 'All Members',
                                    description: 'Members type allowed',
                                },
                                description: {
                                    type: 'string',
                                    example:
                                        'Updated annual tennis championship for all members',
                                    description: 'Event description',
                                },
                                text_content: {
                                    type: 'string',
                                    example:
                                        'Updated detailed event information and rules',
                                    description: 'Additional text content',
                                },
                                images: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['https://imagekit.io/event1_updated.jpg'],
                                    description: 'Event images URLs',
                                },
                                event_start_date: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-02-20',
                                    description: 'Updated event start date',
                                },
                                event_end_date: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-02-22',
                                    description: 'Updated event end date',
                                },
                                players_limit: {
                                    type: 'number',
                                    example: 40,
                                    description: 'Updated maximum players limit',
                                    minimum: 1,
                                },
                                min_players_limit: {
                                    type: 'number',
                                    example: 20,
                                    description: 'Updated minimum players limit',
                                    minimum: 1,
                                },
                                member_team_event_price: {
                                    type: 'number',
                                    example: 600,
                                    description: 'Updated member team event price',
                                    minimum: 0,
                                },
                                non_member_team_event_price: {
                                    type: 'number',
                                    example: 900,
                                    description: 'Updated non-member team event price',
                                    minimum: 0,
                                },
                                category_data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            category_name: {
                                                type: 'string',
                                                example: 'Men Singles',
                                            },
                                            member_fees: { type: 'number', example: 250 },
                                            non_member_fees: {
                                                type: 'number',
                                                example: 350,
                                            },
                                            age_group: {
                                                type: 'string',
                                                example: '18-35',
                                            },
                                            gender: { type: 'string', example: 'Male' },
                                        },
                                    },
                                    description: 'Updated event categories and pricing',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Event updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Event updated successfully',
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
            tags: ['Events'],
            description: 'Delete an event',
            operationId: 'removeEvents',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Event MongoDB ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'event_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Event unique identifier',
                    example: 'EVT001',
                },
            ],
            responses: {
                200: {
                    description: 'Event deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Event deleted successfully',
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
    '/events/list': {
        get: {
            tags: ['Events'],
            description: 'Get paginated list of events with filtering and search',
            operationId: 'getEventsList',
            parameters: [
                {
                    name: 'pageNo',
                    in: 'query',
                    schema: { type: 'string', default: '0' },
                    description: 'Page number for pagination',
                    example: '0',
                },
                {
                    name: 'limit',
                    in: 'query',
                    schema: { type: 'string', default: '10' },
                    description: 'Number of records per page',
                    example: '10',
                },
                {
                    name: 'sortBy',
                    in: 'query',
                    schema: { type: 'string', default: '-1' },
                    description: 'Sort order (-1 for descending, 1 for ascending)',
                    example: '-1',
                },
                {
                    name: 'sortField',
                    in: 'query',
                    schema: { type: 'string', default: 'createdAt' },
                    description: 'Field to sort by',
                    example: 'createdAt',
                },
                {
                    name: 'keywords',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Search keywords for event name or description',
                    example: 'tennis',
                },
                {
                    name: 'active',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by active status',
                    example: 'true',
                    enum: ['true', 'false'],
                },
                {
                    name: 'event_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by event ID',
                    example: 'EVT001',
                },
            ],
            responses: {
                200: {
                    description: 'Events list retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Events retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            events: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439011',
                                                        },
                                                        event_id: {
                                                            type: 'string',
                                                            example: 'EVT001',
                                                        },
                                                        event_name: {
                                                            type: 'string',
                                                            example:
                                                                'Annual Tennis Championship',
                                                        },
                                                        event_type: {
                                                            type: 'string',
                                                            example: 'Team',
                                                        },
                                                        description: {
                                                            type: 'string',
                                                            example:
                                                                'Annual tennis championship for all members',
                                                        },
                                                        event_start_date: {
                                                            type: 'string',
                                                            format: 'date',
                                                            example: '2024-02-15',
                                                        },
                                                        event_end_date: {
                                                            type: 'string',
                                                            format: 'date',
                                                            example: '2024-02-17',
                                                        },
                                                        status: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        createdAt: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                            example:
                                                                '2024-01-15T10:30:00Z',
                                                        },
                                                    },
                                                },
                                            },
                                            pagination: {
                                                type: 'object',
                                                properties: {
                                                    totalCount: {
                                                        type: 'number',
                                                        example: 50,
                                                    },
                                                    pageNo: {
                                                        type: 'number',
                                                        example: 0,
                                                    },
                                                    limit: {
                                                        type: 'number',
                                                        example: 10,
                                                    },
                                                    totalPages: {
                                                        type: 'number',
                                                        example: 5,
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
    '/events/active': {
        get: {
            tags: ['Events'],
            description: 'Get list of active events (public endpoint)',
            operationId: 'getActiveEventsList',
            parameters: [
                {
                    name: 'pageNo',
                    in: 'query',
                    schema: { type: 'string', default: '0' },
                    description: 'Page number for pagination',
                    example: '0',
                },
                {
                    name: 'limit',
                    in: 'query',
                    schema: { type: 'string', default: '10' },
                    description: 'Number of records per page',
                    example: '10',
                },
                {
                    name: 'sortBy',
                    in: 'query',
                    schema: { type: 'string', default: '-1' },
                    description: 'Sort order (-1 for descending, 1 for ascending)',
                    example: '-1',
                },
                {
                    name: 'sortField',
                    in: 'query',
                    schema: { type: 'string', default: 'createdAt' },
                    description: 'Field to sort by',
                    example: 'createdAt',
                },
                {
                    name: 'keywords',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Search keywords for event name or description',
                    example: 'tennis',
                },
                {
                    name: 'active',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by active status',
                    example: 'true',
                    enum: ['true', 'false'],
                },
                {
                    name: 'event_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by event ID',
                    example: 'EVT001',
                },
            ],
            responses: {
                200: {
                    description: 'Active events retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Active events retrieved successfully',
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
                                                event_id: {
                                                    type: 'string',
                                                    example: 'EVT001',
                                                },
                                                event_name: {
                                                    type: 'string',
                                                    example: 'Annual Tennis Championship',
                                                },
                                                event_type: {
                                                    type: 'string',
                                                    example: 'Team',
                                                },
                                                description: {
                                                    type: 'string',
                                                    example:
                                                        'Annual tennis championship for all members',
                                                },
                                                event_start_date: {
                                                    type: 'string',
                                                    format: 'date',
                                                    example: '2024-02-15',
                                                },
                                                event_end_date: {
                                                    type: 'string',
                                                    format: 'date',
                                                    example: '2024-02-17',
                                                },
                                                registration_start_date: {
                                                    type: 'string',
                                                    format: 'date',
                                                    example: '2024-01-01',
                                                },
                                                registration_end_date: {
                                                    type: 'string',
                                                    format: 'date',
                                                    example: '2024-02-10',
                                                },
                                                category_data: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            category_name: {
                                                                type: 'string',
                                                                example: 'Men Singles',
                                                            },
                                                            member_fees: {
                                                                type: 'number',
                                                                example: 200,
                                                            },
                                                            non_member_fees: {
                                                                type: 'number',
                                                                example: 300,
                                                            },
                                                        },
                                                    },
                                                },
                                                images: {
                                                    type: 'array',
                                                    items: { type: 'string' },
                                                    example: [
                                                        'https://imagekit.io/event1.jpg',
                                                    ],
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
    '/events/dropdown': {
        get: {
            tags: ['Events'],
            description: 'Get active events for dropdown selection',
            operationId: 'getActiveEventsDropdown',
            responses: {
                200: {
                    description: 'Active events dropdown retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Active events dropdown retrieved successfully',
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
                                                event_id: {
                                                    type: 'string',
                                                    example: 'EVT001',
                                                },
                                                event_name: {
                                                    type: 'string',
                                                    example: 'Annual Tennis Championship',
                                                },
                                                event_type: {
                                                    type: 'string',
                                                    example: 'Team',
                                                },
                                                event_start_date: {
                                                    type: 'string',
                                                    format: 'date',
                                                    example: '2024-02-15',
                                                },
                                                event_end_date: {
                                                    type: 'string',
                                                    format: 'date',
                                                    example: '2024-02-17',
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

    // Event Booking Management
    '/events/event-booking': {
        post: {
            tags: ['Events'],
            description: 'Create a new event booking',
            operationId: 'insertEventBooking',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'event_id',
                                'category_id',
                                'booking_form_data',
                                'category_data',
                                'amount_paid',
                            ],
                            properties: {
                                event_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Event ID to book',
                                },
                                member_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description:
                                        'Member ID (optional for non-member bookings)',
                                },
                                category_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Event category ID',
                                },
                                booking_form_data: {
                                    type: 'object',
                                    description: 'Booking form data',
                                    properties: {
                                        participant_name: {
                                            type: 'string',
                                            example: 'John Doe',
                                        },
                                        email: {
                                            type: 'string',
                                            example: 'john@example.com',
                                        },
                                        phone: { type: 'string', example: '9876543210' },
                                        emergency_contact: {
                                            type: 'string',
                                            example: 'Jane Doe',
                                        },
                                        emergency_phone: {
                                            type: 'string',
                                            example: '9876543211',
                                        },
                                        medical_conditions: {
                                            type: 'string',
                                            example: 'None',
                                        },
                                        t_shirt_size: { type: 'string', example: 'M' },
                                        special_requirements: {
                                            type: 'string',
                                            example: 'Vegetarian meals',
                                        },
                                    },
                                },
                                category_data: {
                                    type: 'object',
                                    description: 'Category information',
                                    properties: {
                                        category_name: {
                                            type: 'string',
                                            example: 'Men Singles',
                                        },
                                        member_fees: { type: 'number', example: 200 },
                                        non_member_fees: { type: 'number', example: 300 },
                                        age_group: { type: 'string', example: '18-35' },
                                        gender: { type: 'string', example: 'Male' },
                                    },
                                },
                                member_data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            member_id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            member_name: {
                                                type: 'string',
                                                example: 'John Doe',
                                            },
                                            email: {
                                                type: 'string',
                                                example: 'john@example.com',
                                            },
                                            phone: {
                                                type: 'string',
                                                example: '9876543210',
                                            },
                                        },
                                    },
                                    description: 'Team member data (for team events)',
                                },
                                non_member_data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'Jane Doe' },
                                            email: {
                                                type: 'string',
                                                example: 'jane@example.com',
                                            },
                                            phone: {
                                                type: 'string',
                                                example: '9876543211',
                                            },
                                            address: {
                                                type: 'string',
                                                example: '123 Main St',
                                            },
                                        },
                                    },
                                    description:
                                        'Non-member participant data (for team events)',
                                },
                                amount_paid: {
                                    type: 'number',
                                    example: 200,
                                    description: 'Amount paid for booking',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Event booking created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Event booking created successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            booking_id: {
                                                type: 'string',
                                                example: 'EBK001',
                                            },
                                            event_id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            member_id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            category_id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            total_amount: {
                                                type: 'number',
                                                example: 200,
                                            },
                                            status: {
                                                type: 'string',
                                                example: 'confirmed',
                                            },
                                            createdAt: {
                                                type: 'string',
                                                format: 'date-time',
                                                example: '2024-01-15T10:30:00Z',
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
            tags: ['Events'],
            description: 'Update event booking details',
            operationId: 'updateEventBooking',
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
                                    description: 'Booking MongoDB ID',
                                },
                                event_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Event ID',
                                },
                                member_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Member ID',
                                },
                                category_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Event category ID',
                                },
                                booking_form_data: {
                                    type: 'object',
                                    description: 'Updated booking form data',
                                    properties: {
                                        participant_name: {
                                            type: 'string',
                                            example: 'John Doe Updated',
                                        },
                                        email: {
                                            type: 'string',
                                            example: 'john.updated@example.com',
                                        },
                                        phone: { type: 'string', example: '9876543210' },
                                        emergency_contact: {
                                            type: 'string',
                                            example: 'Jane Doe Updated',
                                        },
                                        emergency_phone: {
                                            type: 'string',
                                            example: '9876543211',
                                        },
                                        medical_conditions: {
                                            type: 'string',
                                            example: 'None',
                                        },
                                        t_shirt_size: { type: 'string', example: 'L' },
                                        special_requirements: {
                                            type: 'string',
                                            example: 'Vegetarian meals',
                                        },
                                    },
                                },
                                category_data: {
                                    type: 'object',
                                    description: 'Updated category information',
                                    properties: {
                                        category_name: {
                                            type: 'string',
                                            example: 'Men Singles',
                                        },
                                        member_fees: { type: 'number', example: 250 },
                                        non_member_fees: { type: 'number', example: 350 },
                                        age_group: { type: 'string', example: '18-35' },
                                        gender: { type: 'string', example: 'Male' },
                                    },
                                },
                                member_data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            member_id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            member_name: {
                                                type: 'string',
                                                example: 'John Doe Updated',
                                            },
                                            email: {
                                                type: 'string',
                                                example: 'john.updated@example.com',
                                            },
                                            phone: {
                                                type: 'string',
                                                example: '9876543210',
                                            },
                                        },
                                    },
                                    description: 'Updated team member data',
                                },
                                non_member_data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            name: {
                                                type: 'string',
                                                example: 'Jane Doe Updated',
                                            },
                                            email: {
                                                type: 'string',
                                                example: 'jane.updated@example.com',
                                            },
                                            phone: {
                                                type: 'string',
                                                example: '9876543211',
                                            },
                                            address: {
                                                type: 'string',
                                                example: '123 Updated Main St',
                                            },
                                        },
                                    },
                                    description: 'Updated non-member participant data',
                                },
                                amount_paid: {
                                    type: 'number',
                                    example: 250,
                                    description: 'Updated amount paid for booking',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Event booking updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Event booking updated successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
            },
        },
        patch: {
            tags: ['Events'],
            description: 'Update event booking status',
            operationId: 'updateEventsBookingStatus',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['booking_id', 'status'],
                            properties: {
                                booking_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Booking ID',
                                },
                                status: {
                                    type: 'string',
                                    example: 'confirmed',
                                    description: 'New booking status',
                                    enum: [
                                        'pending',
                                        'confirmed',
                                        'cancelled',
                                        'completed',
                                    ],
                                },
                                remarks: {
                                    type: 'string',
                                    example: 'Status updated by admin',
                                    description: 'Status update remarks',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Event booking status updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Event booking status updated successfully',
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
    '/events/event-booking/list': {
        get: {
            tags: ['Events'],
            description: 'Get paginated list of event bookings with filtering',
            operationId: 'getEventsBookingList',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'pageNo',
                    in: 'query',
                    schema: { type: 'string', default: '0' },
                    description: 'Page number for pagination',
                    example: '0',
                },
                {
                    name: 'limit',
                    in: 'query',
                    schema: { type: 'string', default: '10' },
                    description: 'Number of records per page',
                    example: '10',
                },
                {
                    name: 'sortBy',
                    in: 'query',
                    schema: { type: 'string', default: '-1' },
                    description: 'Sort order (-1 for descending, 1 for ascending)',
                    example: '-1',
                },
                {
                    name: 'sortField',
                    in: 'query',
                    schema: { type: 'string', default: 'createdAt' },
                    description: 'Field to sort by',
                    example: 'createdAt',
                },
                {
                    name: 'keywords',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Search keywords for participant name or event name',
                    example: 'tennis',
                },
                {
                    name: 'active',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by active status',
                    example: 'true',
                    enum: ['true', 'false'],
                },
                {
                    name: 'event_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by event ID',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Event bookings list retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Event bookings retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            bookings: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439011',
                                                        },
                                                        booking_id: {
                                                            type: 'string',
                                                            example: 'EBK001',
                                                        },
                                                        event_name: {
                                                            type: 'string',
                                                            example:
                                                                'Annual Tennis Championship',
                                                        },
                                                        category_name: {
                                                            type: 'string',
                                                            example: 'Men Singles',
                                                        },
                                                        participant_name: {
                                                            type: 'string',
                                                            example: 'John Doe',
                                                        },
                                                        participant_email: {
                                                            type: 'string',
                                                            example: 'john@example.com',
                                                        },
                                                        participant_phone: {
                                                            type: 'string',
                                                            example: '9876543210',
                                                        },
                                                        total_amount: {
                                                            type: 'number',
                                                            example: 200,
                                                        },
                                                        status: {
                                                            type: 'string',
                                                            example: 'confirmed',
                                                        },
                                                        event_start_date: {
                                                            type: 'string',
                                                            format: 'date',
                                                            example: '2024-02-15',
                                                        },
                                                        createdAt: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                            example:
                                                                '2024-01-15T10:30:00Z',
                                                        },
                                                    },
                                                },
                                            },
                                            pagination: {
                                                type: 'object',
                                                properties: {
                                                    totalCount: {
                                                        type: 'number',
                                                        example: 100,
                                                    },
                                                    pageNo: {
                                                        type: 'number',
                                                        example: 0,
                                                    },
                                                    limit: {
                                                        type: 'number',
                                                        example: 10,
                                                    },
                                                    totalPages: {
                                                        type: 'number',
                                                        example: 10,
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
    '/events/guest-event-booking': {
        get: {
            tags: ['Events'],
            description: 'Get guest event booking details by order ID',
            operationId: 'getGuestEvents',
            parameters: [
                {
                    name: 'order_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Order ID to retrieve booking details',
                    example: 'ORD1234567890123',
                },
            ],
            responses: {
                200: {
                    description: 'Guest event booking retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Guest event booking retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            booking_id: {
                                                type: 'string',
                                                example: 'EBK001',
                                            },
                                            order_id: {
                                                type: 'string',
                                                example: 'ORD1234567890123',
                                            },
                                            event_name: {
                                                type: 'string',
                                                example: 'Annual Tennis Championship',
                                            },
                                            category_name: {
                                                type: 'string',
                                                example: 'Men Singles',
                                            },
                                            participant_name: {
                                                type: 'string',
                                                example: 'John Doe',
                                            },
                                            participant_email: {
                                                type: 'string',
                                                example: 'john@example.com',
                                            },
                                            participant_phone: {
                                                type: 'string',
                                                example: '9876543210',
                                            },
                                            total_amount: {
                                                type: 'number',
                                                example: 200,
                                            },
                                            status: {
                                                type: 'string',
                                                example: 'confirmed',
                                            },
                                            booking_form_data: { type: 'object' },
                                            category_data: { type: 'object' },
                                            event_details: { type: 'object' },
                                            createdAt: {
                                                type: 'string',
                                                format: 'date-time',
                                                example: '2024-01-15T10:30:00Z',
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
