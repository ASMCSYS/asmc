export const commonSwagger = {
    "/common/upload-single-image": {
        post: {
            tags: ['Common'],
            description: 'Upload single image',
            operationId: 'UploadSingleImage',
            requestBody: {
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                image: {
                                    type: "string",
                                    format: "binary"
                                },
                            },
                        },
                    },
                },
                required: true,
            },
            responses: {
            },
        },
    },
}