import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "../../helpers/constants";
import { getCookie } from "../../helpers/cookies";
import { activePlanParser } from './plansParser';

const plansApis = createApi({
    reducerPath: 'plansApis',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = getCookie("asmc_token");
            if (token) {
                headers.set('Authorization', `BEARER ${token}`)
            }
            return headers;
        }
    }),
    keepUnusedDataFor: 0,
    tagTypes: ["Plans"],
    endpoints: build => ({
        getActivePlansList: build.query({
            query: (params) => ({
                url: "/plans/active",
                method: "GET",
                params: params
            }),
            transformResponse: (response) => activePlanParser(response),
            providesTags: ['Plans'],
            keepUnusedDataFor: 5,
        }),
        getPlansList: build.query({
            query: (params) => ({
                url: "/plans/list",
                method: "GET",
                params: params
            }),
            transformResponse: (response) => response,
            providesTags: ['Plans'],
            keepUnusedDataFor: 5,
        }),
        addNewPlans: build.mutation({
            query: (payload) => ({
                url: "/plans",
                method: "POST",
                body: payload
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ['Plans'],
        }),
        updatePlans: build.mutation({
            query: (payload) => ({
                url: "/plans",
                method: "PUT",
                body: payload
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ['Plans'],
        }),
        deletePlans: build.mutation({
            query: (params) => ({
                url: "/plans",
                method: "DELETE",
                params: params
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ['Plans'],
        }),
    }),
});

export const { useGetActivePlansListQuery, useGetPlansListQuery, useAddNewPlansMutation, useUpdatePlansMutation, useDeletePlansMutation } = plansApis;
export default plansApis;