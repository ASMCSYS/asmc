export const membersSwagger = {
    '/members': {
        post: {
            tags: ['Members'],
            description: 'Create a new member',
            operationId: 'createMember',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['name'],
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'John Doe',
                                    description: 'Full name of the member',
                                },
                                email: {
                                    type: 'string',
                                    example: 'john.doe@example.com',
                                    format: 'email',
                                    description: 'Email address of the member',
                                },
                                gender: {
                                    type: 'string',
                                    example: 'Male',
                                    enum: ['Male', 'Female', 'Other'],
                                    description: 'Gender of the member',
                                },
                                mobile: {
                                    type: 'string',
                                    example: '9876543210',
                                    description: 'Primary mobile number',
                                },
                                alternate_mobile: {
                                    type: 'string',
                                    example: '9876543211',
                                    description: 'Alternate mobile number',
                                },
                                dob: {
                                    type: 'string',
                                    example: '1990-01-01',
                                    format: 'date',
                                    description: 'Date of birth',
                                },
                                chss_number: {
                                    type: 'string',
                                    example: 'CHSS123456',
                                    description: 'CHSS card number',
                                },
                                non_chss_number: {
                                    type: 'string',
                                    example: 'NON123456',
                                    description: 'Non-CHSS card number',
                                },
                                chss_card_link: {
                                    type: 'string',
                                    example: 'https://example.com/chss-card.jpg',
                                    description: 'Link to CHSS card image',
                                },
                                fees_paid: {
                                    type: 'boolean',
                                    example: false,
                                    description: 'Whether membership fees are paid',
                                },
                                fees_verified: {
                                    type: 'boolean',
                                    example: false,
                                    description: 'Whether fees payment is verified',
                                },
                                family_details: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'Jane Doe' },
                                            gender: { type: 'string', example: 'Female' },
                                            dob: {
                                                type: 'string',
                                                example: '1995-05-15',
                                            },
                                            mobile: {
                                                type: 'string',
                                                example: '9876543212',
                                            },
                                            email: {
                                                type: 'string',
                                                example: 'jane.doe@example.com',
                                            },
                                            profile: {
                                                type: 'string',
                                                example:
                                                    'https://example.com/jane-profile.jpg',
                                            },
                                            active: { type: 'boolean', example: true },
                                            fees_paid: {
                                                type: 'boolean',
                                                example: false,
                                            },
                                        },
                                    },
                                    description: 'Array of family members',
                                },
                                is_family_user: {
                                    type: 'boolean',
                                    example: false,
                                    description: 'Whether this is a family member',
                                },
                                current_plan: {
                                    type: 'object',
                                    properties: {
                                        plan_id: {
                                            type: 'string',
                                            example: '507f1f77bcf86cd799439011',
                                        },
                                        plan_name: {
                                            type: 'string',
                                            example: 'Annual Membership',
                                        },
                                        start_date: {
                                            type: 'string',
                                            example: '01/01/2024',
                                        },
                                        end_date: {
                                            type: 'string',
                                            example: '31/12/2024',
                                        },
                                    },
                                    description: 'Current membership plan details',
                                },
                                profile: {
                                    type: 'string',
                                    example: 'https://example.com/profile.jpg',
                                    description: 'Profile image URL',
                                },
                                address: {
                                    type: 'string',
                                    example: '123 Main St, City, State 12345',
                                    description: 'Complete address',
                                },
                                member_status: {
                                    type: 'string',
                                    example: 'Active',
                                    enum: ['Active', 'Inactive', 'Suspended'],
                                    description: 'Current membership status',
                                },
                                member_post: {
                                    type: 'string',
                                    example: 'President',
                                    description: 'Position/role in the organization',
                                },
                                role_activity_name: {
                                    type: 'string',
                                    example: 'Cricket Captain',
                                    description: 'Role in specific activities',
                                },
                                tshirt_size: {
                                    type: 'string',
                                    example: 'L',
                                    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                                    description: 'T-shirt size',
                                },
                                clothing_type: {
                                    type: 'string',
                                    example: 'Sports Wear',
                                    description: 'Type of clothing',
                                },
                                clothing_size: {
                                    type: 'string',
                                    example: 'M',
                                    description: 'Clothing size',
                                },
                                tshirt_name: {
                                    type: 'string',
                                    example: 'ASMC Sports Club',
                                    description: 'T-shirt brand/name',
                                },
                                instruction: {
                                    type: 'string',
                                    example: 'Special instructions for the member',
                                    description: 'Any special instructions',
                                },
                                no_of_card_issued: {
                                    type: 'string',
                                    example: '2',
                                    description: 'Number of cards issued',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Member created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Member Created Successfully',
                                    },
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
                                                example: 'john.doe@example.com',
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
                                        example: 'Email already exists!',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        get: {
            tags: ['Members'],
            description: 'Get single member details by ID',
            operationId: 'getSingleMember',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'MongoDB ObjectId of the member',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Member details retrieved successfully',
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
                                                example: 'john.doe@example.com',
                                            },
                                            mobile: {
                                                type: 'string',
                                                example: '9876543210',
                                            },
                                            family_details: {
                                                type: 'array',
                                                items: { type: 'object' },
                                            },
                                            current_plan: { type: 'object' },
                                            payment_history: {
                                                type: 'array',
                                                items: { type: 'object' },
                                            },
                                            bookings: {
                                                type: 'array',
                                                items: { type: 'object' },
                                            },
                                            events: {
                                                type: 'array',
                                                items: { type: 'object' },
                                            },
                                            halls: {
                                                type: 'array',
                                                items: { type: 'object' },
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
            tags: ['Members'],
            description: 'Update member details',
            operationId: 'updateMember',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id', 'name', 'email', 'gender'],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description:
                                        'MongoDB ObjectId of the member to update',
                                },
                                name: {
                                    type: 'string',
                                    example: 'John Doe',
                                    description: 'Full name of the member',
                                },
                                email: {
                                    type: 'string',
                                    example: 'john.doe@example.com',
                                    format: 'email',
                                    description: 'Email address of the member',
                                },
                                gender: {
                                    type: 'string',
                                    example: 'Male',
                                    enum: ['Male', 'Female', 'Other'],
                                    description: 'Gender of the member',
                                },
                                mobile: {
                                    type: 'string',
                                    example: '9876543210',
                                    description: 'Primary mobile number',
                                },
                                alternate_mobile: {
                                    type: 'string',
                                    example: '9876543211',
                                    description: 'Alternate mobile number',
                                },
                                dob: {
                                    type: 'string',
                                    example: '1990-01-01',
                                    format: 'date',
                                    description: 'Date of birth',
                                },
                                chss_number: {
                                    type: 'string',
                                    example: 'CHSS123456',
                                    description: 'CHSS card number',
                                },
                                non_chss_number: {
                                    type: 'string',
                                    example: 'NON123456',
                                    description: 'Non-CHSS card number',
                                },
                                chss_card_link: {
                                    type: 'string',
                                    example: 'https://example.com/chss-card.jpg',
                                    description: 'Link to CHSS card image',
                                },
                                fees_paid: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Whether membership fees are paid',
                                },
                                fees_verified: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Whether fees payment is verified',
                                },
                                family_details: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string', example: 'Jane Doe' },
                                            gender: { type: 'string', example: 'Female' },
                                            dob: {
                                                type: 'string',
                                                example: '1995-05-15',
                                            },
                                            mobile: {
                                                type: 'string',
                                                example: '9876543212',
                                            },
                                            email: {
                                                type: 'string',
                                                example: 'jane.doe@example.com',
                                            },
                                            profile: {
                                                type: 'string',
                                                example:
                                                    'https://example.com/jane-profile.jpg',
                                            },
                                            active: { type: 'boolean', example: true },
                                            fees_paid: { type: 'boolean', example: true },
                                        },
                                    },
                                    description: 'Array of family members',
                                },
                                is_family_user: {
                                    type: 'boolean',
                                    example: false,
                                    description: 'Whether this is a family member',
                                },
                                current_plan: {
                                    type: 'object',
                                    properties: {
                                        plan_id: {
                                            type: 'string',
                                            example: '507f1f77bcf86cd799439011',
                                        },
                                        plan_name: {
                                            type: 'string',
                                            example: 'Annual Membership',
                                        },
                                        start_date: {
                                            type: 'string',
                                            example: '01/01/2024',
                                        },
                                        end_date: {
                                            type: 'string',
                                            example: '31/12/2024',
                                        },
                                    },
                                    description: 'Current membership plan details',
                                },
                                profile: {
                                    type: 'string',
                                    example: 'https://example.com/profile.jpg',
                                    description: 'Profile image URL',
                                },
                                address: {
                                    type: 'string',
                                    example: '123 Main St, City, State 12345',
                                    description: 'Complete address',
                                },
                                member_status: {
                                    type: 'string',
                                    example: 'Active',
                                    enum: ['Active', 'Inactive', 'Suspended'],
                                    description: 'Current membership status',
                                },
                                member_post: {
                                    type: 'string',
                                    example: 'President',
                                    description: 'Position/role in the organization',
                                },
                                role_activity_name: {
                                    type: 'string',
                                    example: 'Cricket Captain',
                                    description: 'Role in specific activities',
                                },
                                tshirt_size: {
                                    type: 'string',
                                    example: 'L',
                                    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                                    description: 'T-shirt size',
                                },
                                clothing_type: {
                                    type: 'string',
                                    example: 'Sports Wear',
                                    description: 'Type of clothing',
                                },
                                clothing_size: {
                                    type: 'string',
                                    example: 'M',
                                    description: 'Clothing size',
                                },
                                tshirt_name: {
                                    type: 'string',
                                    example: 'ASMC Sports Club',
                                    description: 'T-shirt brand/name',
                                },
                                instruction: {
                                    type: 'string',
                                    example: 'Special instructions for the member',
                                    description: 'Any special instructions',
                                },
                                no_of_card_issued: {
                                    type: 'string',
                                    example: '2',
                                    description: 'Number of cards issued',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Member updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Members updated successfully',
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
            tags: ['Members'],
            description: 'Delete a member',
            operationId: 'deleteMember',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'MongoDB ObjectId of the member to delete',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Member deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Members deleted successfully',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/members/multiple': {
        post: {
            tags: ['Members'],
            description: 'Bulk create members from Excel data',
            operationId: 'bulkCreateMembers',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['name'],
                                properties: {
                                    name: { type: 'string', example: 'John Doe' },
                                    email: {
                                        type: 'string',
                                        example: 'john.doe@example.com',
                                    },
                                    gender: { type: 'string', example: 'Male' },
                                    mobile: { type: 'string', example: '9876543210' },
                                    alternate_mobile: { type: 'string', example: '' },
                                    dob: { type: 'string', example: '1990-01-01' },
                                    chss_number: { type: 'string', example: '' },
                                    non_chss_number: { type: 'string', example: '' },
                                    chss_card_link: { type: 'string', example: '' },
                                    fees_paid: { type: 'boolean', example: false },
                                    fees_verified: { type: 'boolean', example: false },
                                    family_details: {
                                        type: 'array',
                                        items: { type: 'object' },
                                        example: [],
                                    },
                                    is_family_user: { type: 'boolean', example: false },
                                    current_plan: { type: 'object', example: {} },
                                    profile: { type: 'string', example: '' },
                                    address: { type: 'string', example: '' },
                                    member_status: { type: 'string', example: 'Active' },
                                    member_post: { type: 'string', example: '' },
                                    role_activity_name: { type: 'string', example: '' },
                                    tshirt_size: { type: 'string', example: '' },
                                    clothing_type: { type: 'string', example: '' },
                                    clothing_size: { type: 'string', example: '' },
                                    tshirt_name: { type: 'string', example: '' },
                                    instruction: { type: 'string', example: '' },
                                    no_of_card_issued: { type: 'string', example: '' },
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Members created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Member Created Successfully',
                                    },
                                    data: { type: 'array', items: { type: 'object' } },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/members/list': {
        get: {
            tags: ['Members'],
            description: 'Get paginated list of members with filtering and search',
            operationId: 'getMembersList',
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
                    description: 'Search keywords for name, email, mobile, member_id',
                    example: 'john',
                },
                {
                    name: 'member_status',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by member status',
                    example: 'Active',
                },
                {
                    name: 'member_post',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by member post/position',
                    example: 'President',
                },
                {
                    name: 'converted',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by conversion status (true/false)',
                    example: 'true',
                },
                {
                    name: 'active',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by active status (true/false)',
                    example: 'true',
                },
                {
                    name: 'fees_paid',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by fees payment status (true/false/expired)',
                    example: 'true',
                },
                {
                    name: 'member_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by specific member ID',
                    example: '00001',
                },
            ],
            responses: {
                200: {
                    description: 'Members list retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Members records',
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
                                                        member_id: {
                                                            type: 'string',
                                                            example: '00001',
                                                        },
                                                        name: {
                                                            type: 'string',
                                                            example: 'John Doe',
                                                        },
                                                        email: {
                                                            type: 'string',
                                                            example:
                                                                'john.doe@example.com',
                                                        },
                                                        mobile: {
                                                            type: 'string',
                                                            example: '9876543210',
                                                        },
                                                        member_status: {
                                                            type: 'string',
                                                            example: 'Active',
                                                        },
                                                        fees_paid: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        converted: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        current_plan: { type: 'object' },
                                                        payment_history: {
                                                            type: 'object',
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
    '/members/team': {
        get: {
            tags: ['Members'],
            description: 'Get team members (staff/coaches)',
            operationId: 'getTeamMembers',
            responses: {
                200: {
                    description: 'Team members retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Members records',
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
                                                name: {
                                                    type: 'string',
                                                    example: 'Coach Smith',
                                                },
                                                profile: {
                                                    type: 'string',
                                                    example:
                                                        'https://example.com/coach.jpg',
                                                },
                                                activity_name: {
                                                    type: 'string',
                                                    example: 'Cricket',
                                                },
                                                role: {
                                                    type: 'string',
                                                    example: 'Head Coach',
                                                },
                                                display_order: {
                                                    type: 'string',
                                                    example: '1',
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
    '/members/verify': {
        get: {
            tags: ['Members'],
            description:
                'Verify member by member_id (supports both primary and secondary members)',
            operationId: 'verifyMemberByMemberId',
            parameters: [
                {
                    name: 'member_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Member ID (primary: 00001, secondary: S1-00001)',
                    example: '00001',
                },
            ],
            responses: {
                200: {
                    description: 'Member verification successful',
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
                                                example: 'john.doe@example.com',
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
                                            chss_number: {
                                                type: 'string',
                                                example: 'CHSS123456',
                                            },
                                            fees_paid: { type: 'boolean', example: true },
                                            type: {
                                                type: 'string',
                                                enum: ['primary', 'secondary'],
                                                example: 'primary',
                                            },
                                            secondary_member_id: {
                                                type: 'string',
                                                example: 'S1-00001',
                                                description:
                                                    'Only present for secondary members',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'Member not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Member not found',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/members/convert-to-user': {
        post: {
            tags: ['Members'],
            description: 'Convert a member to a user account (enables login access)',
            operationId: 'convertMemberToUser',
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
                                        'MongoDB ObjectId of the member to convert',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Member converted to user successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'User converted successfully',
                                    },
                                    data: { type: 'object' },
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
                                        example: 'Member does not have any membership.',
                                        enum: [
                                            'Member does not have any membership.',
                                            'Member does not have any email id.',
                                            'Member already converted to user.',
                                            'Member is not an active user.',
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
    '/members/payment': {
        post: {
            tags: ['Members'],
            description: 'Process member payment with receipt upload',
            operationId: 'memberPayment',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            required: [
                                'member_id',
                                'reference_no',
                                'amount_paid',
                                'receipt',
                            ],
                            properties: {
                                member_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the member',
                                },
                                reference_no: {
                                    type: 'string',
                                    example: 'TXN123456789',
                                    description: 'Payment reference/transaction number',
                                },
                                amount_paid: {
                                    type: 'string',
                                    example: '5000',
                                    description: 'Amount paid',
                                },
                                receipt: {
                                    type: 'string',
                                    format: 'binary',
                                    description: 'Payment receipt image file',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Payment request submitted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'We have received your payment request please wait for admin to verify your payment.',
                                    },
                                    data: { type: 'object' },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Payment submission failed',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: false },
                                    message: {
                                        type: 'string',
                                        example: 'Members does not exist!',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/members/temp-update-family-active-status': {
        get: {
            tags: ['Members'],
            description:
                'Temporary API to update active field in family_details based on member status',
            operationId: 'updateFamilyDetailsActiveStatus',
            responses: {
                200: {
                    description: 'Family details active status updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Family details active status updated successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            totalMembers: {
                                                type: 'number',
                                                example: 150,
                                            },
                                            membersWithFamily: {
                                                type: 'number',
                                                example: 75,
                                            },
                                            familyMembersUpdated: {
                                                type: 'number',
                                                example: 200,
                                            },
                                            membersSkipped: {
                                                type: 'number',
                                                example: 75,
                                            },
                                            activeMembers: {
                                                type: 'number',
                                                example: 100,
                                            },
                                            inactiveMembers: {
                                                type: 'number',
                                                example: 50,
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
