export const reportsSwagger = {
    // Reports Management
    '/reports/members': {
        get: {
            tags: ['Reports'],
            description: 'Export members data to CSV with filtering options',
            operationId: 'exportMembers',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'start_date',
                    in: 'query',
                    required: true,
                    schema: { type: 'string', format: 'date' },
                    description: 'Start date for filtering members',
                    example: '2024-01-01',
                },
                {
                    name: 'end_date',
                    in: 'query',
                    required: true,
                    schema: { type: 'string', format: 'date' },
                    description: 'End date for filtering members',
                    example: '2024-01-31',
                },
                {
                    name: 'download',
                    in: 'query',
                    schema: { type: 'boolean', default: true },
                    description: 'Whether to download the CSV file',
                    example: true,
                },
            ],
            responses: {
                200: {
                    description: 'Members data exported successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Members data exported successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            total_members: {
                                                type: 'number',
                                                example: 150,
                                            },
                                            date_range: {
                                                type: 'object',
                                                properties: {
                                                    start_date: {
                                                        type: 'string',
                                                        format: 'date',
                                                        example: '2024-01-01',
                                                    },
                                                    end_date: {
                                                        type: 'string',
                                                        format: 'date',
                                                        example: '2024-01-31',
                                                    },
                                                },
                                            },
                                            csv_data: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        member_id: {
                                                            type: 'string',
                                                            example: 'MEM001',
                                                        },
                                                        name: {
                                                            type: 'string',
                                                            example: 'John Doe',
                                                        },
                                                        email: {
                                                            type: 'string',
                                                            example: 'john@example.com',
                                                        },
                                                        mobile: {
                                                            type: 'string',
                                                            example: '9876543210',
                                                        },
                                                        gender: {
                                                            type: 'string',
                                                            example: 'Male',
                                                        },
                                                        dob: {
                                                            type: 'string',
                                                            format: 'date',
                                                            example: '1990-01-15',
                                                        },
                                                        member_status: {
                                                            type: 'string',
                                                            example: 'Active',
                                                        },
                                                        current_plan: {
                                                            type: 'string',
                                                            example: 'Premium Annual',
                                                        },
                                                        fees_paid: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        fees_verified: {
                                                            type: 'boolean',
                                                            example: true,
                                                        },
                                                        family_members_count: {
                                                            type: 'number',
                                                            example: 2,
                                                        },
                                                        created_at: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                            example:
                                                                '2024-01-15T10:30:00Z',
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        'text/csv': {
                            schema: {
                                type: 'string',
                                format: 'binary',
                                description: 'CSV file containing members data',
                            },
                        },
                    },
                },
            },
        },
    },
    '/reports/enrollment': {
        get: {
            tags: ['Reports'],
            description: 'Export enrollment data for activities with filtering options',
            operationId: 'exportEnrollment',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'start_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'Start date for filtering enrollments',
                    example: '2024-01-01',
                },
                {
                    name: 'end_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'End date for filtering enrollments',
                    example: '2024-01-31',
                },
                {
                    name: 'activity_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by specific activity ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'download',
                    in: 'query',
                    schema: { type: 'boolean', default: true },
                    description: 'Whether to download the CSV file',
                    example: true,
                },
            ],
            responses: {
                200: {
                    description: 'Enrollment data exported successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Enrollment data exported successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            total_enrollments: {
                                                type: 'number',
                                                example: 75,
                                            },
                                            date_range: {
                                                type: 'object',
                                                properties: {
                                                    start_date: {
                                                        type: 'string',
                                                        format: 'date',
                                                        example: '2024-01-01',
                                                    },
                                                    end_date: {
                                                        type: 'string',
                                                        format: 'date',
                                                        example: '2024-01-31',
                                                    },
                                                },
                                            },
                                            enrollment_data: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        enrollment_id: {
                                                            type: 'string',
                                                            example: 'ENR001',
                                                        },
                                                        member_id: {
                                                            type: 'string',
                                                            example: 'MEM001',
                                                        },
                                                        member_name: {
                                                            type: 'string',
                                                            example: 'John Doe',
                                                        },
                                                        activity_name: {
                                                            type: 'string',
                                                            example: 'Morning Yoga',
                                                        },
                                                        activity_type: {
                                                            type: 'string',
                                                            example: 'Fitness',
                                                        },
                                                        enrollment_date: {
                                                            type: 'string',
                                                            format: 'date',
                                                            example: '2024-01-15',
                                                        },
                                                        enrollment_status: {
                                                            type: 'string',
                                                            example: 'Active',
                                                        },
                                                        fees_paid: {
                                                            type: 'number',
                                                            example: 500,
                                                        },
                                                        payment_status: {
                                                            type: 'string',
                                                            example: 'Paid',
                                                        },
                                                        instructor_name: {
                                                            type: 'string',
                                                            example: 'Jane Smith',
                                                        },
                                                        schedule: {
                                                            type: 'string',
                                                            example:
                                                                'Mon, Wed, Fri 6:00 AM',
                                                        },
                                                        location: {
                                                            type: 'string',
                                                            example: 'Main Hall',
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        'text/csv': {
                            schema: {
                                type: 'string',
                                format: 'binary',
                                description: 'CSV file containing enrollment data',
                            },
                        },
                    },
                },
            },
        },
    },
    '/reports/batch-wise': {
        get: {
            tags: ['Reports'],
            description: 'Export batch-wise data with filtering options',
            operationId: 'exportBatchWise',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'start_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'Start date for filtering batch data',
                    example: '2024-01-01',
                },
                {
                    name: 'end_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'End date for filtering batch data',
                    example: '2024-01-31',
                },
                {
                    name: 'batch_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by specific batch ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'download',
                    in: 'query',
                    schema: { type: 'boolean', default: true },
                    description: 'Whether to download the CSV file',
                    example: true,
                },
            ],
            responses: {
                200: {
                    description: 'Batch-wise data exported successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Batch-wise data exported successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            total_batches: {
                                                type: 'number',
                                                example: 12,
                                            },
                                            total_participants: {
                                                type: 'number',
                                                example: 240,
                                            },
                                            date_range: {
                                                type: 'object',
                                                properties: {
                                                    start_date: {
                                                        type: 'string',
                                                        format: 'date',
                                                        example: '2024-01-01',
                                                    },
                                                    end_date: {
                                                        type: 'string',
                                                        format: 'date',
                                                        example: '2024-01-31',
                                                    },
                                                },
                                            },
                                            batch_data: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        batch_id: {
                                                            type: 'string',
                                                            example: 'BAT001',
                                                        },
                                                        batch_name: {
                                                            type: 'string',
                                                            example:
                                                                'Morning Fitness Batch',
                                                        },
                                                        activity_name: {
                                                            type: 'string',
                                                            example: 'Cardio Workout',
                                                        },
                                                        instructor_name: {
                                                            type: 'string',
                                                            example: 'Mike Johnson',
                                                        },
                                                        start_time: {
                                                            type: 'string',
                                                            example: '06:00',
                                                        },
                                                        end_time: {
                                                            type: 'string',
                                                            example: '07:00',
                                                        },
                                                        days: {
                                                            type: 'string',
                                                            example: 'Mon, Wed, Fri',
                                                        },
                                                        capacity: {
                                                            type: 'number',
                                                            example: 20,
                                                        },
                                                        current_enrollment: {
                                                            type: 'number',
                                                            example: 18,
                                                        },
                                                        location: {
                                                            type: 'string',
                                                            example: 'Main Gym',
                                                        },
                                                        batch_status: {
                                                            type: 'string',
                                                            example: 'Active',
                                                        },
                                                        start_date: {
                                                            type: 'string',
                                                            format: 'date',
                                                            example: '2024-01-01',
                                                        },
                                                        end_date: {
                                                            type: 'string',
                                                            format: 'date',
                                                            example: '2024-12-31',
                                                        },
                                                        total_fees_collected: {
                                                            type: 'number',
                                                            example: 9000,
                                                        },
                                                        attendance_rate: {
                                                            type: 'number',
                                                            example: 85.5,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        'text/csv': {
                            schema: {
                                type: 'string',
                                format: 'binary',
                                description: 'CSV file containing batch-wise data',
                            },
                        },
                    },
                },
            },
        },
    },
    '/reports/renewal': {
        get: {
            tags: ['Reports'],
            description: 'Export membership renewal report with filtering options',
            operationId: 'exportRenewalReport',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'start_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'Start date for filtering renewals',
                    example: '2024-01-01',
                },
                {
                    name: 'end_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'End date for filtering renewals',
                    example: '2024-01-31',
                },
                {
                    name: 'download',
                    in: 'query',
                    schema: { type: 'boolean', default: true },
                    description: 'Whether to download the CSV file',
                    example: true,
                },
            ],
            responses: {
                200: {
                    description: 'Renewal report exported successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Renewal report exported successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            total_renewals: {
                                                type: 'number',
                                                example: 45,
                                            },
                                            total_revenue: {
                                                type: 'number',
                                                example: 540000,
                                            },
                                            date_range: {
                                                type: 'object',
                                                properties: {
                                                    start_date: {
                                                        type: 'string',
                                                        format: 'date',
                                                        example: '2024-01-01',
                                                    },
                                                    end_date: {
                                                        type: 'string',
                                                        format: 'date',
                                                        example: '2024-01-31',
                                                    },
                                                },
                                            },
                                            renewal_data: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        renewal_id: {
                                                            type: 'string',
                                                            example: 'REN001',
                                                        },
                                                        member_id: {
                                                            type: 'string',
                                                            example: 'MEM001',
                                                        },
                                                        member_name: {
                                                            type: 'string',
                                                            example: 'John Doe',
                                                        },
                                                        previous_plan: {
                                                            type: 'string',
                                                            example: 'Basic Annual',
                                                        },
                                                        new_plan: {
                                                            type: 'string',
                                                            example: 'Premium Annual',
                                                        },
                                                        renewal_date: {
                                                            type: 'string',
                                                            format: 'date',
                                                            example: '2024-01-15',
                                                        },
                                                        expiry_date: {
                                                            type: 'string',
                                                            format: 'date',
                                                            example: '2025-01-15',
                                                        },
                                                        amount_paid: {
                                                            type: 'number',
                                                            example: 12000,
                                                        },
                                                        payment_method: {
                                                            type: 'string',
                                                            example: 'Credit Card',
                                                        },
                                                        payment_status: {
                                                            type: 'string',
                                                            example: 'Completed',
                                                        },
                                                        renewal_type: {
                                                            type: 'string',
                                                            example: 'Upgrade',
                                                        },
                                                        discount_applied: {
                                                            type: 'number',
                                                            example: 1000,
                                                        },
                                                        net_amount: {
                                                            type: 'number',
                                                            example: 11000,
                                                        },
                                                        renewal_status: {
                                                            type: 'string',
                                                            example: 'Active',
                                                        },
                                                    },
                                                },
                                            },
                                            summary_stats: {
                                                type: 'object',
                                                properties: {
                                                    upgrades: {
                                                        type: 'number',
                                                        example: 20,
                                                    },
                                                    same_plan_renewals: {
                                                        type: 'number',
                                                        example: 15,
                                                    },
                                                    downgrades: {
                                                        type: 'number',
                                                        example: 5,
                                                    },
                                                    new_members: {
                                                        type: 'number',
                                                        example: 5,
                                                    },
                                                    average_renewal_amount: {
                                                        type: 'number',
                                                        example: 12000,
                                                    },
                                                    renewal_rate: {
                                                        type: 'number',
                                                        example: 75.5,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        'text/csv': {
                            schema: {
                                type: 'string',
                                format: 'binary',
                                description: 'CSV file containing renewal report data',
                            },
                        },
                    },
                },
            },
        },
    },
    '/reports/payment-summary': {
        get: {
            tags: ['Reports'],
            description: 'Export payment summary report with filtering options',
            operationId: 'exportPaymentSummary',
            parameters: [
                {
                    name: 'start_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'Start date for filtering payments',
                    example: '2024-01-01',
                },
                {
                    name: 'end_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'End date for filtering payments',
                    example: '2024-01-31',
                },
                {
                    name: 'payment_type',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by payment type',
                    example: 'membership',
                    enum: ['membership', 'activity', 'hall_booking', 'event_booking'],
                },
                {
                    name: 'payment_mode',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by payment mode',
                    example: 'online',
                    enum: ['online', 'offline', 'cash', 'card', 'upi'],
                },
                {
                    name: 'download',
                    in: 'query',
                    schema: { type: 'boolean', default: true },
                    description: 'Whether to download the CSV file',
                    example: true,
                },
            ],
            responses: {
                200: {
                    description: 'Payment summary report exported successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Payment summary report exported successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            total_payments: {
                                                type: 'number',
                                                example: 120,
                                            },
                                            total_amount: {
                                                type: 'number',
                                                example: 1500000,
                                            },
                                            date_range: {
                                                type: 'object',
                                                properties: {
                                                    start_date: {
                                                        type: 'string',
                                                        format: 'date',
                                                        example: '2024-01-01',
                                                    },
                                                    end_date: {
                                                        type: 'string',
                                                        format: 'date',
                                                        example: '2024-01-31',
                                                    },
                                                },
                                            },
                                            payment_summary: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        payment_id: {
                                                            type: 'string',
                                                            example: 'PAY001',
                                                        },
                                                        order_id: {
                                                            type: 'string',
                                                            example: 'ORD1234567890123',
                                                        },
                                                        member_id: {
                                                            type: 'string',
                                                            example: 'MEM001',
                                                        },
                                                        member_name: {
                                                            type: 'string',
                                                            example: 'John Doe',
                                                        },
                                                        payment_type: {
                                                            type: 'string',
                                                            example: 'membership',
                                                        },
                                                        payment_mode: {
                                                            type: 'string',
                                                            example: 'Credit Card',
                                                        },
                                                        amount: {
                                                            type: 'number',
                                                            example: 12000,
                                                        },
                                                        payment_date: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                            example:
                                                                '2024-01-15T10:30:00Z',
                                                        },
                                                        payment_status: {
                                                            type: 'string',
                                                            example: 'Success',
                                                        },
                                                        transaction_id: {
                                                            type: 'string',
                                                            example: 'TXN123456',
                                                        },
                                                        bank_reference: {
                                                            type: 'string',
                                                            example: 'BANK123456',
                                                        },
                                                        remarks: {
                                                            type: 'string',
                                                            example:
                                                                'Annual membership renewal',
                                                        },
                                                        processed_by: {
                                                            type: 'string',
                                                            example: 'System',
                                                        },
                                                    },
                                                },
                                            },
                                            summary_stats: {
                                                type: 'object',
                                                properties: {
                                                    membership_payments: {
                                                        type: 'number',
                                                        example: 60,
                                                    },
                                                    activity_payments: {
                                                        type: 'number',
                                                        example: 30,
                                                    },
                                                    hall_booking_payments: {
                                                        type: 'number',
                                                        example: 20,
                                                    },
                                                    event_booking_payments: {
                                                        type: 'number',
                                                        example: 10,
                                                    },
                                                    online_payments: {
                                                        type: 'number',
                                                        example: 80,
                                                    },
                                                    offline_payments: {
                                                        type: 'number',
                                                        example: 40,
                                                    },
                                                    successful_payments: {
                                                        type: 'number',
                                                        example: 115,
                                                    },
                                                    failed_payments: {
                                                        type: 'number',
                                                        example: 5,
                                                    },
                                                    average_payment_amount: {
                                                        type: 'number',
                                                        example: 12500,
                                                    },
                                                    success_rate: {
                                                        type: 'number',
                                                        example: 95.8,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        'text/csv': {
                            schema: {
                                type: 'string',
                                format: 'binary',
                                description: 'CSV file containing payment summary data',
                            },
                        },
                    },
                },
            },
        },
    },
    '/reports/payment-report': {
        get: {
            tags: ['Reports'],
            description:
                'Export detailed payment report with comprehensive filtering options',
            operationId: 'exportPaymentReport',
            parameters: [
                {
                    name: 'start_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'Start date for filtering payments',
                    example: '2024-01-01',
                },
                {
                    name: 'end_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'End date for filtering payments',
                    example: '2024-01-31',
                },
                {
                    name: 'payment_type',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by payment type',
                    example: 'membership',
                    enum: ['membership', 'activity', 'hall_booking', 'event_booking'],
                },
                {
                    name: 'payment_mode',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by payment mode',
                    example: 'online',
                    enum: ['online', 'offline', 'cash', 'card', 'upi'],
                },
                {
                    name: 'download',
                    in: 'query',
                    schema: { type: 'boolean', default: true },
                    description: 'Whether to download the CSV file',
                    example: true,
                },
            ],
            responses: {
                200: {
                    description: 'Payment report exported successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Payment report exported successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            total_payments: {
                                                type: 'number',
                                                example: 120,
                                            },
                                            total_amount: {
                                                type: 'number',
                                                example: 1500000,
                                            },
                                            date_range: {
                                                type: 'object',
                                                properties: {
                                                    start_date: {
                                                        type: 'string',
                                                        format: 'date',
                                                        example: '2024-01-01',
                                                    },
                                                    end_date: {
                                                        type: 'string',
                                                        format: 'date',
                                                        example: '2024-01-31',
                                                    },
                                                },
                                            },
                                            detailed_payments: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        payment_id: {
                                                            type: 'string',
                                                            example: 'PAY001',
                                                        },
                                                        order_id: {
                                                            type: 'string',
                                                            example: 'ORD1234567890123',
                                                        },
                                                        member_id: {
                                                            type: 'string',
                                                            example: 'MEM001',
                                                        },
                                                        member_name: {
                                                            type: 'string',
                                                            example: 'John Doe',
                                                        },
                                                        member_email: {
                                                            type: 'string',
                                                            example: 'john@example.com',
                                                        },
                                                        member_phone: {
                                                            type: 'string',
                                                            example: '9876543210',
                                                        },
                                                        payment_type: {
                                                            type: 'string',
                                                            example: 'membership',
                                                        },
                                                        payment_mode: {
                                                            type: 'string',
                                                            example: 'Credit Card',
                                                        },
                                                        amount: {
                                                            type: 'number',
                                                            example: 12000,
                                                        },
                                                        tax_amount: {
                                                            type: 'number',
                                                            example: 2160,
                                                        },
                                                        net_amount: {
                                                            type: 'number',
                                                            example: 9840,
                                                        },
                                                        payment_date: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                            example:
                                                                '2024-01-15T10:30:00Z',
                                                        },
                                                        payment_status: {
                                                            type: 'string',
                                                            example: 'Success',
                                                        },
                                                        transaction_id: {
                                                            type: 'string',
                                                            example: 'TXN123456',
                                                        },
                                                        bank_reference: {
                                                            type: 'string',
                                                            example: 'BANK123456',
                                                        },
                                                        gateway_response: {
                                                            type: 'object',
                                                        },
                                                        billing_address: {
                                                            type: 'string',
                                                            example:
                                                                '123 Main St, Mumbai',
                                                        },
                                                        delivery_address: {
                                                            type: 'string',
                                                            example:
                                                                '123 Main St, Mumbai',
                                                        },
                                                        remarks: {
                                                            type: 'string',
                                                            example:
                                                                'Annual membership renewal',
                                                        },
                                                        processed_by: {
                                                            type: 'string',
                                                            example: 'System',
                                                        },
                                                        ip_address: {
                                                            type: 'string',
                                                            example: '192.168.1.100',
                                                        },
                                                        user_agent: {
                                                            type: 'string',
                                                            example: 'Mozilla/5.0...',
                                                        },
                                                        refund_amount: {
                                                            type: 'number',
                                                            example: 0,
                                                        },
                                                        refund_date: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                        },
                                                        refund_reason: {
                                                            type: 'string',
                                                            example: '',
                                                        },
                                                        created_at: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                            example:
                                                                '2024-01-15T10:30:00Z',
                                                        },
                                                        updated_at: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                            example:
                                                                '2024-01-15T10:30:00Z',
                                                        },
                                                    },
                                                },
                                            },
                                            analytics: {
                                                type: 'object',
                                                properties: {
                                                    daily_breakdown: {
                                                        type: 'array',
                                                        items: {
                                                            type: 'object',
                                                            properties: {
                                                                date: {
                                                                    type: 'string',
                                                                    format: 'date',
                                                                    example: '2024-01-15',
                                                                },
                                                                payment_count: {
                                                                    type: 'number',
                                                                    example: 8,
                                                                },
                                                                total_amount: {
                                                                    type: 'number',
                                                                    example: 96000,
                                                                },
                                                            },
                                                        },
                                                    },
                                                    payment_mode_breakdown: {
                                                        type: 'object',
                                                        properties: {
                                                            online: {
                                                                type: 'number',
                                                                example: 80,
                                                            },
                                                            offline: {
                                                                type: 'number',
                                                                example: 40,
                                                            },
                                                        },
                                                    },
                                                    payment_type_breakdown: {
                                                        type: 'object',
                                                        properties: {
                                                            membership: {
                                                                type: 'number',
                                                                example: 60,
                                                            },
                                                            activity: {
                                                                type: 'number',
                                                                example: 30,
                                                            },
                                                            hall_booking: {
                                                                type: 'number',
                                                                example: 20,
                                                            },
                                                            event_booking: {
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
                        'text/csv': {
                            schema: {
                                type: 'string',
                                format: 'binary',
                                description:
                                    'CSV file containing detailed payment report data',
                            },
                        },
                    },
                },
            },
        },
    },
};
