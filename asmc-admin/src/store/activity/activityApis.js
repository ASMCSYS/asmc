import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../helpers/constants";
import { getCookie } from "../../helpers/cookies";
import { activeActivityListParser, activityListParser } from "./activityParser";

const activityApis = createApi({
    reducerPath: "activityApis",
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
    tagTypes: ["Activity", "ActivitySingle"],
    endpoints: (build) => ({
        getActiveActivityList: build.query({
            query: (params) => ({
                url: "/activity/list",
                method: "GET",
                params: { ...params, active: true },
            }),
            transformResponse: (response) => activeActivityListParser(response),
            providesTags: ["Activity"],
            keepUnusedDataFor: 5,
        }),
        getSingleActivity: build.query({
            query: (params) => ({
                url: "/activity",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["ActivitySingle"],
            keepUnusedDataFor: 5,
        }),
        getActivityDropdown: build.query({
            query: (params) => ({
                url: "/activity/dropdown",
                method: "GET",
                params: { ...params, active: true },
            }),
            transformResponse: (response) => response.result,
            providesTags: ["Activity"],
            keepUnusedDataFor: 5,
        }),
        getActivityList: build.query({
            query: (params) => ({
                url: "/activity/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => activityListParser(response),
            providesTags: ["Activity"],
            keepUnusedDataFor: 5,
        }),
        addNewActivity: build.mutation({
            query: (payload) => ({
                url: "/activity",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Activity"],
        }),
        updateActivity: build.mutation({
            query: (payload) => ({
                url: "/activity",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Activity"],
        }),
        deleteActivity: build.mutation({
            query: (params) => ({
                url: "/activity",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Activity"],
        }),
    }),
});

export const {
    useGetActiveActivityListQuery,
    useGetSingleActivityQuery,
    useGetActivityDropdownQuery,
    useGetActivityListQuery,
    useAddNewActivityMutation,
    useUpdateActivityMutation,
    useDeleteActivityMutation,
} = activityApis;
export default activityApis;
