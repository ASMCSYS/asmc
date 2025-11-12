export const biometricSwagger = {
    // Attendance Management
    '/biometric/attendance': {
        get: {
            tags: ['Biometric'],
            description: 'Get all attendance logs with filtering and pagination',
            operationId: 'getAllAttendanceLogs',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'machine_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by machine ID',
                    example: 'MACH001',
                },
                {
                    name: 'staff_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by staff ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'type',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by attendance type',
                    example: 'check_in',
                    enum: ['check_in', 'check_out'],
                },
                {
                    name: 'start_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'Start date for filtering',
                    example: '2024-01-01',
                },
                {
                    name: 'end_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'End date for filtering',
                    example: '2024-01-31',
                },
                {
                    name: 'page',
                    in: 'query',
                    schema: { type: 'integer', default: 1 },
                    description: 'Page number for pagination',
                    example: 1,
                },
                {
                    name: 'limit',
                    in: 'query',
                    schema: { type: 'integer', default: 50 },
                    description: 'Number of records per page',
                    example: 50,
                },
            ],
            responses: {
                200: {
                    description: 'Attendance logs retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Attendance logs retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            logs: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439011',
                                                        },
                                                        machine_id: {
                                                            type: 'string',
                                                            example: 'MACH001',
                                                        },
                                                        staff_id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439011',
                                                        },
                                                        type: {
                                                            type: 'string',
                                                            example: 'check_in',
                                                        },
                                                        timestamp: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                            example:
                                                                '2024-01-15T09:00:00Z',
                                                        },
                                                        staff_name: {
                                                            type: 'string',
                                                            example: 'John Doe',
                                                        },
                                                        machine_name: {
                                                            type: 'string',
                                                            example:
                                                                'Main Entrance Machine',
                                                        },
                                                    },
                                                },
                                            },
                                            pagination: {
                                                type: 'object',
                                                properties: {
                                                    currentPage: {
                                                        type: 'number',
                                                        example: 1,
                                                    },
                                                    totalPages: {
                                                        type: 'number',
                                                        example: 10,
                                                    },
                                                    totalCount: {
                                                        type: 'number',
                                                        example: 500,
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
        post: {
            tags: ['Biometric'],
            description: 'Create manual attendance log entry',
            operationId: 'createAttendanceLog',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['machine_id', 'staff_id', 'type', 'timestamp'],
                            properties: {
                                machine_id: {
                                    type: 'string',
                                    example: 'MACH001',
                                    description: 'Machine ID',
                                },
                                staff_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'Staff member ID',
                                },
                                type: {
                                    type: 'string',
                                    example: 'check_in',
                                    description: 'Attendance type',
                                    enum: ['check_in', 'check_out'],
                                },
                                timestamp: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2024-01-15T09:00:00Z',
                                    description: 'Attendance timestamp',
                                },
                                remarks: {
                                    type: 'string',
                                    example: 'Manual entry - forgot to check in',
                                    description: 'Additional remarks',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Attendance log created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Attendance log created successfully',
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
    '/biometric/attendance/stats': {
        get: {
            tags: ['Biometric'],
            description: 'Get attendance statistics and analytics',
            operationId: 'getAttendanceStats',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'start_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'Start date for statistics',
                    example: '2024-01-01',
                },
                {
                    name: 'end_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'End date for statistics',
                    example: '2024-01-31',
                },
                {
                    name: 'staff_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by specific staff member',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Attendance statistics retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Attendance statistics retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            total_entries: {
                                                type: 'number',
                                                example: 1000,
                                            },
                                            check_ins: { type: 'number', example: 500 },
                                            check_outs: { type: 'number', example: 500 },
                                            late_arrivals: {
                                                type: 'number',
                                                example: 50,
                                            },
                                            early_departures: {
                                                type: 'number',
                                                example: 30,
                                            },
                                            average_hours: {
                                                type: 'number',
                                                example: 8.5,
                                            },
                                            attendance_rate: {
                                                type: 'number',
                                                example: 95.5,
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
    '/biometric/attendance/machine/:machine_id': {
        get: {
            tags: ['Biometric'],
            description: 'Get attendance logs for a specific machine',
            operationId: 'getMachineAttendanceLogs',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'machine_id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Machine ID',
                    example: 'MACH001',
                },
                {
                    name: 'start_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'Start date for filtering',
                    example: '2024-01-01',
                },
                {
                    name: 'end_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'End date for filtering',
                    example: '2024-01-31',
                },
            ],
            responses: {
                200: {
                    description: 'Machine attendance logs retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Machine attendance logs retrieved successfully',
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
                                                machine_id: {
                                                    type: 'string',
                                                    example: 'MACH001',
                                                },
                                                staff_id: {
                                                    type: 'string',
                                                    example: '507f1f77bcf86cd799439011',
                                                },
                                                type: {
                                                    type: 'string',
                                                    example: 'check_in',
                                                },
                                                timestamp: {
                                                    type: 'string',
                                                    format: 'date-time',
                                                    example: '2024-01-15T09:00:00Z',
                                                },
                                                staff_name: {
                                                    type: 'string',
                                                    example: 'John Doe',
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
    '/biometric/attendance/staff/:staff_id': {
        get: {
            tags: ['Biometric'],
            description: 'Get attendance logs for a specific staff member',
            operationId: 'getStaffAttendanceLogs',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'staff_id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Staff member ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'start_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'Start date for filtering',
                    example: '2024-01-01',
                },
                {
                    name: 'end_date',
                    in: 'query',
                    schema: { type: 'string', format: 'date' },
                    description: 'End date for filtering',
                    example: '2024-01-31',
                },
            ],
            responses: {
                200: {
                    description: 'Staff attendance logs retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Staff attendance logs retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            staff_info: {
                                                type: 'object',
                                                properties: {
                                                    name: {
                                                        type: 'string',
                                                        example: 'John Doe',
                                                    },
                                                    employee_id: {
                                                        type: 'string',
                                                        example: 'EMP001',
                                                    },
                                                    department: {
                                                        type: 'string',
                                                        example: 'IT',
                                                    },
                                                },
                                            },
                                            attendance_logs: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439011',
                                                        },
                                                        type: {
                                                            type: 'string',
                                                            example: 'check_in',
                                                        },
                                                        timestamp: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                            example:
                                                                '2024-01-15T09:00:00Z',
                                                        },
                                                        machine_name: {
                                                            type: 'string',
                                                            example:
                                                                'Main Entrance Machine',
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
    '/biometric/attendance/sync/:machine_id': {
        post: {
            tags: ['Biometric'],
            description: 'Sync attendance logs from a specific machine',
            operationId: 'syncAttendanceLogs',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'machine_id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Machine ID to sync',
                    example: 'MACH001',
                },
            ],
            responses: {
                200: {
                    description: 'Attendance logs synced successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Attendance logs synced successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            synced_count: { type: 'number', example: 25 },
                                            new_logs: { type: 'number', example: 10 },
                                            updated_logs: { type: 'number', example: 15 },
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
    '/biometric/attendance/import': {
        post: {
            tags: ['Biometric'],
            description: 'Import attendance data from CSV file',
            operationId: 'importMachineAttendanceData',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            required: ['file'],
                            properties: {
                                file: {
                                    type: 'string',
                                    format: 'binary',
                                    description: 'CSV file containing attendance data',
                                },
                                machine_id: {
                                    type: 'string',
                                    example: 'MACH001',
                                    description: 'Machine ID for the imported data',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Attendance data imported successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Attendance data imported successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            imported_count: {
                                                type: 'number',
                                                example: 100,
                                            },
                                            skipped_count: { type: 'number', example: 5 },
                                            errors: {
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
    },

    // Machine Management
    '/biometric/machines': {
        get: {
            tags: ['Biometric'],
            description: 'Get all biometric machines with status and statistics',
            operationId: 'getAllMachines',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'search',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Search machines by name, ID, location, or IP',
                    example: 'Main Entrance',
                },
            ],
            responses: {
                200: {
                    description: 'Machines retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Machines retrieved successfully',
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
                                                    example: 'Main Entrance Machine',
                                                },
                                                machine_id: {
                                                    type: 'string',
                                                    example: 'MACH001',
                                                },
                                                ip_address: {
                                                    type: 'string',
                                                    example: '192.168.1.100',
                                                },
                                                port: { type: 'number', example: 4370 },
                                                location: {
                                                    type: 'string',
                                                    example: 'Main Entrance',
                                                },
                                                status: {
                                                    type: 'string',
                                                    example: 'online',
                                                },
                                                total_users: {
                                                    type: 'number',
                                                    example: 50,
                                                },
                                                total_logs: {
                                                    type: 'number',
                                                    example: 5000,
                                                },
                                                last_sync: {
                                                    type: 'string',
                                                    format: 'date-time',
                                                    example: '2024-01-15T10:30:00Z',
                                                },
                                                is_active: {
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
        post: {
            tags: ['Biometric'],
            description: 'Create a new biometric machine',
            operationId: 'createMachine',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'name',
                                'machine_id',
                                'ip_address',
                                'port',
                                'location',
                            ],
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'Main Entrance Machine',
                                    description: 'Machine name',
                                },
                                machine_id: {
                                    type: 'string',
                                    example: 'MACH001',
                                    description: 'Unique machine identifier',
                                },
                                ip_address: {
                                    type: 'string',
                                    example: '192.168.1.100',
                                    description: 'Machine IP address',
                                },
                                port: {
                                    type: 'number',
                                    example: 4370,
                                    description: 'Machine port number',
                                },
                                location: {
                                    type: 'string',
                                    example: 'Main Entrance',
                                    description: 'Machine location',
                                },
                                description: {
                                    type: 'string',
                                    example: 'Primary entrance biometric device',
                                    description: 'Machine description',
                                },
                                is_active: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Whether the machine is active',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Machine created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Machine created successfully',
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
    '/biometric/machines/stats': {
        get: {
            tags: ['Biometric'],
            description: 'Get biometric machine statistics',
            operationId: 'getMachineStats',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Machine statistics retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Machine statistics retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            total_machines: {
                                                type: 'number',
                                                example: 10,
                                            },
                                            active_machines: {
                                                type: 'number',
                                                example: 8,
                                            },
                                            offline_machines: {
                                                type: 'number',
                                                example: 2,
                                            },
                                            total_users: { type: 'number', example: 500 },
                                            total_logs: {
                                                type: 'number',
                                                example: 50000,
                                            },
                                            last_24h_logs: {
                                                type: 'number',
                                                example: 1000,
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
    '/biometric/machines/:id': {
        get: {
            tags: ['Biometric'],
            description: 'Get specific machine details',
            operationId: 'getMachineById',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Machine ID',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Machine details retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Machine details retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '507f1f77bcf86cd799439011',
                                            },
                                            name: {
                                                type: 'string',
                                                example: 'Main Entrance Machine',
                                            },
                                            machine_id: {
                                                type: 'string',
                                                example: 'MACH001',
                                            },
                                            ip_address: {
                                                type: 'string',
                                                example: '192.168.1.100',
                                            },
                                            port: { type: 'number', example: 4370 },
                                            location: {
                                                type: 'string',
                                                example: 'Main Entrance',
                                            },
                                            status: { type: 'string', example: 'online' },
                                            firmware_version: {
                                                type: 'string',
                                                example: '6.60.1.0',
                                            },
                                            device_info: { type: 'object' },
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
            tags: ['Biometric'],
            description: 'Update machine details',
            operationId: 'updateMachine',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Machine ID',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'Updated Machine Name',
                                    description: 'Machine name',
                                },
                                ip_address: {
                                    type: 'string',
                                    example: '192.168.1.101',
                                    description: 'Machine IP address',
                                },
                                port: {
                                    type: 'number',
                                    example: 4370,
                                    description: 'Machine port number',
                                },
                                location: {
                                    type: 'string',
                                    example: 'Updated Location',
                                    description: 'Machine location',
                                },
                                description: {
                                    type: 'string',
                                    example: 'Updated description',
                                    description: 'Machine description',
                                },
                                is_active: {
                                    type: 'boolean',
                                    example: true,
                                    description: 'Whether the machine is active',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Machine updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Machine updated successfully',
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
            tags: ['Biometric'],
            description: 'Delete a biometric machine',
            operationId: 'deleteMachine',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Machine ID',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Machine deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Machine deleted successfully',
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
    '/biometric/machines/:id/test-connection': {
        get: {
            tags: ['Biometric'],
            description: 'Test connection to a specific machine',
            operationId: 'testMachineConnection',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Machine ID',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Connection test completed',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Connection test completed',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            connected: { type: 'boolean', example: true },
                                            response_time: {
                                                type: 'number',
                                                example: 150,
                                            },
                                            device_info: { type: 'object' },
                                            error_message: {
                                                type: 'string',
                                                example: '',
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

    // Notifications
    '/biometric/notifications': {
        get: {
            tags: ['Biometric'],
            description: 'Get biometric system notifications',
            operationId: 'getNotifications',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    schema: { type: 'integer', default: 1 },
                    description: 'Page number for pagination',
                    example: 1,
                },
                {
                    name: 'limit',
                    in: 'query',
                    schema: { type: 'integer', default: 20 },
                    description: 'Number of notifications per page',
                    example: 20,
                },
                {
                    name: 'unread_only',
                    in: 'query',
                    schema: { type: 'boolean', default: false },
                    description: 'Show only unread notifications',
                    example: false,
                },
            ],
            responses: {
                200: {
                    description: 'Notifications retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example: 'Notifications retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            notifications: {
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
                                                            example: 'Machine Offline',
                                                        },
                                                        message: {
                                                            type: 'string',
                                                            example:
                                                                'Machine MACH001 is offline',
                                                        },
                                                        type: {
                                                            type: 'string',
                                                            example: 'warning',
                                                        },
                                                        is_read: {
                                                            type: 'boolean',
                                                            example: false,
                                                        },
                                                        created_at: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                            example:
                                                                '2024-01-15T10:30:00Z',
                                                        },
                                                        machine_id: {
                                                            type: 'string',
                                                            example: 'MACH001',
                                                        },
                                                    },
                                                },
                                            },
                                            pagination: {
                                                type: 'object',
                                                properties: {
                                                    currentPage: {
                                                        type: 'number',
                                                        example: 1,
                                                    },
                                                    totalPages: {
                                                        type: 'number',
                                                        example: 5,
                                                    },
                                                    totalCount: {
                                                        type: 'number',
                                                        example: 100,
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
    '/biometric/notifications/count': {
        get: {
            tags: ['Biometric'],
            description: 'Get unread notification count',
            operationId: 'getNotificationCount',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Notification count retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Notification count retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            unread_count: { type: 'number', example: 5 },
                                            total_count: { type: 'number', example: 100 },
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
    '/biometric/notifications/:id/read': {
        put: {
            tags: ['Biometric'],
            description: 'Mark a notification as read',
            operationId: 'markNotificationAsRead',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Notification ID',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            responses: {
                200: {
                    description: 'Notification marked as read successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Notification marked as read successfully',
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
    '/biometric/notifications/read-all': {
        put: {
            tags: ['Biometric'],
            description: 'Mark all notifications as read',
            operationId: 'markAllNotificationsAsRead',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'All notifications marked as read successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'All notifications marked as read successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            updated_count: {
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

    // Regularization
    '/biometric/regularization': {
        post: {
            tags: ['Biometric'],
            description: 'Create a regularization request for attendance',
            operationId: 'createRegularizationRequest',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'attendance_log_id',
                                'reason',
                                'requested_date',
                                'requested_time',
                            ],
                            properties: {
                                attendance_log_id: {
                                    type: 'string',
                                    example: '507f1f77bcf86cd799439011',
                                    description: 'ID of the attendance log to regularize',
                                },
                                reason: {
                                    type: 'string',
                                    example: 'Medical emergency',
                                    description: 'Reason for regularization',
                                },
                                requested_date: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2024-01-15',
                                    description: 'Requested date for regularization',
                                },
                                requested_time: {
                                    type: 'string',
                                    example: '09:00',
                                    description: 'Requested time for regularization',
                                },
                                supporting_documents: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['medical_certificate.pdf'],
                                    description: 'Supporting document file names',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Regularization request created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Regularization request created successfully',
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
            tags: ['Biometric'],
            description: 'Get regularization requests with filtering',
            operationId: 'getRegularizationRequests',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'status',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by request status',
                    example: 'pending',
                    enum: ['pending', 'approved', 'rejected'],
                },
                {
                    name: 'staff_id',
                    in: 'query',
                    schema: { type: 'string' },
                    description: 'Filter by staff member ID',
                    example: '507f1f77bcf86cd799439011',
                },
                {
                    name: 'page',
                    in: 'query',
                    schema: { type: 'integer', default: 1 },
                    description: 'Page number for pagination',
                    example: 1,
                },
                {
                    name: 'limit',
                    in: 'query',
                    schema: { type: 'integer', default: 20 },
                    description: 'Number of requests per page',
                    example: 20,
                },
            ],
            responses: {
                200: {
                    description: 'Regularization requests retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Regularization requests retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            requests: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: {
                                                            type: 'string',
                                                            example:
                                                                '507f1f77bcf86cd799439011',
                                                        },
                                                        staff_name: {
                                                            type: 'string',
                                                            example: 'John Doe',
                                                        },
                                                        reason: {
                                                            type: 'string',
                                                            example: 'Medical emergency',
                                                        },
                                                        requested_date: {
                                                            type: 'string',
                                                            format: 'date',
                                                            example: '2024-01-15',
                                                        },
                                                        requested_time: {
                                                            type: 'string',
                                                            example: '09:00',
                                                        },
                                                        status: {
                                                            type: 'string',
                                                            example: 'pending',
                                                        },
                                                        created_at: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                            example:
                                                                '2024-01-15T10:30:00Z',
                                                        },
                                                        reviewed_by: {
                                                            type: 'string',
                                                            example: 'Manager Name',
                                                        },
                                                        reviewed_at: {
                                                            type: 'string',
                                                            format: 'date-time',
                                                        },
                                                    },
                                                },
                                            },
                                            pagination: {
                                                type: 'object',
                                                properties: {
                                                    currentPage: {
                                                        type: 'number',
                                                        example: 1,
                                                    },
                                                    totalPages: {
                                                        type: 'number',
                                                        example: 5,
                                                    },
                                                    totalCount: {
                                                        type: 'number',
                                                        example: 100,
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
    '/biometric/regularization/:id/approve': {
        put: {
            tags: ['Biometric'],
            description: 'Approve a regularization request',
            operationId: 'approveRegularizationRequest',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Regularization request ID',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            requestBody: {
                required: false,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                comments: {
                                    type: 'string',
                                    example:
                                        'Approved after reviewing medical certificate',
                                    description: 'Approval comments',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Regularization request approved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Regularization request approved successfully',
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
    '/biometric/regularization/:id/reject': {
        put: {
            tags: ['Biometric'],
            description: 'Reject a regularization request',
            operationId: 'rejectRegularizationRequest',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Regularization request ID',
                    example: '507f1f77bcf86cd799439011',
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['comments'],
                            properties: {
                                comments: {
                                    type: 'string',
                                    example: 'Insufficient supporting documentation',
                                    description: 'Rejection reason',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Regularization request rejected successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Regularization request rejected successfully',
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
};
