import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../helpers/constants";
import { getCookie } from "../../helpers/cookies";
import { hallsBookingListParser, hallsListParser } from "./hallsParser";

const hallsApis = createApi({
    reducerPath: "hallsApis",
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
    tagTypes: ["Hall", "HallBooking"],
    endpoints: (build) => ({
        getHallList: build.query({
            query: (params) => ({
                url: "/halls/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => hallsListParser(response),
            providesTags: ["Hall"],
        }),
        getHallDropdown: build.query({
            query: () => ({
                url: "/halls/list",
                method: "GET",
                params: {
                    limit: 1000,
                    pageNo: 0,
                    active: "true",
                },
            }),
            transformResponse: (response) => response,
            providesTags: ["Hall"],
        }),
        addNewHall: build.mutation({
            query: (payload) => ({
                url: "/halls",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Hall"],
        }),
        updateHall: build.mutation({
            query: (payload) => ({
                url: "/halls",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Hall"],
        }),
        updateStatus: build.mutation({
            query: (payload) => ({
                url: "/halls/status",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Hall"],
        }),
        deleteHall: build.mutation({
            query: (params) => ({
                url: "/halls",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Hall"],
        }),

        // bookings records
        getHallBookingList: build.query({
            query: (params) => ({
                url: "/halls/hall-booking/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => hallsBookingListParser(response),
            providesTags: ["HallBooking"],
        }),
        addNewHallBooking: build.mutation({
            query: (payload) => ({
                url: "/halls/hall-booking",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["HallBooking"],
        }),
        updateHallBooking: build.mutation({
            query: (payload) => ({
                url: "/halls/hall-booking",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["HallBooking"],
        }),
        deleteHallBooking: build.mutation({
            query: (params) => ({
                url: "/halls/hall-booking",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["HallBooking"],
        }),
        updateHallBookingStatus: build.mutation({
            query: (params) => ({
                url: "/halls/hall-booking",
                method: "PATCH",
                params: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["HallBooking"],
        }),
        fetchHallsBooked: build.query({
            query: (params) => ({
                url: "/halls/get-booked-halls-dates",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["HallBooking"],
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useGetHallListQuery,
    useGetHallDropdownQuery,
    useAddNewHallMutation,
    useUpdateHallMutation,
    useUpdateStatusMutation,
    useDeleteHallMutation,

    // bookings records
    useGetHallBookingListQuery,
    useAddNewHallBookingMutation,
    useUpdateHallBookingMutation,
    useDeleteHallBookingMutation,
    useUpdateHallBookingStatusMutation,
    useFetchHallsBookedQuery,
} = hallsApis;
export default hallsApis;
