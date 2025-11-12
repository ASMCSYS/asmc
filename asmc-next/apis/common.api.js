import { server } from "./axios-config";

export const uploadSingleImage = async (formData) => {
    try {
        const res = await server.post(`/common/upload-single-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}