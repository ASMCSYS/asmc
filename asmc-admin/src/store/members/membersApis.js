import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../helpers/constants";
import { getCookie } from "../../helpers/cookies";
import { activeMembersListParser, membersListParser } from "./membersParser";

const membersApis = createApi({
    reducerPath: "membersApis",
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
    tagTypes: ["Members", "Booking", "Users"],
    endpoints: (build) => ({
        getActiveMembersList: build.query({
            query: (params) => ({
                url: "/members/list",
                method: "GET",
                params: { ...params, active: true, converted: true },
            }),
            transformResponse: (response) => activeMembersListParser(response),
            providesTags: ["Members"],
            keepUnusedDataFor: 5,
        }),
        getMembersList: build.query({
            query: (params) => ({
                url: "/members/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => membersListParser(response),
            providesTags: ["Members"],
            keepUnusedDataFor: 5,
        }),
        getSingleMembers: build.query({
            query: (params) => ({
                url: "/members",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
        }),
        addNewMembers: build.mutation({
            query: (payload) => ({
                url: "/members",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Members"],
        }),
        bulkAddNewMembers: build.mutation({
            query: (payload) => ({
                url: "/members/multiple",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Members"],
        }),
        updateMembers: build.mutation({
            query: (payload) => ({
                url: "/members",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Members"],
        }),
        deleteMembers: build.mutation({
            query: (params) => ({
                url: "/members",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Members"],
        }),
        convertToUser: build.mutation({
            query: (payload) => ({
                url: "/members/convert-to-user",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Members"],
        }),
        updateOfflinePayment: build.mutation({
            query: (payload) => ({
                url: "/payment/offline-payment",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Members", "Booking"],
        }),
        getUserList: build.query({
            query: (params) => ({
                url: "/auth/user-list",
                method: "POST",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["Users"],
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useGetMembersListQuery,
    useGetSingleMembersQuery,
    useAddNewMembersMutation,
    useBulkAddNewMembersMutation,
    useUpdateMembersMutation,
    useDeleteMembersMutation,
    useConvertToUserMutation,
    useUpdateOfflinePaymentMutation,
    useGetUserListQuery,
} = membersApis;
export default membersApis;
