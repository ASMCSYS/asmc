export const hallsSwagger = {
    // Hall Management
    '/halls': {
        get: {
            tags: ['Halls'],
            description: 'Get single hall details by ID or hall_id',
            operationId: 'getSingleHalls',
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Hall MongoDB ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'hall_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Hall unique identifier',
                    example: 'HALL001',
                },
            ],
            responses: {
                200: {
                    description: 'Hall details retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Hall retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            hall_id: {
                                                type: 'string',
                                                example: 'HALL001',
                                            },
                                            name: {
                                                type: 'string',
                                                example: 'Main Conference Hall',
                                            },
                                            description: {
                                                type: 'string',
                                                example:
                                                    'Spacious conference hall for events',
                                            },
                                            text_content: {
                                                type: 'string',
                                                example: 'Additional hall information',
                                            },
                                            terms: {
                                                type: 'string',
                                                example:
                                                    'Hall booking terms and conditions',
                                            },
                                            images: {
                                                type: 'array',
                                                items: { type: 'string' },
                                                example: [
                                                    'https://imagekit.io/hall1.jpg',
                                                ],
                                            },
                                            additional_charges: {
                                                type: 'string',
                                                example: '1000',
                                            },
                                            advance_booking_period: {
                                                type: 'string',
                                                example: '30',
                                            },
                                            advance_payment_amount: {
                                                type: 'string',
                                                example: '5000',
                                            },
                                            booking_amount: {
                                                type: 'string',
                                                example: '10000',
                                            },
                                            cleaning_charges: {
                                                type: 'string',
                                                example: '500',
                                            },
                                            other_charges: {
                                                type: 'string',
                                                example: '200',
                                            },
                                            refundable_deposit: {
                                                type: 'string',
                                                example: '2000',
                                            },
                                            time_slots: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        start_time: {
                                                            type: 'string',
                                                            example: '09:00',
                                                        },
                                                        end_time: {
                                                            type: 'string',
                                                            example: '12:00',
                                                        },
                                                        price: {
                                                            type: 'string',
                                                            example: '5000',
                                                        },
                                                    },
                                                },
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
            tags: ['Halls'],
            description: 'Create a new hall',
            operationId: 'insertHalls',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'name',
                                'description',
                                'additional_charges',
                                'advance_booking_period',
                                'advance_payment_amount',
                                'booking_amount',
                                'cleaning_charges',
                                'refundable_deposit',
                                'time_slots',
                            ],
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'Main Conference Hall',
                                    description: 'Hall name',
                                },
                                description: {
                                    type: 'string',
                                    example: 'Spacious conference hall for events',
                                    description: 'Hall description',
                                },
                                text_content: {
                                    type: 'string',
                                    example: 'Additional hall information',
                                    description: 'Additional text content',
                                },
                                terms: {
                                    type: 'string',
                                    example: 'Hall booking terms and conditions',
                                    description: 'Booking terms and conditions',
                                },
                                images: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['https://imagekit.io/hall1.jpg'],
                                    description: 'Hall images URLs',
                                },
                                additional_charges: {
                                    type: 'string',
                                    example: '1000',
                                    description: 'Additional charges amount',
                                },
                                advance_booking_period: {
                                    type: 'string',
                                    example: '30',
                                    description: 'Advance booking period in days',
                                },
                                advance_payment_amount: {
                                    type: 'string',
                                    example: '5000',
                                    description: 'Advance payment amount',
                                },
                                booking_amount: {
                                    type: 'string',
                                    example: '10000',
                                    description: 'Total booking amount',
                                },
                                cleaning_charges: {
                                    type: 'string',
                                    example: '500',
                                    description: 'Cleaning charges amount',
                                },
                                other_charges: {
                                    type: 'string',
                                    example: '200',
                                    description: 'Other charges amount',
                                },
                                refundable_deposit: {
                                    type: 'string',
                                    example: '2000',
                                    description: 'Refundable deposit amount',
                                },
                                time_slots: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            start_time: {
                                                type: 'string',
                                                example: '09:00',
                                            },
                                            end_time: {
                                                type: 'string',
                                                example: '12:00',
                                            },
                                            price: { type: 'string', example: '5000' },
                                        },
                                    },
                                    description: 'Available time slots',
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
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Hall status',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Hall created successfully',
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
            tags: ['Halls'],
            description: 'Update hall details',
            operationId: 'editHalls',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                '_id',
                                'name',
                                'description',
                                'additional_charges',
                                'advance_booking_period',
                                'advance_payment_amount',
                                'booking_amount',
                                'cleaning_charges',
                                'refundable_deposit',
                                'time_slots',
                            ],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Hall MongoDB ID',
                                },
                                name: {
                                    type: 'string',
                                    example: 'Updated Conference Hall',
                                    description: 'Hall name',
                                },
                                description: {
                                    type: 'string',
                                    example:
                                        'Updated spacious conference hall for events',
                                    description: 'Hall description',
                                },
                                text_content: {
                                    type: 'string',
                                    example: 'Updated additional hall information',
                                    description: 'Additional text content',
                                },
                                terms: {
                                    type: 'string',
                                    example: 'Updated hall booking terms and conditions',
                                    description: 'Booking terms and conditions',
                                },
                                images: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['https://imagekit.io/hall1_updated.jpg'],
                                    description: 'Hall images URLs',
                                },
                                additional_charges: {
                                    type: 'string',
                                    example: '1200',
                                    description: 'Additional charges amount',
                                },
                                advance_booking_period: {
                                    type: 'string',
                                    example: '30',
                                    description: 'Advance booking period in days',
                                },
                                advance_payment_amount: {
                                    type: 'string',
                                    example: '6000',
                                    description: 'Advance payment amount',
                                },
                                booking_amount: {
                                    type: 'string',
                                    example: '12000',
                                    description: 'Total booking amount',
                                },
                                cleaning_charges: {
                                    type: 'string',
                                    example: '600',
                                    description: 'Cleaning charges amount',
                                },
                                other_charges: {
                                    type: 'string',
                                    example: '300',
                                    description: 'Other charges amount',
                                },
                                refundable_deposit: {
                                    type: 'string',
                                    example: '2500',
                                    description: 'Refundable deposit amount',
                                },
                                time_slots: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            start_time: {
                                                type: 'string',
                                                example: '09:00',
                                            },
                                            end_time: {
                                                type: 'string',
                                                example: '12:00',
                                            },
                                            price: { type: 'string', example: '6000' },
                                        },
                                    },
                                    description: 'Available time slots',
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
                                    example: 'Court B',
                                    description: 'Court information',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Hall updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Hall updated successfully',
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
            tags: ['Halls'],
            description: 'Delete a hall',
            operationId: 'removeHalls',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Hall MongoDB ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'hall_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Hall unique identifier',
                    example: 'HALL001',
                },
            ],
            responses: {
                200: {
                    description: 'Hall deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Hall deleted successfully',
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
    '/halls/list': {
        get: {
            tags: ['Halls'],
            description: 'Get paginated list of halls with filtering and search',
            operationId: 'getHallsList',
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
                    description: 'Search keywords for hall name or description',
                    example: 'conference',
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
                    name: 'facility_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by facility ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'hall_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by hall ID',
                    example: 'HALL001',
                },
            ],
            responses: {
                200: {
                    description: 'Halls list retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Halls retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            halls: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439011',
                                                        },
                                                        hall_id: {
                                                            type: 'string',
                                                            example: 'HALL001',
                                                        },
                                                        name: {
                                                            type: 'string',
                                                            example:
                                                                'Main Conference Hall',
                                                        },
                                                        description: {
                                                            type: 'string',
                                                            example:
                                                                'Spacious conference hall for events',
                                                        },
                                                        booking_amount: {
                                                            type: 'string',
                                                            example: '10000',
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
    '/halls/active': {
        get: {
            tags: ['Halls'],
            description: 'Get list of active halls (public endpoint)',
            operationId: 'getActiveHallsList',
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
                    description: 'Search keywords for hall name or description',
                    example: 'conference',
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
                    name: 'facility_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by facility ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'hall_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by hall ID',
                    example: 'HALL001',
                },
            ],
            responses: {
                200: {
                    description: 'Active halls retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Active halls retrieved successfully',
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
                                                hall_id: {
                                                    type: 'string',
                                                    example: 'HALL001',
                                                },
                                                name: {
                                                    type: 'string',
                                                    example: 'Main Conference Hall',
                                                },
                                                description: {
                                                    type: 'string',
                                                    example:
                                                        'Spacious conference hall for events',
                                                },
                                                booking_amount: {
                                                    type: 'string',
                                                    example: '10000',
                                                },
                                                time_slots: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            start_time: {
                                                                type: 'string',
                                                                example: '09:00',
                                                            },
                                                            end_time: {
                                                                type: 'string',
                                                                example: '12:00',
                                                            },
                                                            price: {
                                                                type: 'string',
                                                                example: '5000',
                                                            },
                                                        },
                                                    },
                                                },
                                                images: {
                                                    type: 'array',
                                                    items: { type: 'string' },
                                                    example: [
                                                        'https://imagekit.io/hall1.jpg',
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

    // Hall Booking Management
    '/halls/hall-booking': {
        post: {
            tags: ['Halls'],
            description: 'Create a new hall booking',
            operationId: 'insertHallBooking',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'hall_id',
                                'slot_from',
                                'slot_to',
                                'booking_date',
                                'is_full_payment',
                                'purpose',
                            ],
                            properties: {
                                hall_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Hall ID to book',
                                },
                                member_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description:
                                        'Member ID (optional for non-member bookings)',
                                },
                                slot_from: {
                                    type: 'string',
                                    example: '09:00',
                                    description: 'Booking start time',
                                },
                                slot_to: {
                                    type: 'string',
                                    example: '12:00',
                                    description: 'Booking end time',
                                },
                                booking_date: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-01-20',
                                    description: 'Booking date',
                                },
                                is_full_payment: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Whether full payment is made',
                                },
                                purpose: {
                                    type: 'string',
                                    example: 'Corporate meeting and presentation',
                                    description: 'Purpose of hall booking',
                                    minLength: 1,
                                    maxLength: 1000,
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Hall booking created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Hall booking created successfully',
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
                                                example: 'HBK001',
                                            },
                                            hall_id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            member_id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            slot_from: {
                                                type: 'string',
                                                example: '09:00',
                                            },
                                            slot_to: { type: 'string', example: '12:00' },
                                            booking_date: {
                                                type: 'string',
                                                format: 'date',
                                                example: '2024-01-20',
                                            },
                                            total_amount: {
                                                type: 'number',
                                                example: 10000,
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
            tags: ['Halls'],
            description: 'Update hall booking details',
            operationId: 'updateHallBooking',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id', 'hall_id'],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Booking MongoDB ID',
                                },
                                hall_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Hall ID',
                                },
                                member_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Member ID',
                                },
                                slot: {
                                    type: 'string',
                                    example: '09:00-12:00',
                                    description: 'Updated time slot',
                                },
                                booking_date: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-01-21',
                                    description: 'Updated booking date',
                                },
                                is_full_payment: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Whether full payment is made',
                                },
                                purpose: {
                                    type: 'string',
                                    example: 'Updated corporate meeting and presentation',
                                    description: 'Updated purpose of hall booking',
                                    minLength: 1,
                                    maxLength: 1000,
                                },
                                status: {
                                    type: 'string',
                                    example: 'confirmed',
                                    description: 'Booking status',
                                    enum: [
                                        'pending',
                                        'confirmed',
                                        'cancelled',
                                        'completed',
                                    ],
                                },
                                is_cancelled: {
                                    type: 'boolean',
                                    example: false,
                                    description: 'Whether booking is cancelled',
                                },
                                cancellation_reason: {
                                    type: 'string',
                                    example: 'Event postponed',
                                    description: 'Cancellation reason',
                                },
                                cancellation_date: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2024-01-16T10:30:00Z',
                                    description: 'Cancellation date',
                                },
                                cancellation_charges: {
                                    type: 'string',
                                    example: '1000',
                                    description: 'Cancellation charges',
                                },
                                is_refunded: {
                                    type: 'boolean',
                                    example: false,
                                    description: 'Whether refund is processed',
                                },
                                refund_amount: {
                                    type: 'string',
                                    example: '9000',
                                    description: 'Refund amount',
                                },
                                refund_remarks: {
                                    type: 'string',
                                    example: 'Refund processed for cancelled booking',
                                    description: 'Refund remarks',
                                },
                                refunded_at: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2024-01-17T10:30:00Z',
                                    description: 'Refund date',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Hall booking updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Hall booking updated successfully',
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
            tags: ['Halls'],
            description: 'Update hall booking status',
            operationId: 'updateHallsBookingStatus',
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
                    description: 'Hall booking status updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Hall booking status updated successfully',
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
    '/halls/hall-booking/list': {
        get: {
            tags: ['Halls'],
            description: 'Get paginated list of hall bookings with filtering',
            operationId: 'getHallsBookingList',
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
                    description: 'Search keywords for member name or purpose',
                    example: 'corporate',
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
                    name: 'hall_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by hall ID',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Hall bookings list retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Hall bookings retrieved successfully',
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
                                                            example: 'HBK001',
                                                        },
                                                        hall_name: {
                                                            type: 'string',
                                                            example:
                                                                'Main Conference Hall',
                                                        },
                                                        member_name: {
                                                            type: 'string',
                                                            example: 'John Doe',
                                                        },
                                                        member_email: {
                                                            type: 'string',
                                                            example: 'john@example.com',
                                                        },
                                                        slot_from: {
                                                            type: 'string',
                                                            example: '09:00',
                                                        },
                                                        slot_to: {
                                                            type: 'string',
                                                            example: '12:00',
                                                        },
                                                        booking_date: {
                                                            type: 'string',
                                                            format: 'date',
                                                            example: '2024-01-20',
                                                        },
                                                        total_amount: {
                                                            type: 'number',
                                                            example: 10000,
                                                        },
                                                        status: {
                                                            type: 'string',
                                                            example: 'confirmed',
                                                        },
                                                        purpose: {
                                                            type: 'string',
                                                            example: 'Corporate meeting',
                                                        },
                                                        is_full_payment: {
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
    '/halls/get-booked-halls-dates': {
        get: {
            tags: ['Halls'],
            description: 'Get dates when halls are booked',
            operationId: 'getHallsBookedDates',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'hall_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by specific hall ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'start_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'Start date for date range',
                    example: '2024-01-01',
                },
                {
                    name: 'end_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'End date for date range',
                    example: '2024-01-31',
                },
            ],
            responses: {
                200: {
                    description: 'Booked hall dates retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Booked hall dates retrieved successfully',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                date: {
                                                    type: 'string',
                                                    format: 'date',
                                                    example: '2024-01-20',
                                                },
                                                hall_id: {
                                                    type: 'string',
                                                    example: '507f1f77bcf86cd799439011',
                                                },
                                                hall_name: {
                                                    type: 'string',
                                                    example: 'Main Conference Hall',
                                                },
                                                booked_slots: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            slot_from: {
                                                                type: 'string',
                                                                example: '09:00',
                                                            },
                                                            slot_to: {
                                                                type: 'string',
                                                                example: '12:00',
                                                            },
                                                            booking_id: {
                                                                type: 'string',
                                                                example: 'HBK001',
                                                            },
                                                            member_name: {
                                                                type: 'string',
                                                                example: 'John Doe',
                                                            },
                                                            status: {
                                                                type: 'string',
                                                                example: 'confirmed',
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
        },
    },
};
