import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../helpers/constants";
import { getCookie } from "../../helpers/cookies";
import { staffListParser } from "./staffParser";

const staffApis = createApi({
    reducerPath: "staffApis",
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = getCookie("asmc_token");
            if (token) {
                headers.set("Authorization", `BEARER ${token}`);
            }
            return headers;
        },
    }),
    keepUnusedDataFor: 0,
    tagTypes: ["Staff"],
    endpoints: (build) => ({
        getStaffList: build.query({
            query: (params) => ({
                url: "/staff/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => staffListParser(response),
            providesTags: ["Staff"],
            keepUnusedDataFor: 5,
        }),
        getSingleStaff: build.query({
            query: (params) => ({
                url: "/staff",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
        }),
        addNewStaff: build.mutation({
            query: (payload) => ({
                url: "/staff",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Staff"],
        }),
        updateStaff: build.mutation({
            query: (payload) => ({
                url: "/staff",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Staff"],
        }),
        deleteStaff: build.mutation({
            query: (params) => ({
                url: "/staff",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Staff"],
        }),
        staffConvertToUser: build.mutation({
            query: (params) => ({
                url: "/staff/convert-to-user",
                method: "POST",
                body: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Staff"],
        }),
        updateProfile: build.mutation({
            query: (payload) => ({
                url: "/staff/profile",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response,
        }),
        updateUserProfile: build.mutation({
            query: (payload) => ({
                url: "/auth/update-profile",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response,
        }),
        changePassword: build.mutation({
            query: (payload) => ({
                url: "/auth/change-password",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response,
        }),
    }),
});

export const {
    useGetStaffListQuery,
    useGetSingleStaffQuery,
    useAddNewStaffMutation,
    useUpdateStaffMutation,
    useDeleteStaffMutation,
    useStaffConvertToUserMutation,
    useUpdateProfileMutation,
    useUpdateUserProfileMutation,
    useChangePasswordMutation,
} = staffApis;
export default staffApis;
