export const plansSwagger = {
    // Plan Management
    '/plans': {
        get: {
            tags: ['Plans'],
            description: 'Get single plan details by ID',
            operationId: 'getSinglePlans',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Plan MongoDB ID',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Plan details retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Plan retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            plan_id: {
                                                type: 'string',
                                                example: 'PLN001',
                                            },
                                            plan_name: {
                                                type: 'string',
                                                example: 'Premium Annual Plan',
                                            },
                                            plan_type: {
                                                type: 'string',
                                                example: 'Annual',
                                            },
                                            description: {
                                                type: 'string',
                                                example:
                                                    'Premium annual membership with full access to all facilities',
                                            },
                                            amount: { type: 'number', example: 12000 },
                                            dependent_member_price: {
                                                type: 'number',
                                                example: 8000,
                                            },
                                            non_dependent_member_price: {
                                                type: 'number',
                                                example: 10000,
                                            },
                                            kids_price: { type: 'number', example: 4000 },
                                            guest_price: { type: 'number', example: 500 },
                                            plan_timeline: {
                                                type: 'string',
                                                example: '12 months',
                                            },
                                            start_month: {
                                                type: 'string',
                                                example: 'January',
                                            },
                                            end_month: {
                                                type: 'string',
                                                example: 'December',
                                            },
                                            batch_hours: {
                                                type: 'string',
                                                example: '6:00 AM - 10:00 PM',
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
            tags: ['Plans'],
            description: 'Create a new membership plan',
            operationId: 'insertPlans',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['plan_name', 'plan_type', 'amount'],
                            properties: {
                                plan_name: {
                                    type: 'string',
                                    example: 'Premium Annual Plan',
                                    description: 'Plan name',
                                },
                                plan_type: {
                                    type: 'string',
                                    example: 'Annual',
                                    description:
                                        'Plan type (Annual, Monthly, Quarterly, etc.)',
                                },
                                description: {
                                    type: 'string',
                                    example:
                                        'Premium annual membership with full access to all facilities',
                                    description: 'Plan description',
                                },
                                amount: {
                                    type: 'number',
                                    example: 12000,
                                    description: 'Base plan amount',
                                },
                                dependent_member_price: {
                                    type: 'number',
                                    example: 8000,
                                    description: 'Price for dependent members',
                                },
                                non_dependent_member_price: {
                                    type: 'number',
                                    example: 10000,
                                    description: 'Price for non-dependent members',
                                },
                                kids_price: {
                                    type: 'number',
                                    example: 4000,
                                    description: 'Price for kids',
                                },
                                guest_price: {
                                    type: 'number',
                                    example: 500,
                                    description: 'Price for guest access',
                                },
                                plan_timeline: {
                                    type: 'string',
                                    example: '12 months',
                                    description: 'Plan duration timeline',
                                },
                                start_month: {
                                    type: 'string',
                                    example: 'January',
                                    description: 'Plan start month',
                                },
                                end_month: {
                                    type: 'string',
                                    example: 'December',
                                    description: 'Plan end month',
                                },
                                batch_hours: {
                                    type: 'string',
                                    example: '6:00 AM - 10:00 PM',
                                    description: 'Available hours for the plan',
                                },
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Plan status (active/inactive)',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Plan created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Plan Created Successfully',
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
            tags: ['Plans'],
            description: 'Update plan details',
            operationId: 'editPlans',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id', 'plan_name', 'plan_type', 'amount'],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Plan MongoDB ID',
                                },
                                plan_name: {
                                    type: 'string',
                                    example: 'Updated Premium Annual Plan',
                                    description: 'Updated plan name',
                                },
                                plan_type: {
                                    type: 'string',
                                    example: 'Annual',
                                    description: 'Plan type',
                                },
                                description: {
                                    type: 'string',
                                    example:
                                        'Updated premium annual membership with enhanced benefits',
                                    description: 'Updated plan description',
                                },
                                amount: {
                                    type: 'number',
                                    example: 15000,
                                    description: 'Updated base plan amount',
                                },
                                dependent_member_price: {
                                    type: 'number',
                                    example: 10000,
                                    description: 'Updated price for dependent members',
                                },
                                non_dependent_member_price: {
                                    type: 'number',
                                    example: 12000,
                                    description:
                                        'Updated price for non-dependent members',
                                },
                                kids_price: {
                                    type: 'number',
                                    example: 5000,
                                    description: 'Updated price for kids',
                                },
                                guest_price: {
                                    type: 'number',
                                    example: 750,
                                    description: 'Updated price for guest access',
                                },
                                plan_timeline: {
                                    type: 'string',
                                    example: '12 months',
                                    description: 'Plan duration timeline',
                                },
                                start_month: {
                                    type: 'string',
                                    example: 'January',
                                    description: 'Plan start month',
                                },
                                end_month: {
                                    type: 'string',
                                    example: 'December',
                                    description: 'Plan end month',
                                },
                                batch_hours: {
                                    type: 'string',
                                    example: '5:00 AM - 11:00 PM',
                                    description: 'Updated available hours for the plan',
                                },
                                status: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Plan status',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Plan updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Plan updated successfully',
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
            tags: ['Plans'],
            description: 'Delete a membership plan',
            operationId: 'removePlans',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: '_id',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Plan MongoDB ID',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Plan deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Plan deleted successfully',
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
    '/plans/list': {
        get: {
            tags: ['Plans'],
            description:
                'Get paginated list of membership plans with filtering and search',
            operationId: 'getPlansList',
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
                    description: 'Search keywords for plan name or description',
                    example: 'premium',
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
                    name: 'plan_type',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by plan type',
                    example: 'Annual',
                },
            ],
            responses: {
                200: {
                    description: 'Plans list retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Plans retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            plans: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439011',
                                                        },
                                                        plan_id: {
                                                            type: 'string',
                                                            example: 'PLN001',
                                                        },
                                                        plan_name: {
                                                            type: 'string',
                                                            example:
                                                                'Premium Annual Plan',
                                                        },
                                                        plan_type: {
                                                            type: 'string',
                                                            example: 'Annual',
                                                        },
                                                        description: {
                                                            type: 'string',
                                                            example:
                                                                'Premium annual membership with full access',
                                                        },
                                                        amount: {
                                                            type: 'number',
                                                            example: 12000,
                                                        },
                                                        dependent_member_price: {
                                                            type: 'number',
                                                            example: 8000,
                                                        },
                                                        non_dependent_member_price: {
                                                            type: 'number',
                                                            example: 10000,
                                                        },
                                                        kids_price: {
                                                            type: 'number',
                                                            example: 4000,
                                                        },
                                                        guest_price: {
                                                            type: 'number',
                                                            example: 500,
                                                        },
                                                        plan_timeline: {
                                                            type: 'string',
                                                            example: '12 months',
                                                        },
                                                        batch_hours: {
                                                            type: 'string',
                                                            example: '6:00 AM - 10:00 PM',
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
                                                        example: 25,
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
                                                        example: 3,
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
    '/plans/active': {
        get: {
            tags: ['Plans'],
            description: 'Get list of active membership plans (public endpoint)',
            operationId: 'getActivePlansList',
            responses: {
                200: {
                    description: 'Active plans retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Active plans retrieved successfully',
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
                                                plan_id: {
                                                    type: 'string',
                                                    example: 'PLN001',
                                                },
                                                plan_name: {
                                                    type: 'string',
                                                    example: 'Premium Annual Plan',
                                                },
                                                plan_type: {
                                                    type: 'string',
                                                    example: 'Annual',
                                                },
                                                description: {
                                                    type: 'string',
                                                    example:
                                                        'Premium annual membership with full access to all facilities',
                                                },
                                                amount: {
                                                    type: 'number',
                                                    example: 12000,
                                                },
                                                dependent_member_price: {
                                                    type: 'number',
                                                    example: 8000,
                                                },
                                                non_dependent_member_price: {
                                                    type: 'number',
                                                    example: 10000,
                                                },
                                                kids_price: {
                                                    type: 'number',
                                                    example: 4000,
                                                },
                                                guest_price: {
                                                    type: 'number',
                                                    example: 500,
                                                },
                                                plan_timeline: {
                                                    type: 'string',
                                                    example: '12 months',
                                                },
                                                start_month: {
                                                    type: 'string',
                                                    example: 'January',
                                                },
                                                end_month: {
                                                    type: 'string',
                                                    example: 'December',
                                                },
                                                batch_hours: {
                                                    type: 'string',
                                                    example: '6:00 AM - 10:00 PM',
                                                },
                                                features: {
                                                    type: 'array',
                                                    items: { type: 'string' },
                                                    example: [
                                                        'Gym Access',
                                                        'Swimming Pool',
                                                        'Tennis Court',
                                                        'Sauna',
                                                    ],
                                                },
                                                benefits: {
                                                    type: 'array',
                                                    items: { type: 'string' },
                                                    example: [
                                                        'Personal Trainer',
                                                        'Nutrition Counseling',
                                                        'Group Classes',
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
    '/plans/get-next-plan': {
        get: {
            tags: ['Plans'],
            description:
                'Get next recommended plan for a member based on their current plan and preferences',
            operationId: 'getMemberNextPlan',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'current_plan_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Current plan ID of the member',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'preferred_plan_type',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Preferred plan type',
                    example: 'Annual',
                },
                {
                    name: 'budget_range',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Budget range for the next plan',
                    example: '10000-15000',
                },
            ],
            responses: {
                200: {
                    description: 'Next recommended plan retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Next plan recommendation retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            current_plan: {
                                                type: 'object',
                                                properties: {
                                                    _id: {
                                                        type: 'string',
                                                        example:
                                                            '507f1f77bcf86cd799439011',
                                                    },
                                                    plan_name: {
                                                        type: 'string',
                                                        example: 'Basic Monthly Plan',
                                                    },
                                                    plan_type: {
                                                        type: 'string',
                                                        example: 'Monthly',
                                                    },
                                                    amount: {
                                                        type: 'number',
                                                        example: 2000,
                                                    },
                                                    expiry_date: {
                                                        type: 'string',
                                                        format: 'date',
                                                        example: '2024-02-15',
                                                    },
                                                },
                                            },
                                            recommended_plans: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439012',
                                                        },
                                                        plan_name: {
                                                            type: 'string',
                                                            example:
                                                                'Premium Annual Plan',
                                                        },
                                                        plan_type: {
                                                            type: 'string',
                                                            example: 'Annual',
                                                        },
                                                        description: {
                                                            type: 'string',
                                                            example:
                                                                'Premium annual membership with enhanced benefits',
                                                        },
                                                        amount: {
                                                            type: 'number',
                                                            example: 12000,
                                                        },
                                                        savings: {
                                                            type: 'number',
                                                            example: 12000,
                                                        },
                                                        savings_percentage: {
                                                            type: 'number',
                                                            example: 50,
                                                        },
                                                        recommendation_reason: {
                                                            type: 'string',
                                                            example:
                                                                'Best value for money with 50% savings compared to monthly plans',
                                                        },
                                                        features: {
                                                            type: 'array',
                                                            items: { type: 'string' },
                                                            example: [
                                                                'Gym Access',
                                                                'Swimming Pool',
                                                                'Tennis Court',
                                                                'Personal Trainer',
                                                            ],
                                                        },
                                                    },
                                                },
                                            },
                                            upgrade_options: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439013',
                                                        },
                                                        plan_name: {
                                                            type: 'string',
                                                            example: 'VIP Annual Plan',
                                                        },
                                                        plan_type: {
                                                            type: 'string',
                                                            example: 'Annual',
                                                        },
                                                        amount: {
                                                            type: 'number',
                                                            example: 20000,
                                                        },
                                                        additional_cost: {
                                                            type: 'number',
                                                            example: 8000,
                                                        },
                                                        premium_features: {
                                                            type: 'array',
                                                            items: { type: 'string' },
                                                            example: [
                                                                'Spa Access',
                                                                'Personal Chef',
                                                                'VIP Lounge',
                                                            ],
                                                        },
                                                    },
                                                },
                                            },
                                            comparison_summary: {
                                                type: 'object',
                                                properties: {
                                                    current_monthly_cost: {
                                                        type: 'number',
                                                        example: 2000,
                                                    },
                                                    recommended_yearly_savings: {
                                                        type: 'number',
                                                        example: 12000,
                                                    },
                                                    best_value_plan: {
                                                        type: 'string',
                                                        example: 'Premium Annual Plan',
                                                    },
                                                    total_available_plans: {
                                                        type: 'number',
                                                        example: 8,
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
