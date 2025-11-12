import { toast } from "react-toastify";
import { server } from "./axios-config";

export const login = async (data) => {
    try {
        const res = await server.post(`/auth/member-login`, data);
        return res.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export const fetchLoggedInUser = async () => {
    try {
        const res = await server.get(`/auth/me`);
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

export const updateProfile = async (data) => {
    try {
        const res = await server.put(`/members`, data);
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

export const changePassword = async (data) => {
    try {
        const res = await server.put(`/auth/change-password`, data);
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}
export const resetPassword = async (data) => {
    try {
        const res = await server.put(`/auth/reset-password`, data);
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}


export const sendResetPasswordOtp = async (data) => {
    try {
        const res = await server.post(`/auth/send-reset-password-otp`, data);
        return res.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}