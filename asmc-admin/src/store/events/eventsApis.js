import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../helpers/constants";
import { getCookie } from "../../helpers/cookies";
import { eventsListParser, eventsBookingListParser } from "./eventsParser";

const eventsApis = createApi({
    reducerPath: "eventsApis",
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
    tagTypes: ["Event", "EventBooking"],
    endpoints: (build) => ({
        getEventList: build.query({
            query: (params) => ({
                url: "/events/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => eventsListParser(response),
            providesTags: ["Event"],
        }),
        getEventDropdown: build.query({
            query: (params) => ({
                url: "/events/dropdown",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => {
                return response.result.map((item) => ({
                    value: item._id,
                    label: item.event_name,
                }));
            },
            providesTags: ["Event"],
        }),
        addNewEvent: build.mutation({
            query: (payload) => ({
                url: "/events",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Event"],
        }),
        updateEvent: build.mutation({
            query: (payload) => ({
                url: "/events",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Event"],
        }),
        updateStatus: build.mutation({
            query: (payload) => ({
                url: "/events/status",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Event"],
        }),
        deleteEvent: build.mutation({
            query: (params) => ({
                url: "/events",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Event"],
        }),

        // bookings records
        getEventBookingList: build.query({
            query: (params) => ({
                url: "/events/event-booking/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => eventsBookingListParser(response),
            providesTags: ["EventBooking"],
        }),
        addNewEventBooking: build.mutation({
            query: (payload) => ({
                url: "/events/event-booking",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["EventBooking"],
        }),
        updateEventBooking: build.mutation({
            query: (payload) => ({
                url: "/events/event-booking",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["EventBooking"],
        }),
        deleteEventBooking: build.mutation({
            query: (params) => ({
                url: "/events/event-booking",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["EventBooking"],
        }),
        updateEventBookingStatus: build.mutation({
            query: (params) => ({
                url: "/events/event-booking",
                method: "PATCH",
                params: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["EventBooking"],
        }),
    }),
});

export const {
    useGetEventListQuery,
    useGetEventDropdownQuery,
    useAddNewEventMutation,
    useUpdateEventMutation,
    useUpdateStatusMutation,
    useDeleteEventMutation,

    // bookings records
    useGetEventBookingListQuery,
    useAddNewEventBookingMutation,
    useUpdateEventBookingMutation,
    useDeleteEventBookingMutation,
    useUpdateEventBookingStatusMutation,
} = eventsApis;
export default eventsApis;
