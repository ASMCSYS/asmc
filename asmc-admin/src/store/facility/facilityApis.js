import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "../../helpers/constants";
import { getCookie } from "../../helpers/cookies";
import { facilityListParser, facilityActiveListParser } from './facilityParser';

const facilityApis = createApi({
    reducerPath: 'facilityApis',
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
    tagTypes: ["Facility"],
    endpoints: build => ({
        getActiveFacilityList: build.query({
            query: (params) => ({
                url: "/masters/facility/list",
                method: "GET",
                params: params
            }),
            transformResponse: (response) => facilityActiveListParser(response),
            providesTags: ['Facility'],
            keepUnusedDataFor: 5,
        }),
        getFacilityList: build.query({
            query: (params) => ({
                url: "/masters/facility/list",
                method: "GET",
                params: params
            }),
            transformResponse: (response) => facilityListParser(response),
            providesTags: ['Facility'],
            keepUnusedDataFor: 5,
        }),
        addNewFacility: build.mutation({
            query: (payload) => ({
                url: "/masters/facility",
                method: "POST",
                body: payload
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ['Facility'],
        }),
        updateFacility: build.mutation({
            query: (payload) => ({
                url: "/masters/facility",
                method: "PUT",
                body: payload
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ['Facility'],
        }),
        deleteFacility: build.mutation({
            query: (params) => ({
                url: "/masters/facility",
                method: "DELETE",
                params: params
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ['Facility'],
        }),
    }),
});

export const { useGetActiveFacilityListQuery, useGetFacilityListQuery, useAddNewFacilityMutation, useUpdateFacilityMutation, useDeleteFacilityMutation } = facilityApis;
export default facilityApis;