export const paymentSwagger = {
    '/payment/initiate-payment': {
        post: {
            tags: ['Payment'],
            description: 'Initiate payment for membership fees and plans',
            operationId: 'initiatePayment',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['amount', 'customer_email', 'customer_phone'],
                            properties: {
                                amount: {
                                    type: 'number',
                                    example: 5000,
                                    description: 'Payment amount in rupees',
                                },
                                customer_email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'member@example.com',
                                    description: 'Customer email address',
                                },
                                customer_phone: {
                                    type: 'string',
                                    example: '9876543210',
                                    description: 'Customer phone number',
                                },
                                remarks: {
                                    type: 'string',
                                    example: 'Annual membership fee payment',
                                    description: 'Payment remarks or description',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Payment initiated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Payment initiated successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            order_id: {
                                                type: 'string',
                                                example: 'ORD1234567890123',
                                            },
                                            amount: { type: 'number', example: 5000 },
                                            payment_url: {
                                                type: 'string',
                                                example:
                                                    'https://payments.ccavenue.com/...',
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
    '/payment/ccavenue-response': {
        post: {
            tags: ['Payment'],
            description: 'Handle payment response from CCAvenue gateway (webhook)',
            operationId: 'ccavenueResponse',
            requestBody: {
                required: true,
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                order_id: { type: 'string', example: 'ORD1234567890123' },
                                tracking_id: { type: 'string', example: 'TRK123456' },
                                bank_ref_no: { type: 'string', example: 'BANK123456' },
                                order_status: { type: 'string', example: 'Success' },
                                failure_message: { type: 'string', example: '' },
                                payment_mode: { type: 'string', example: 'Credit Card' },
                                card_name: { type: 'string', example: 'Visa' },
                                status_code: { type: 'string', example: '01' },
                                status_message: {
                                    type: 'string',
                                    example: 'Txn Success',
                                },
                                currency: { type: 'string', example: 'INR' },
                                amount: { type: 'string', example: '5000.00' },
                                billing_name: { type: 'string', example: 'John Doe' },
                                billing_address: {
                                    type: 'string',
                                    example: '123 Main St',
                                },
                                billing_city: { type: 'string', example: 'Mumbai' },
                                billing_state: { type: 'string', example: 'Maharashtra' },
                                billing_zip: { type: 'string', example: '400001' },
                                billing_country: { type: 'string', example: 'India' },
                                billing_tel: { type: 'string', example: '9876543210' },
                                billing_email: {
                                    type: 'string',
                                    example: 'member@example.com',
                                },
                                delivery_name: { type: 'string', example: 'John Doe' },
                                delivery_address: {
                                    type: 'string',
                                    example: '123 Main St',
                                },
                                delivery_city: { type: 'string', example: 'Mumbai' },
                                delivery_state: {
                                    type: 'string',
                                    example: 'Maharashtra',
                                },
                                delivery_zip: { type: 'string', example: '400001' },
                                delivery_country: { type: 'string', example: 'India' },
                                delivery_tel: { type: 'string', example: '9876543210' },
                                merchant_param1: {
                                    type: 'string',
                                    example: 'additional_info',
                                },
                                merchant_param2: {
                                    type: 'string',
                                    example: 'additional_info',
                                },
                                merchant_param3: {
                                    type: 'string',
                                    example: 'additional_info',
                                },
                                merchant_param4: {
                                    type: 'string',
                                    example: 'additional_info',
                                },
                                merchant_param5: {
                                    type: 'string',
                                    example: 'additional_info',
                                },
                                vault: { type: 'string', example: 'N' },
                                offer_type: { type: 'string', example: 'null' },
                                offer_code: { type: 'string', example: 'null' },
                                discount_value: { type: 'string', example: '0.00' },
                                mer_amount: { type: 'string', example: '5000.00' },
                                eci_value: { type: 'string', example: '07' },
                                retry: { type: 'string', example: 'N' },
                                response_code: { type: 'string', example: '0' },
                                bin_country: { type: 'string', example: 'INDIA' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Payment response processed successfully',
                    content: {
                        'text/html': {
                            schema: {
                                type: 'string',
                                example: '<html><body>Payment processed</body></html>',
                            },
                        },
                    },
                },
            },
        },
    },
    '/payment/payment-list': {
        get: {
            tags: ['Payment'],
            description:
                'Get paginated list of payment history with filtering and search',
            operationId: 'gePaymentHistoryList',
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
                        'Search keywords for order_id, customer_email, or remarks',
                    example: 'ORD123',
                },
                {
                    name: 'payment_status',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by payment status',
                    example: 'Success',
                },
                {
                    name: 'filter_by',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Additional filter criteria',
                    example: 'member_payment',
                },
            ],
            responses: {
                200: {
                    description: 'Payment history list retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Payment records',
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
                                                        order_id: {
                                                            type: 'string',
                                                            example: 'ORD1234567890123',
                                                        },
                                                        amount: {
                                                            type: 'number',
                                                            example: 5000,
                                                        },
                                                        customer_email: {
                                                            type: 'string',
                                                            example: 'member@example.com',
                                                        },
                                                        customer_phone: {
                                                            type: 'string',
                                                            example: '9876543210',
                                                        },
                                                        payment_status: {
                                                            type: 'string',
                                                            example: 'Success',
                                                        },
                                                        payment_mode: {
                                                            type: 'string',
                                                            example: 'Credit Card',
                                                        },
                                                        remarks: {
                                                            type: 'string',
                                                            example:
                                                                'Annual membership fee',
                                                        },
                                                        tracking_id: {
                                                            type: 'string',
                                                            example: 'TRK123456',
                                                        },
                                                        bank_ref_no: {
                                                            type: 'string',
                                                            example: 'BANK123456',
                                                        },
                                                        createdAt: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                        },
                                                    },
                                                },
                                            },
                                            totalCount: { type: 'number', example: 100 },
                                            totalPages: { type: 'number', example: 10 },
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
    '/payment/update-remark': {
        patch: {
            tags: ['Payment'],
            description: 'Update payment remarks and difference amount',
            operationId: 'updatePaymentRemarks',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id', 'remarks', 'difference_amount_paid'],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the payment record',
                                },
                                remarks: {
                                    type: 'string',
                                    example: 'Updated payment remarks',
                                    description: 'Updated remarks for the payment',
                                },
                                difference_amount_paid: {
                                    type: 'number',
                                    example: 500,
                                    description: 'Difference amount paid (if any)',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Payment remarks updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Payment remarks updated successfully',
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
    '/payment/payment-status': {
        put: {
            tags: ['Payment'],
            description: 'Update payment status manually',
            operationId: 'updatePaymentStatus',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id', 'status'],
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the payment record',
                                },
                                status: {
                                    type: 'string',
                                    example: 'Success',
                                    description: 'New payment status',
                                    enum: ['Success', 'Pending', 'Failed', 'Cancelled'],
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Payment status updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Payment status updated successfully',
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
    '/payment/renew-payment': {
        post: {
            tags: ['Payment'],
            description: 'Initiate renewal payment for existing members',
            operationId: 'renewPayment',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['amount', 'customer_email', 'customer_phone'],
                            properties: {
                                amount: {
                                    type: 'number',
                                    example: 3000,
                                    description: 'Renewal payment amount in rupees',
                                },
                                customer_email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'member@example.com',
                                    description: 'Customer email address',
                                },
                                customer_phone: {
                                    type: 'string',
                                    example: '9876543210',
                                    description: 'Customer phone number',
                                },
                                remarks: {
                                    type: 'string',
                                    example: 'Membership renewal payment',
                                    description: 'Payment remarks or description',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Renewal payment initiated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Renewal payment initiated successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            order_id: {
                                                type: 'string',
                                                example: 'REN1234567890123',
                                            },
                                            amount: { type: 'number', example: 3000 },
                                            payment_url: {
                                                type: 'string',
                                                example:
                                                    'https://payments.ccavenue.com/...',
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
    '/payment/ccavenue-renew-response': {
        post: {
            tags: ['Payment'],
            description:
                'Handle renewal payment response from CCAvenue gateway (webhook)',
            operationId: 'ccavenueRenewResponse',
            requestBody: {
                required: true,
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                order_id: { type: 'string', example: 'REN1234567890123' },
                                tracking_id: { type: 'string', example: 'TRK123456' },
                                bank_ref_no: { type: 'string', example: 'BANK123456' },
                                order_status: { type: 'string', example: 'Success' },
                                failure_message: { type: 'string', example: '' },
                                payment_mode: { type: 'string', example: 'Credit Card' },
                                card_name: { type: 'string', example: 'Visa' },
                                status_code: { type: 'string', example: '01' },
                                status_message: {
                                    type: 'string',
                                    example: 'Txn Success',
                                },
                                currency: { type: 'string', example: 'INR' },
                                amount: { type: 'string', example: '3000.00' },
                                billing_name: { type: 'string', example: 'John Doe' },
                                billing_email: {
                                    type: 'string',
                                    example: 'member@example.com',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Renewal payment response processed successfully',
                    content: {
                        'text/html': {
                            schema: {
                                type: 'string',
                                example:
                                    '<html><body>Renewal payment processed</body></html>',
                            },
                        },
                    },
                },
            },
        },
    },
    '/payment/booking-payment': {
        post: {
            tags: ['Payment'],
            description: 'Initiate payment for activity bookings',
            operationId: 'bookingPayment',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'amount',
                                'customer_email',
                                'customer_phone',
                                'booking_id',
                            ],
                            properties: {
                                amount: {
                                    type: 'number',
                                    example: 200,
                                    description: 'Booking payment amount in rupees',
                                },
                                customer_email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'member@example.com',
                                    description: 'Customer email address',
                                },
                                customer_phone: {
                                    type: 'string',
                                    example: '9876543210',
                                    description: 'Customer phone number',
                                },
                                booking_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the booking',
                                },
                                remarks: {
                                    type: 'string',
                                    example: 'Badminton court booking payment',
                                    description: 'Payment remarks or description',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Booking payment initiated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Booking payment initiated successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            order_id: {
                                                type: 'string',
                                                example: 'BKG1234567890123',
                                            },
                                            amount: { type: 'number', example: 200 },
                                            payment_url: {
                                                type: 'string',
                                                example:
                                                    'https://payments.ccavenue.com/...',
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
    '/payment/ccavenue-booking-payment-response': {
        post: {
            tags: ['Payment'],
            description:
                'Handle booking payment response from CCAvenue gateway (webhook)',
            operationId: 'ccavenueBookingPaymentResponse',
            requestBody: {
                required: true,
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                order_id: { type: 'string', example: 'BKG1234567890123' },
                                tracking_id: { type: 'string', example: 'TRK123456' },
                                bank_ref_no: { type: 'string', example: 'BANK123456' },
                                order_status: { type: 'string', example: 'Success' },
                                failure_message: { type: 'string', example: '' },
                                payment_mode: { type: 'string', example: 'Credit Card' },
                                amount: { type: 'string', example: '200.00' },
                                billing_email: {
                                    type: 'string',
                                    example: 'member@example.com',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Booking payment response processed successfully',
                    content: {
                        'text/html': {
                            schema: {
                                type: 'string',
                                example:
                                    '<html><body>Booking payment processed</body></html>',
                            },
                        },
                    },
                },
            },
        },
    },
    '/payment/offline-payment': {
        post: {
            tags: ['Payment'],
            description: 'Handle offline payment processing',
            operationId: 'handleOfflinePayment',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['order_id', 'amount', 'payment_method'],
                            properties: {
                                order_id: {
                                    type: 'string',
                                    example: 'ORD1234567890123',
                                    description: 'Order ID for the payment',
                                },
                                amount: {
                                    type: 'number',
                                    example: 5000,
                                    description: 'Payment amount in rupees',
                                },
                                payment_method: {
                                    type: 'string',
                                    example: 'Cash',
                                    description: 'Offline payment method',
                                    enum: ['Cash', 'Cheque', 'Bank Transfer', 'UPI'],
                                },
                                transaction_reference: {
                                    type: 'string',
                                    example: 'CHQ123456',
                                    description: 'Transaction reference number',
                                },
                                remarks: {
                                    type: 'string',
                                    example: 'Offline payment received',
                                    description: 'Payment remarks',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Offline payment processed successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Offline payment processed successfully',
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
    '/payment/ccavenue-status-reconcile': {
        post: {
            tags: ['Payment'],
            description: 'Reconcile payment status with CCAvenue gateway',
            operationId: 'ccavenueStatusReconcile',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['order_id'],
                            properties: {
                                order_id: {
                                    type: 'string',
                                    example: 'ORD1234567890123',
                                    description: 'Order ID to reconcile',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Payment status reconciled successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Payment status reconciled successfully',
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
    '/payment/initiate-event-payment': {
        post: {
            tags: ['Payment'],
            description: 'Initiate payment for event bookings',
            operationId: 'initiateEventPayment',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'amount',
                                'customer_email',
                                'customer_phone',
                                'event_booking_id',
                            ],
                            properties: {
                                amount: {
                                    type: 'number',
                                    example: 1000,
                                    description: 'Event payment amount in rupees',
                                },
                                customer_email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'member@example.com',
                                    description: 'Customer email address',
                                },
                                customer_phone: {
                                    type: 'string',
                                    example: '9876543210',
                                    description: 'Customer phone number',
                                },
                                event_booking_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the event booking',
                                },
                                remarks: {
                                    type: 'string',
                                    example: 'Event registration payment',
                                    description: 'Payment remarks or description',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Event payment initiated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Event payment initiated successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            order_id: {
                                                type: 'string',
                                                example: 'EVT1234567890123',
                                            },
                                            amount: { type: 'number', example: 1000 },
                                            payment_url: {
                                                type: 'string',
                                                example:
                                                    'https://payments.ccavenue.com/...',
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
    '/payment/ccavenue-event-payment-response': {
        post: {
            tags: ['Payment'],
            description: 'Handle event payment response from CCAvenue gateway (webhook)',
            operationId: 'ccavenueResponseEventPayment',
            requestBody: {
                required: true,
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                order_id: { type: 'string', example: 'EVT1234567890123' },
                                tracking_id: { type: 'string', example: 'TRK123456' },
                                bank_ref_no: { type: 'string', example: 'BANK123456' },
                                order_status: { type: 'string', example: 'Success' },
                                amount: { type: 'string', example: '1000.00' },
                                billing_email: {
                                    type: 'string',
                                    example: 'member@example.com',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Event payment response processed successfully',
                    content: {
                        'text/html': {
                            schema: {
                                type: 'string',
                                example:
                                    '<html><body>Event payment processed</body></html>',
                            },
                        },
                    },
                },
            },
        },
    },
    '/payment/initiate-hall-payment': {
        post: {
            tags: ['Payment'],
            description: 'Initiate payment for hall bookings',
            operationId: 'initiateHallPayment',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'amount',
                                'customer_email',
                                'customer_phone',
                                'hall_booking_id',
                            ],
                            properties: {
                                amount: {
                                    type: 'number',
                                    example: 5000,
                                    description: 'Hall payment amount in rupees',
                                },
                                customer_email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'member@example.com',
                                    description: 'Customer email address',
                                },
                                customer_phone: {
                                    type: 'string',
                                    example: '9876543210',
                                    description: 'Customer phone number',
                                },
                                hall_booking_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the hall booking',
                                },
                                remarks: {
                                    type: 'string',
                                    example: 'Hall booking payment',
                                    description: 'Payment remarks or description',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Hall payment initiated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Hall payment initiated successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            order_id: {
                                                type: 'string',
                                                example: 'HAL1234567890123',
                                            },
                                            amount: { type: 'number', example: 5000 },
                                            payment_url: {
                                                type: 'string',
                                                example:
                                                    'https://payments.ccavenue.com/...',
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
    '/payment/ccavenue-hall-payment-response': {
        post: {
            tags: ['Payment'],
            description: 'Handle hall payment response from CCAvenue gateway (webhook)',
            operationId: 'ccavenueResponseHallPayment',
            requestBody: {
                required: true,
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                order_id: { type: 'string', example: 'HAL1234567890123' },
                                tracking_id: { type: 'string', example: 'TRK123456' },
                                bank_ref_no: { type: 'string', example: 'BANK123456' },
                                order_status: { type: 'string', example: 'Success' },
                                amount: { type: 'string', example: '5000.00' },
                                billing_email: {
                                    type: 'string',
                                    example: 'member@example.com',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Hall payment response processed successfully',
                    content: {
                        'text/html': {
                            schema: {
                                type: 'string',
                                example:
                                    '<html><body>Hall payment processed</body></html>',
                            },
                        },
                    },
                },
            },
        },
    },
    '/payment/initiate-remain-hall-payment': {
        post: {
            tags: ['Payment'],
            description: 'Initiate remaining payment for hall bookings',
            operationId: 'initiateRemainHallPayment',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'amount',
                                'customer_email',
                                'customer_phone',
                                'hall_booking_id',
                            ],
                            properties: {
                                amount: {
                                    type: 'number',
                                    example: 2500,
                                    description:
                                        'Remaining hall payment amount in rupees',
                                },
                                customer_email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'member@example.com',
                                    description: 'Customer email address',
                                },
                                customer_phone: {
                                    type: 'string',
                                    example: '9876543210',
                                    description: 'Customer phone number',
                                },
                                hall_booking_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'MongoDB ObjectId of the hall booking',
                                },
                                remarks: {
                                    type: 'string',
                                    example: 'Remaining hall booking payment',
                                    description: 'Payment remarks or description',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Remaining hall payment initiated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Remaining hall payment initiated successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            order_id: {
                                                type: 'string',
                                                example: 'HAL_REM1234567890123',
                                            },
                                            amount: { type: 'number', example: 2500 },
                                            payment_url: {
                                                type: 'string',
                                                example:
                                                    'https://payments.ccavenue.com/...',
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
    '/payment/ccavenue-remain-hall-payment-response': {
        post: {
            tags: ['Payment'],
            description:
                'Handle remaining hall payment response from CCAvenue gateway (webhook)',
            operationId: 'ccavenueResponseRemainHallPayment',
            requestBody: {
                required: true,
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                order_id: {
                                    type: 'string',
                                    example: 'HAL_REM1234567890123',
                                },
                                tracking_id: { type: 'string', example: 'TRK123456' },
                                bank_ref_no: { type: 'string', example: 'BANK123456' },
                                order_status: { type: 'string', example: 'Success' },
                                amount: { type: 'string', example: '2500.00' },
                                billing_email: {
                                    type: 'string',
                                    example: 'member@example.com',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Remaining hall payment response processed successfully',
                    content: {
                        'text/html': {
                            schema: {
                                type: 'string',
                                example:
                                    '<html><body>Remaining hall payment processed</body></html>',
                            },
                        },
                    },
                },
            },
        },
    },
};
