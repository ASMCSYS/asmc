export const rolesSwagger = {
    '/roles': {
        post: {
            tags: ['Roles'],
            description: 'Create a new role',
            operationId: 'insertRole',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['name'],
                            properties: {
                                name: { type: 'string', example: 'Admin' },
                                description: {
                                    type: 'string',
                                    example: 'Administrator role',
                                },
                                permissions: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['staff:create', 'member:read'],
                                },
                                hierarchy: { type: 'number', example: 10 },
                                accessLevel: {
                                    type: 'string',
                                    enum: ['frontend', 'admin', 'both'],
                                    example: 'admin',
                                },
                                roleType: {
                                    type: 'string',
                                    enum: ['system', 'staff', 'member'],
                                    example: 'staff',
                                },
                                isActive: { type: 'boolean', example: true },
                                isDefault: { type: 'boolean', example: false },
                                isSystem: { type: 'boolean', example: false },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
        get: {
            tags: ['Roles'],
            description: 'Get list of all roles',
            operationId: 'getRolesList',
            security: [{ bearerAuth: [] }],
            responses: {},
        },
        put: {
            tags: ['Roles'],
            description: 'Update a role',
            operationId: 'editRole',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id', 'name'],
                            properties: {
                                _id: { type: 'string', example: 'roleId' },
                                name: { type: 'string', example: 'Admin' },
                                description: {
                                    type: 'string',
                                    example: 'Administrator role',
                                },
                                permissions: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['staff:create', 'member:read'],
                                },
                                hierarchy: { type: 'number', example: 10 },
                                accessLevel: {
                                    type: 'string',
                                    enum: ['frontend', 'admin', 'both'],
                                    example: 'admin',
                                },
                                roleType: {
                                    type: 'string',
                                    enum: ['system', 'staff', 'member'],
                                    example: 'staff',
                                },
                                isActive: { type: 'boolean', example: true },
                                isDefault: { type: 'boolean', example: false },
                                isSystem: { type: 'boolean', example: false },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
        delete: {
            tags: ['Roles'],
            description: 'Delete a role',
            operationId: 'removeRole',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['_id'],
                            properties: {
                                _id: { type: 'string', example: 'roleId' },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
    },
    '/roles/{id}': {
        get: {
            tags: ['Roles'],
            description: 'Get a single role by ID',
            operationId: 'getSingleRole',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                },
            ],
            responses: {},
        },
    },
    '/roles/assign-permissions': {
        post: {
            tags: ['Roles'],
            description: 'Assign permissions to a role',
            operationId: 'assignPermissionsToRole',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['roleId', 'permissions'],
                            properties: {
                                roleId: { type: 'string', example: 'roleId' },
                                permissions: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['staff:create'],
                                },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
    },
    '/roles/remove-permissions': {
        post: {
            tags: ['Roles'],
            description: 'Remove permissions from a role',
            operationId: 'removePermissionsFromRole',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['roleId', 'permissions'],
                            properties: {
                                roleId: { type: 'string', example: 'roleId' },
                                permissions: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['staff:create'],
                                },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
    },
    '/roles/update-hierarchy': {
        put: {
            tags: ['Roles'],
            description: 'Update the hierarchy of a role',
            operationId: 'updateRoleHierarchy',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['roleId', 'hierarchy'],
                            properties: {
                                roleId: { type: 'string', example: 'roleId' },
                                hierarchy: { type: 'number', example: 10 },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
    },
    '/roles/by-hierarchy': {
        get: {
            tags: ['Roles'],
            description: 'Get roles by hierarchy',
            operationId: 'getRolesByHierarchy',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'minHierarchy',
                    in: 'query',
                    required: false,
                    schema: { type: 'number' },
                },
            ],
            responses: {},
        },
    },
    '/roles/initialize-defaults': {
        post: {
            tags: ['Roles'],
            description: 'Initialize default roles',
            operationId: 'initializeDefaultRoles',
            security: [{ bearerAuth: [] }],
            responses: {},
        },
    },
};
