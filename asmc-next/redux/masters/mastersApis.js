import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { activityParser, facilityParser, parseBanner } from "./mastersParser";
import { BaseUrl } from "@/utils/constants";
import { getAuthToken } from "@/utils/helper";

const mastersApis = createApi({
    reducerPath: "mastersApis",
    baseQuery: fetchBaseQuery({
        baseUrl: BaseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = getAuthToken();
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    keepUnusedDataFor: 30,
    tagTypes: [
        "Facility",
        "Activity",
        "Gallery",
        "Banner",
        "Faqs",
        "Notices",
        "GalleryCategory",
        "Events",
        "Testimonials",
    ],
    endpoints: (build) => ({
        fetchBanner: build.query({
            query: (params) => ({
                url: BaseUrl + "/masters/banner/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => parseBanner(response),
            providesTags: ["Banner"],
            keepUnusedDataFor: 5,
        }),
        fetchFacilityList: build.query({
            query: (params) => ({
                url: BaseUrl + "/masters/facility/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => facilityParser(response),
            providesTags: ["Facility"],
            keepUnusedDataFor: 5,
        }),
        fetchActivityList: build.query({
            query: (params) => ({
                url: BaseUrl + "/activity/active-list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => activityParser(response),
            providesTags: ["Activity"],
            keepUnusedDataFor: 5,
        }),
        fetchSingleActivity: build.query({
            query: (params) => ({
                url: BaseUrl + "/activity",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response?.result,
        }),
        fetchHallsList: build.query({
            query: (params) => ({
                url: BaseUrl + "/halls/active",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => activityParser(response),
            providesTags: ["Activity"],
            keepUnusedDataFor: 5,
        }),
        fetchHallsBooked: build.query({
            query: (params) => ({
                url: BaseUrl + "/halls/get-booked-halls-dates",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => activityParser(response),
            providesTags: ["Activity"],
            keepUnusedDataFor: 5,
        }),
        fetchSingleHall: build.query({
            query: (params) => ({
                url: BaseUrl + "/halls",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response?.result,
        }),
        fetchEventsList: build.query({
            query: (params) => ({
                url: BaseUrl + "/events/list",
                method: "GET",
                params: { active: true, ...params },
            }),
            transformResponse: (response) => response.result,
            providesTags: ["Events"],
            keepUnusedDataFor: 5,
        }),
        fetchSingleEvent: build.query({
            query: (params) => ({
                url: BaseUrl + "/events",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response?.result,
        }),
        fetchGallery: build.query({
            query: (params) => ({
                url: BaseUrl + "/masters/gallery",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response?.result,
            providesTags: ["Gallery"],
            keepUnusedDataFor: 5,
        }),
        fetchGalleryCategory: build.query({
            query: (params) => ({
                url: BaseUrl + "/masters/gallery-category",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["GalleryCategory"],
            keepUnusedDataFor: 5,
        }),
        fetchFaqs: build.query({
            query: (params) => ({
                url: BaseUrl + "/masters/faqs/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["Faqs"],
            keepUnusedDataFor: 5,
        }),
        fetchFaqsCategories: build.query({
            query: () => ({
                url: BaseUrl + "/masters/faqs/categories",
                method: "GET",
            }),
            transformResponse: (response) => response.result,
            providesTags: ["Faqs"],
            keepUnusedDataFor: 5,
        }),
        fetchNotices: build.query({
            query: (params) => ({
                url: BaseUrl + "/masters/notice/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["Notices"],
            keepUnusedDataFor: 5,
        }),
        fetchTestimonials: build.query({
            query: (params) => ({
                url: BaseUrl + "/masters/testimonials/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["Testimonials"],
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useFetchBannerQuery,
    useFetchFacilityListQuery,
    useFetchActivityListQuery,
    useFetchSingleActivityQuery,
    useFetchHallsListQuery,
    useFetchHallsBookedQuery,
    useFetchSingleHallQuery,
    useFetchEventsListQuery,
    useFetchSingleEventQuery,
    useFetchGalleryQuery,
    useFetchGalleryCategoryQuery,
    useFetchFaqsQuery,
    useFetchFaqsCategoriesQuery,
    useFetchNoticesQuery,
    useFetchTestimonialsQuery,
} = mastersApis;
export default mastersApis;
