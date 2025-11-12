import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../helpers/constants";
import { getCookie } from "../../helpers/cookies";
import { bookingListParser } from "./bookingParser";

const bookingApis = createApi({
    reducerPath: "bookingApis",
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
    tagTypes: ["Booking", "BookingSingle"],
    endpoints: (build) => ({
        getBookingList: build.query({
            query: (params) => ({
                url: "/bookings/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => bookingListParser(response),
            providesTags: ["Booking"],
        }),
        addNewBooking: build.mutation({
            query: (payload) => ({
                url: "/bookings",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Booking"],
        }),
        addNewBatchBooking: build.mutation({
            query: (payload) => ({
                url: "/bookings/batch-booking",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Booking"],
        }),
        updateBooking: build.mutation({
            query: (payload) => ({
                url: "/bookings",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Booking"],
        }),
        updateStatus: build.mutation({
            query: (payload) => ({
                url: "/bookings/status",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Booking"],
        }),
        deleteBooking: build.mutation({
            query: (params) => ({
                url: "/bookings",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Booking"],
        }),
    }),
});

export const {
    useGetBookingListQuery,
    useAddNewBookingMutation,
    useAddNewBatchBookingMutation,
    useUpdateBookingMutation,
    useUpdateStatusMutation,
    useDeleteBookingMutation,
} = bookingApis;
export default bookingApis;
