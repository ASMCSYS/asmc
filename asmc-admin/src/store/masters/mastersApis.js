import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../helpers/constants";
import { getCookie } from "../../helpers/cookies";
import {
    activeLocationParser,
    parentLocationParser,
    mastersListParser,
    bannerListParser,
    planListParser,
    batchListParser,
    categoryParser,
    teamsParser,
    activeCategoryParser,
    parentCategoryParser,
    faqsListParser,
    testimonialsListParser,
    noticeListParser,
    feesCategoriesListParser,
} from "./mastersParser";

const mastersApis = createApi({
    reducerPath: "mastersApis",
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
    tagTypes: ["Location", "Category", "Gallery", "Banner", "Plans", "Teams", "FeesCategories", "Faqs", "Notice"],
    endpoints: (build) => ({
        // location
        getActiveLocationList: build.query({
            query: (params) => ({
                url: "/masters/location/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => activeLocationParser(response),
            providesTags: ["Location"],
            keepUnusedDataFor: 5,
        }),
        getLocationList: build.query({
            query: (params) => ({
                url: "/masters/location/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => mastersListParser(response),
            providesTags: ["Location"],
            keepUnusedDataFor: 5,
        }),
        getParentLocationList: build.query({
            query: (params) => ({
                url: "/masters/location/parent",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => parentLocationParser(response),
        }),
        addNewLocation: build.mutation({
            query: (payload) => ({
                url: "/masters/location",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Location"],
        }),
        updateLocation: build.mutation({
            query: (payload) => ({
                url: "/masters/location",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Location"],
        }),
        deleteLocation: build.mutation({
            query: (params) => ({
                url: "/masters/location",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Location"],
        }),
        // category
        getActiveCategoryList: build.query({
            query: (params) => ({
                url: "/masters/category/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => activeCategoryParser(response),
            providesTags: ["Category"],
            keepUnusedDataFor: 5,
        }),
        getCategoryList: build.query({
            query: (params) => ({
                url: "/masters/category/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => categoryParser(response),
            providesTags: ["Category"],
            keepUnusedDataFor: 5,
        }),
        getParentCategoryList: build.query({
            query: (params) => ({
                url: "/masters/category/parent",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => parentCategoryParser(response),
        }),
        addNewCategory: build.mutation({
            query: (payload) => ({
                url: "/masters/category",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Category"],
        }),
        updateCategory: build.mutation({
            query: (payload) => ({
                url: "/masters/category",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Category"],
        }),
        deleteCategory: build.mutation({
            query: (params) => ({
                url: "/masters/category",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Category"],
        }),
        // gallery
        getGalleryList: build.query({
            query: (params) => ({
                url: "/masters/gallery",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["Gallery"],
            keepUnusedDataFor: 5,
        }),
        addNewGallery: build.mutation({
            query: (payload) => ({
                url: "/masters/gallery",
                method: "POST",
                body: payload,
                formData: true,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Gallery"],
        }),
        addNewGalleryDrive: build.mutation({
            query: (payload) => ({
                url: "/masters/gallery-drive",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Gallery"],
        }),
        deleteGallery: build.mutation({
            query: (params) => ({
                url: "/masters/gallery",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Gallery"],
        }),
        // banner
        getBannerList: build.query({
            query: (params) => ({
                url: "/masters/banner/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => bannerListParser(response),
            providesTags: ["Banner"],
            keepUnusedDataFor: 5,
        }),
        addNewBanner: build.mutation({
            query: (payload) => ({
                url: "/masters/banner",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Banner"],
        }),
        updateBanner: build.mutation({
            query: (payload) => ({
                url: "/masters/banner",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Banner"],
        }),
        deleteBanner: build.mutation({
            query: (params) => ({
                url: "/masters/banner",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Banner"],
        }),
        // plan
        getPlansList: build.query({
            query: (params) => ({
                url: "/plans/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => planListParser(response),
            providesTags: ["Plans"],
            keepUnusedDataFor: 5,
        }),
        addNewPlans: build.mutation({
            query: (payload) => ({
                url: "/plans",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Plans"],
        }),
        updatePlans: build.mutation({
            query: (payload) => ({
                url: "/plans",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Plans"],
        }),
        deletePlans: build.mutation({
            query: (params) => ({
                url: "/plans",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Plans"],
        }),
        // batch
        getBatchList: build.query({
            query: (params) => ({
                url: "/masters/batch/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => batchListParser(response),
            providesTags: ["Batch"],
            keepUnusedDataFor: 5,
        }),
        getBatchDropdown: build.query({
            query: (params) => ({
                url: "/masters/batch/dropdown",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["Batch"],
            keepUnusedDataFor: 5,
        }),
        addNewBatch: build.mutation({
            query: (payload) => ({
                url: "/masters/batch",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Batch"],
        }),
        updateBatch: build.mutation({
            query: (payload) => ({
                url: "/masters/batch",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Batch"],
        }),
        deleteBatch: build.mutation({
            query: (params) => ({
                url: "/masters/batch",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Batch"],
        }),
        // teams
        getTeamsList: build.query({
            query: (params) => ({
                url: "/masters/teams/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => teamsParser(response),
            providesTags: ["Teams"],
            keepUnusedDataFor: 5,
        }),
        addNewTeams: build.mutation({
            query: (payload) => ({
                url: "/masters/teams",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Teams"],
        }),
        updateTeams: build.mutation({
            query: (payload) => ({
                url: "/masters/teams",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Teams"],
        }),
        deleteTeams: build.mutation({
            query: (params) => ({
                url: "/masters/teams",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Teams"],
        }),
        // faqs
        getFaqsList: build.query({
            query: (params) => ({
                url: "/masters/faqs/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => faqsListParser(response),
            providesTags: ["Faqs"],
            keepUnusedDataFor: 5,
        }),
        getFaqsCategories: build.query({
            query: () => ({
                url: "/masters/faqs/categories",
                method: "GET",
            }),
            transformResponse: (response) => response.result,
            providesTags: ["Faqs"],
            keepUnusedDataFor: 5,
        }),
        addNewFaqs: build.mutation({
            query: (payload) => ({
                url: "/masters/faqs",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Faqs"],
        }),
        updateFaqs: build.mutation({
            query: (payload) => ({
                url: "/masters/faqs",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Faqs"],
        }),
        deleteFaqs: build.mutation({
            query: (params) => ({
                url: "/masters/faqs",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Faqs"],
        }),
        // testimonials
        getTestimonialsList: build.query({
            query: (params) => ({
                url: "/masters/testimonials/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => testimonialsListParser(response),
            providesTags: ["Testimonials"],
            keepUnusedDataFor: 5,
        }),
        addNewTestimonials: build.mutation({
            query: (payload) => ({
                url: "/masters/testimonials",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Testimonials"],
        }),
        updateTestimonials: build.mutation({
            query: (payload) => ({
                url: "/masters/testimonials",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Testimonials"],
        }),
        deleteTestimonials: build.mutation({
            query: (params) => ({
                url: "/masters/testimonials",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Testimonials"],
        }),
        // notice
        getNoticeList: build.query({
            query: (params) => ({
                url: "/masters/notice/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => noticeListParser(response),
            providesTags: ["Notice"],
            keepUnusedDataFor: 5,
        }),
        getNoticeSingle: build.query({
            query: (params) => ({
                url: "/masters/notice",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
        }),
        addNewNotice: build.mutation({
            query: (payload) => ({
                url: "/masters/notice",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Notice"],
        }),
        updateNotice: build.mutation({
            query: (payload) => ({
                url: "/masters/notice",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Notice"],
        }),
        deleteNotice: build.mutation({
            query: (params) => ({
                url: "/masters/notice",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["Notice"],
        }),
        // fees categories
        getFeesCategoriesList: build.query({
            query: (params) => ({
                url: "/masters/fees-category/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => feesCategoriesListParser(response),
            providesTags: ["FeesCategories"],
            keepUnusedDataFor: 5,
        }),
        getFeesCategoriesSingle: build.query({
            query: (params) => ({
                url: "/masters/fees-category",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
        }),
        addNewFeesCategories: build.mutation({
            query: (payload) => ({
                url: "/masters/fees-category",
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["FeesCategories"],
        }),
        updateFeesCategories: build.mutation({
            query: (payload) => ({
                url: "/masters/fees-category",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["FeesCategories"],
        }),
        deleteFeesCategories: build.mutation({
            query: (params) => ({
                url: "/masters/fees-category",
                method: "DELETE",
                params: params,
            }),
            transformResponse: (response) => response.data,
            transformErrorResponse: (response) => response.data,
            invalidatesTags: ["FeesCategories"],
        }),
    }),
});

export const {
    useGetActiveLocationListQuery,
    useGetParentLocationListQuery,
    useGetLocationListQuery,
    useAddNewLocationMutation,
    useUpdateLocationMutation,
    useDeleteLocationMutation,
    useGetActiveCategoryListQuery,
    useGetParentCategoryListQuery,
    useGetCategoryListQuery,
    useAddNewCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useGetTeamsListQuery,
    useAddNewTeamsMutation,
    useUpdateTeamsMutation,
    useDeleteTeamsMutation,
    useGetGalleryListQuery,
    useAddNewGalleryMutation,
    useAddNewGalleryDriveMutation,
    useDeleteGalleryMutation,
    useGetBannerListQuery,
    useAddNewBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
    useGetPlansListQuery,
    useAddNewPlansMutation,
    useUpdatePlansMutation,
    useDeletePlansMutation,
    useGetBatchListQuery,
    useGetBatchDropdownQuery,
    useAddNewBatchMutation,
    useUpdateBatchMutation,
    useDeleteBatchMutation,
    useGetFaqsListQuery,
    useGetFaqsCategoriesQuery,
    useAddNewFaqsMutation,
    useUpdateFaqsMutation,
    useDeleteFaqsMutation,
    useGetTestimonialsListQuery,
    useAddNewTestimonialsMutation,
    useUpdateTestimonialsMutation,
    useDeleteTestimonialsMutation,
    useGetNoticeListQuery,
    useGetNoticeSingleQuery,
    useAddNewNoticeMutation,
    useUpdateNoticeMutation,
    useDeleteNoticeMutation,
    useGetFeesCategoriesListQuery,
    useGetFeesCategoriesSingleQuery,
    useAddNewFeesCategoriesMutation,
    useUpdateFeesCategoriesMutation,
    useDeleteFeesCategoriesMutation,
} = mastersApis;
export default mastersApis;
