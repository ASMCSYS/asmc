export const auth = {
    '/auth/admin-login': {
        post: {
            tags: ['Auth'],
            description: 'Admin/Staff login authentication',
            operationId: 'adminLogin',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email', 'password'],
                            properties: {
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'admin@asmcdae.in',
                                    description: 'Admin or staff email address',
                                },
                                password: {
                                    type: 'string',
                                    example: 'admin123',
                                    description:
                                        'User password (will be hashed with SHA256)',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Login successful',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Authentication Success',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            token: {
                                                type: 'string',
                                                example:
                                                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                                                description: 'JWT authentication token',
                                            },
                                            user: {
                                                type: 'object',
                                                properties: {
                                                    _id: {
                                                        type: 'string',
                                                        example:
                                                            '507f1f77bcf86cd799439011',
                                                    },
                                                    email: {
                                                        type: 'string',
                                                        example: 'admin@asmcdae.in',
                                                    },
                                                    name: {
                                                        type: 'string',
                                                        example: 'Admin User',
                                                    },
                                                    roles: {
                                                        type: 'string',
                                                        enum: ['admin', 'super', 'staff'],
                                                        example: 'admin',
                                                    },
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
                    },
                },
                401: {
                    description: 'Authentication failed',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Email is incorrect! Or you are not registered.',
                                        enum: [
                                            'Email is incorrect! Or you are not registered.',
                                            'Password is incorrect!',
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: 'Account not active',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example:
                                            'You are not an active user, please connect with our team for activation process.',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/auth/member-login': {
        post: {
            tags: ['Auth'],
            description: 'Member login authentication',
            operationId: 'memberLogin',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email', 'password'],
                            properties: {
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'member@example.com',
                                    description: 'Member email address',
                                },
                                password: {
                                    type: 'string',
                                    example: 'member123',
                                    description:
                                        'Member password (will be hashed with SHA256)',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Member login successful',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Authentication Success',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            token: {
                                                type: 'string',
                                                example:
                                                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                                                description: 'JWT authentication token',
                                            },
                                            user: {
                                                type: 'object',
                                                properties: {
                                                    _id: {
                                                        type: 'string',
                                                        example:
                                                            '507f1f77bcf86cd799439011',
                                                    },
                                                    member_id: {
                                                        type: 'string',
                                                        example: '00001',
                                                    },
                                                    email: {
                                                        type: 'string',
                                                        example: 'member@example.com',
                                                    },
                                                    name: {
                                                        type: 'string',
                                                        example: 'John Doe',
                                                    },
                                                    mobile: {
                                                        type: 'string',
                                                        example: '9876543210',
                                                    },
                                                    profile: {
                                                        type: 'string',
                                                        example:
                                                            'https://api.asmcdae.in/public/profile.jpg',
                                                    },
                                                    roles: {
                                                        type: 'string',
                                                        example: 'member',
                                                    },
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
                    },
                },
                401: {
                    description: 'Authentication failed',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Email is incorrect! Or you are not registered.',
                                        enum: [
                                            'Email is incorrect! Or you are not registered.',
                                            'Password is incorrect!',
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: 'Account not active',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example:
                                            'You are not an active user, please connect with our team for activation process.',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/auth/staff-login': {
        post: {
            tags: ['Auth'],
            description: 'Staff login authentication',
            operationId: 'staffLogin',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email', 'password'],
                            properties: {
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'staff@asmcdae.in',
                                    description: 'Staff email address',
                                },
                                password: {
                                    type: 'string',
                                    example: 'staff123',
                                    description:
                                        'Staff password (will be hashed with SHA256)',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Staff login successful',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Authentication Success',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            token: {
                                                type: 'string',
                                                example:
                                                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                                                description: 'JWT authentication token',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Authentication failed',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Email is incorrect! Or you are not registered.',
                                        enum: [
                                            'Email is incorrect! Or you are not registered.',
                                            'Password is incorrect!',
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: 'Account not active',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example:
                                            'You are not an active user, please connect with our team for activation process.',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/auth/admin-me': {
        get: {
            tags: ['Auth'],
            description: 'Get current admin/staff user profile and permissions',
            operationId: 'getAuthAdmin',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Admin profile retrieved successfully',
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
                                            user: {
                                                type: 'object',
                                                properties: {
                                                    _id: {
                                                        type: 'string',
                                                        example:
                                                            '507f1f77bcf86cd799439011',
                                                    },
                                                    email: {
                                                        type: 'string',
                                                        example: 'admin@asmcdae.in',
                                                    },
                                                    name: {
                                                        type: 'string',
                                                        example: 'Admin User',
                                                    },
                                                    roles: {
                                                        type: 'string',
                                                        enum: ['admin', 'super', 'staff'],
                                                        example: 'admin',
                                                    },
                                                    permissions: {
                                                        type: 'array',
                                                        items: { type: 'string' },
                                                    },
                                                    staff_data: {
                                                        type: 'object',
                                                        description:
                                                            'Staff data if user role is staff',
                                                    },
                                                    member_data: {
                                                        type: 'object',
                                                        description:
                                                            'Member data if user role is member',
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
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Internal Server Error',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/auth/me': {
        get: {
            tags: ['Auth'],
            description: 'Get current member profile information',
            operationId: 'getAuthMember',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Member profile retrieved successfully',
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
                                            member_id: {
                                                type: 'string',
                                                example: '00001',
                                            },
                                            name: { type: 'string', example: 'John Doe' },
                                            email: {
                                                type: 'string',
                                                example: 'member@example.com',
                                            },
                                            mobile: {
                                                type: 'string',
                                                example: '9876543210',
                                            },
                                            gender: { type: 'string', example: 'Male' },
                                            dob: {
                                                type: 'string',
                                                example: '1990-01-01',
                                            },
                                            address: {
                                                type: 'string',
                                                example: '123 Main St, City, State 12345',
                                            },
                                            chss_number: {
                                                type: 'string',
                                                example: 'CHSS123456',
                                            },
                                            chss_card_link: {
                                                type: 'string',
                                                example:
                                                    'https://example.com/chss-card.jpg',
                                            },
                                            family_details: {
                                                type: 'array',
                                                items: { type: 'object' },
                                                description: 'Family members details',
                                            },
                                            tshirt_size: { type: 'string', example: 'L' },
                                            clothing_type: {
                                                type: 'string',
                                                example: 'Sports Wear',
                                            },
                                            clothing_size: {
                                                type: 'string',
                                                example: 'M',
                                            },
                                            profile: {
                                                type: 'string',
                                                example:
                                                    'https://api.asmcdae.in/public/profile.jpg',
                                                description: 'Profile image URL',
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
    '/auth/change-password': {
        put: {
            tags: ['Auth'],
            description: 'Change user password',
            operationId: 'changePassword',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'old_password',
                                'new_password',
                                'confirm_password',
                            ],
                            properties: {
                                old_password: {
                                    type: 'string',
                                    example: 'oldpass123',
                                    description: 'Current password',
                                },
                                new_password: {
                                    type: 'string',
                                    example: 'newpass123',
                                    description: 'New password',
                                },
                                confirm_password: {
                                    type: 'string',
                                    example: 'newpass123',
                                    description: 'Confirm new password',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Password changed successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Password Changed Successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Password change failed',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Password does not match!',
                                        enum: [
                                            'Password does not match!',
                                            'Old password and new password cannot be same!',
                                            'Current password is incorrect!',
                                            'User not found!',
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
    '/auth/update-profile': {
        put: {
            tags: ['Auth'],
            description: 'Update user profile information',
            operationId: 'updateUserProfile',
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
                                    description: 'Full name of the user',
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'john.doe@example.com',
                                    description: 'Email address',
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
    '/auth/send-reset-password-otp': {
        post: {
            tags: ['Auth'],
            description: 'Send OTP for password reset',
            operationId: 'sendResetPasswordOtp',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email'],
                            properties: {
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'user@example.com',
                                    description: 'Email address to send OTP',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'OTP sent successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Otp Sent Successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Failed to send OTP',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Email is incorrect! Or you are not registered.',
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: 'Account not active',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example:
                                            'You are not an active user, please connect with our team for activation process.',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/auth/reset-password': {
        put: {
            tags: ['Auth'],
            description: 'Reset password using OTP',
            operationId: 'resetPassword',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'email',
                                'otp',
                                'new_password',
                                'confirm_password',
                            ],
                            properties: {
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'user@example.com',
                                    description: 'Email address',
                                },
                                otp: {
                                    type: 'string',
                                    example: '1234',
                                    description: 'OTP received via email',
                                },
                                new_password: {
                                    type: 'string',
                                    example: 'newpass123',
                                    description: 'New password',
                                },
                                confirm_password: {
                                    type: 'string',
                                    example: 'newpass123',
                                    description: 'Confirm new password',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Password reset successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Password Changed Successfully',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Password reset failed',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Password does not match!',
                                        enum: [
                                            'Password does not match!',
                                            'Email is incorrect! Or you are not registered.',
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: 'Account not active',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example:
                                            'You are not an active user, please connect with our team for activation process.',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/auth/user-list': {
        post: {
            tags: ['Auth'],
            description: 'Get paginated list of users with filtering and search',
            operationId: 'getUserList',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                pageNo: {
                                    type: 'string',
                                    example: '0',
                                    description: 'Page number for pagination',
                                },
                                limit: {
                                    type: 'string',
                                    example: '10',
                                    description: 'Number of records per page',
                                },
                                sortBy: {
                                    type: 'string',
                                    example: '-1',
                                    description:
                                        'Sort order (1 for ascending, -1 for descending)',
                                },
                                sortField: {
                                    type: 'string',
                                    example: 'createdAt',
                                    description: 'Field to sort by',
                                },
                                keywords: {
                                    type: 'string',
                                    example: 'john',
                                    description: 'Search keywords for name and email',
                                },
                                active: {
                                    type: 'string',
                                    example: 'true',
                                    description: 'Filter by active status (true/false)',
                                },
                                staff_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Filter by staff ID',
                                },
                                member_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Filter by member ID',
                                },
                                roles: {
                                    type: 'string',
                                    example: 'admin',
                                    enum: ['admin', 'super', 'staff', 'member'],
                                    description: 'Filter by user role',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Users list retrieved successfully',
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
                                                        email: {
                                                            type: 'string',
                                                            example: 'user@example.com',
                                                        },
                                                        name: {
                                                            type: 'string',
                                                            example: 'John Doe',
                                                        },
                                                        roles: {
                                                            type: 'string',
                                                            enum: [
                                                                'admin',
                                                                'super',
                                                                'staff',
                                                                'member',
                                                            ],
                                                            example: 'member',
                                                        },
                                                        status: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        member_data: {
                                                            type: 'object',
                                                            description:
                                                                'Member data if user is a member',
                                                        },
                                                        staff_data: {
                                                            type: 'object',
                                                            description:
                                                                'Staff data if user is staff',
                                                        },
                                                    },
                                                },
                                            },
                                            totalCount: { type: 'number', example: 150 },
                                            totalPages: { type: 'number', example: 15 },
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
