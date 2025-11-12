import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../helpers/constants";
import { getCookie } from "../../helpers/cookies";
import { paymentHistoryParser } from "./commonParser";

const commonApis = createApi({
    reducerPath: "commonApis",
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
    tagTypes: ["PaymentHistory", "DbBackup", "HomePageCms", "AboutPageCms", "SettingsDefaultCms"],
    endpoints: (build) => ({
        getDashboardCount: build.query({
            query: (params) => ({
                url: "/common/dashboard-count",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
        }),
        handleImageUpload: build.mutation({
            query: (payload) => ({
                url: "/common/upload-single-image",
                method: "POST",
                body: payload,
                formData: true,
            }),
            transformResponse: (response) => response.result,
        }),
        handleMultipleImageUpload: build.mutation({
            query: (payload) => ({
                url: "/common/upload-multiple-image",
                method: "POST",
                body: payload,
                formData: true,
            }),
            transformResponse: (response) => response.result,
        }),
        getPaymentHistoryList: build.query({
            query: (params) => ({
                url: "/payment/payment-list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => paymentHistoryParser(response),
            providesTags: ["PaymentHistory"],
            keepUnusedDataFor: 5,
        }),
        getContactLeadsList: build.query({
            query: (params) => ({
                url: "/common/contact-us",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
        }),

        // database backup and fetch
        getDatabaseBackupList: build.query({
            query: (params) => ({
                url: "/common/list_db",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["DbBackup"],
        }),
        generateNewDatabaseBackup: build.mutation({
            query: () => ({
                url: "/common/export_db",
                method: "get",
            }),
            transformResponse: (response) => response.result,
            invalidatesTags: ["DbBackup"],
        }),
        deleteDatabaseBackup: build.mutation({
            query: (params) => ({
                url: "/common/export_db",
                method: "delete",
                params: params,
            }),
            transformResponse: (response) => response.result,
            invalidatesTags: ["DbBackup"],
        }),

        // home page cms
        getHomePageCms: build.query({
            query: (params) => ({
                url: "/common/home-page-cms",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["HomePageCms"],
        }),
        updateHomePageCms: build.mutation({
            query: (payload) => ({
                url: "/common/home-page-cms",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.result,
            invalidatesTags: ["HomePageCms"],
        }),

        // about page cms
        getAboutPageCms: build.query({
            query: (params) => ({
                url: "/common/about-page-cms",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["AboutPageCms"],
        }),
        updateAboutPageCms: build.mutation({
            query: (payload) => ({
                url: "/common/about-page-cms",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.result,
            invalidatesTags: ["AboutPageCms"],
        }),

        // settings default page cms
        getSettingsDefaultCms: build.query({
            query: (params) => ({
                url: "/common/settings-default",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["SettingsDefaultCms"],
        }),
        updateSettingsDefaultCms: build.mutation({
            query: (payload) => ({
                url: "/common/settings-default",
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.result,
            invalidatesTags: ["SettingsDefaultCms"],
        }),
    }),
});

export const {
    useGetDashboardCountQuery,
    useHandleImageUploadMutation,
    useHandleMultipleImageUploadMutation,
    useGetPaymentHistoryListQuery,
    useGetContactLeadsListQuery,

    // database backup and fetch
    useGetDatabaseBackupListQuery,
    useGenerateNewDatabaseBackupMutation,
    useDeleteDatabaseBackupMutation,

    // home page cms
    useGetHomePageCmsQuery,
    useUpdateHomePageCmsMutation,
    useGetAboutPageCmsQuery,
    useUpdateAboutPageCmsMutation,

    // settings default page cms
    useGetSettingsDefaultCmsQuery,
    useUpdateSettingsDefaultCmsMutation,
} = commonApis;
export default commonApis;
