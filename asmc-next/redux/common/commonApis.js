import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { recordsParser, videoParser, memberParser } from "./commonParser";
import { BaseUrl } from "@/utils/constants";

const commonApis = createApi({
    reducerPath: "commonApis",
    baseQuery: fetchBaseQuery({}),
    keepUnusedDataFor: 30,
    tagTypes: ["PhotoGallery", "VideoGallery", "Committees", "Members", "Settings"],
    endpoints: (build) => ({
        fetchPhotoGallery: build.query({
            query: (params) => ({
                url: BaseUrl + "/masters/gallery",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => recordsParser(response),
            providesTags: ["PhotoGallery"],
            keepUnusedDataFor: 5,
        }),
        fetchVideoGallery: build.query({
            query: (params) => ({
                url: BaseUrl + "/masters/gallery",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => videoParser(response),
            providesTags: ["VideoGallery"],
            keepUnusedDataFor: 5,
        }),
        fetchCommittessList: build.query({
            query: (params) => ({
                url: BaseUrl + "/sanstha/members/committees",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => memberParser(response),
            providesTags: ["Committees"],
            keepUnusedDataFor: 5,
        }),
        fetchMembersList: build.query({
            query: (params) => ({
                url: BaseUrl + "/sanstha/members/list",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => memberParser(response),
            providesTags: ["Members"],
            keepUnusedDataFor: 5,
        }),
        insertContactUs: build.mutation({
            query: (body) => ({
                url: BaseUrl + "/common/contact-us",
                method: "POST",
                body: body,
            }),
        }),

        // home page cms
        getHomePageCms: build.query({
            query: (params) => ({
                url: BaseUrl + "/common/home-page-cms",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["HomePageCms"],
        }),
        getAboutPageCms: build.query({
            query: (params) => ({
                url: BaseUrl + "/common/about-page-cms",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["AboutPageCms"],
        }),
        getSettings: build.query({
            query: (params) => ({
                url: BaseUrl + "/common/settings-default",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response.result,
            providesTags: ["Settings"],
        }),
    }),
});

export const {
    useFetchPhotoGalleryQuery,
    useFetchVideoGalleryQuery,
    useInsertContactUsMutation,
    useFetchMembersListQuery,
    useFetchCommittessListQuery,
    useGetHomePageCmsQuery,
    useGetAboutPageCmsQuery,
    useGetSettingsQuery,
} = commonApis;
export default commonApis;
