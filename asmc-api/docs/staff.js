export const staffSwagger = {
    '/staff': {
        post: {
            tags: ['Staff'],
            description: 'Create a new staff member',
            operationId: 'createStaff',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'name',
                                'designation',
                                'department',
                                'email',
                                'phone',
                                'permissions',
                            ],
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'John Doe',
                                    description: 'Full name of the staff member',
                                },
                                designation: {
                                    type: 'string',
                                    example: 'Manager',
                                    description: 'Job designation/title',
                                },
                                department: {
                                    type: 'string',
                                    example: 'Human Resources',
                                    description: 'Department name',
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'john.doe@asmcdae.in',
                                    description: 'Email address',
                                },
                                phone: {
                                    type: 'string',
                                    example: '9876543210',
                                    description: 'Phone number',
                                },
                                address: {
                                    type: 'string',
                                    example: '123 Main St, City, State 12345',
                                    description: 'Complete address',
                                },
                                joiningDate: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-01-01',
                                    description: 'Date of joining',
                                },
                                reportingTo: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Manager ID (ObjectId)',
                                },
                                team: {
                                    type: 'string',
                                    example: 'Development Team',
                                    description: 'Team name',
                                },
                                biometric: {
                                    type: 'object',
                                    description:
                                        'Biometric information for attendance system',
                                    properties: {
                                        thumbprint: {
                                            type: 'string',
                                            example: 'base64_encoded_thumbprint_data',
                                            description: 'Base64 encoded thumbprint data',
                                        },
                                        deviceId: {
                                            type: 'string',
                                            example: 'BIOMETRIC_DEVICE_001',
                                            description: 'Biometric device ID',
                                        },
                                        registeredAt: {
                                            type: 'string',
                                            format: 'date-time',
                                            example: '2024-01-01T10:00:00Z',
                                            description: 'Registration timestamp',
                                        },
                                    },
                                },
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Active status of the staff member',
                                },
                                smartOfficeId: {
                                    type: 'string',
                                    example: 'SO123456',
                                    description: 'Smart Office system ID',
                                },
                                permissions: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: [
                                        'staff:read',
                                        'staff:update',
                                        'members:read',
                                    ],
                                    description: 'Array of permission strings',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Staff created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Staff created successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            staff_id: {
                                                type: 'string',
                                                example: 'STF001',
                                            },
                                            name: { type: 'string', example: 'John Doe' },
                                            email: {
                                                type: 'string',
                                                example: 'john.doe@asmcdae.in',
                                            },
                                            designation: {
                                                type: 'string',
                                                example: 'Manager',
                                            },
                                            department: {
                                                type: 'string',
                                                example: 'Human Resources',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Bad request - validation error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Validation error',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        put: {
            tags: ['Staff'],
            description: 'Update staff member details',
            operationId: 'updateStaff',
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
                                    description: 'MongoDB ObjectId of the staff member',
                                },
                                name: {
                                    type: 'string',
                                    example: 'John Doe',
                                    description: 'Full name of the staff member',
                                },
                                designation: {
                                    type: 'string',
                                    example: 'Senior Manager',
                                    description: 'Job designation/title',
                                },
                                department: {
                                    type: 'string',
                                    example: 'Human Resources',
                                    description: 'Department name',
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'john.doe@asmcdae.in',
                                    description: 'Email address',
                                },
                                phone: {
                                    type: 'string',
                                    example: '9876543210',
                                    description: 'Phone number',
                                },
                                address: {
                                    type: 'string',
                                    example: '123 Main St, City, State 12345',
                                    description: 'Complete address',
                                },
                                joiningDate: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-01-01',
                                    description: 'Date of joining',
                                },
                                reportingTo: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Manager ID (ObjectId)',
                                },
                                team: {
                                    type: 'string',
                                    example: 'Development Team',
                                    description: 'Team name',
                                },
                                biometric: {
                                    type: 'object',
                                    description:
                                        'Biometric information for attendance system',
                                    properties: {
                                        thumbprint: {
                                            type: 'string',
                                            example: 'base64_encoded_thumbprint_data',
                                            description: 'Base64 encoded thumbprint data',
                                        },
                                        deviceId: {
                                            type: 'string',
                                            example: 'BIOMETRIC_DEVICE_001',
                                            description: 'Biometric device ID',
                                        },
                                        registeredAt: {
                                            type: 'string',
                                            format: 'date-time',
                                            example: '2024-01-01T10:00:00Z',
                                            description: 'Registration timestamp',
                                        },
                                    },
                                },
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Active status of the staff member',
                                },
                                smartOfficeId: {
                                    type: 'string',
                                    example: 'SO123456',
                                    description: 'Smart Office system ID',
                                },
                                permissions: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: [
                                        'staff:read',
                                        'staff:update',
                                        'members:read',
                                    ],
                                    description: 'Array of permission strings',
                                },
                                converted: {
                                    type: 'boolean',
                                    example: false,
                                    description: 'Whether staff is converted to user',
                                },
                                convertedAt: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2024-01-01T10:00:00Z',
                                    description: 'Conversion timestamp',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Staff updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Staff updated successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Bad request',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Missing staff ID',
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'Staff not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Staff not found',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        delete: {
            tags: ['Staff'],
            description: 'Delete a staff member',
            operationId: 'deleteStaff',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'MongoDB ObjectId of the staff member to delete',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Staff deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Staff deleted successfully',
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
    '/staff/list': {
        get: {
            tags: ['Staff'],
            description: 'Get paginated list of staff members with filtering and search',
            operationId: 'getStaffList',
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
                    description: 'Search keywords for name, email, staff_id',
                    example: 'john',
                },
                {
                    name: 'active',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by active status (true/false)',
                    example: 'true',
                },
            ],
            responses: {
                200: {
                    description: 'Staff list retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Staff records' },
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
                                                        staff_id: {
                                                            type: 'string',
                                                            example: 'STF001',
                                                        },
                                                        name: {
                                                            type: 'string',
                                                            example: 'John Doe',
                                                        },
                                                        email: {
                                                            type: 'string',
                                                            example:
                                                                'john.doe@asmcdae.in',
                                                        },
                                                        designation: {
                                                            type: 'string',
                                                            example: 'Manager',
                                                        },
                                                        department: {
                                                            type: 'string',
                                                            example: 'Human Resources',
                                                        },
                                                        phone: {
                                                            type: 'string',
                                                            example: '9876543210',
                                                        },
                                                        status: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        converted: {
                                                            type: 'boolean',
                                                            example: false,
                                                        },
                                                        permissions: {
                                                            type: 'array',
                                                            items: { type: 'string' },
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
    '/staff/{id}': {
        get: {
            tags: ['Staff'],
            description: 'Get single staff member details by ID',
            operationId: 'getSingleStaff',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'MongoDB ObjectId of the staff member',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Staff details retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Staff record' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            staff_id: {
                                                type: 'string',
                                                example: 'STF001',
                                            },
                                            name: { type: 'string', example: 'John Doe' },
                                            email: {
                                                type: 'string',
                                                example: 'john.doe@asmcdae.in',
                                            },
                                            designation: {
                                                type: 'string',
                                                example: 'Manager',
                                            },
                                            department: {
                                                type: 'string',
                                                example: 'Human Resources',
                                            },
                                            phone: {
                                                type: 'string',
                                                example: '9876543210',
                                            },
                                            address: {
                                                type: 'string',
                                                example: '123 Main St, City, State 12345',
                                            },
                                            joiningDate: {
                                                type: 'string',
                                                format: 'date',
                                                example: '2024-01-01',
                                            },
                                            reportingTo: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            team: {
                                                type: 'string',
                                                example: 'Development Team',
                                            },
                                            biometric: { type: 'object' },
                                            status: { type: 'boolean', example: true },
                                            smartOfficeId: {
                                                type: 'string',
                                                example: 'SO123456',
                                            },
                                            permissions: {
                                                type: 'array',
                                                items: { type: 'string' },
                                            },
                                            converted: {
                                                type: 'boolean',
                                                example: false,
                                            },
                                            convertedAt: {
                                                type: 'string',
                                                format: 'date-time',
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
    '/staff/convert-to-user': {
        post: {
            tags: ['Staff'],
            description:
                'Convert a staff member to a user account (enables login access)',
            operationId: 'convertStaffToUser',
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
                                    description:
                                        'MongoDB ObjectId of the staff member to convert',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Staff converted to user successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Staff converted to user successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            staff_id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            name: { type: 'string', example: 'John Doe' },
                                            email: {
                                                type: 'string',
                                                example: 'john.doe@asmcdae.in',
                                            },
                                            roles: { type: 'string', example: 'staff' },
                                            permissions: {
                                                type: 'array',
                                                items: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Conversion failed',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Staff already converted to user',
                                        enum: [
                                            'Staff already converted to user',
                                            'Failed to convert staff to user',
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'Staff not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Staff not found',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/staff/profile': {
        put: {
            tags: ['Staff'],
            description: 'Update staff member profile information (self-update)',
            operationId: 'updateStaffProfile',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['name', 'email'],
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'John Doe',
                                    description: 'Full name of the staff member',
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'john.doe@asmcdae.in',
                                    description: 'Email address',
                                },
                                phone: {
                                    type: 'string',
                                    example: '9876543210',
                                    description: 'Phone number',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Profile updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Profile updated successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: 'Access denied',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Access denied' },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'User not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'User not found',
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
