import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../helpers/constants";
import { getCookie } from "../../helpers/cookies";

export const documentationApi = createApi({
    reducerPath: "documentationApi",
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
    tagTypes: ["Documentation"],
    endpoints: (builder) => ({
        // Get all documentation
        getDocumentationList: builder.query({
            query: () => "/documentation",
            providesTags: ["Documentation"],
        }),

        // Get documentation component overview
        getDocumentationComponent: builder.query({
            query: (component) => `/documentation/${component}`,
            providesTags: ["Documentation"],
        }),

        // Get specific documentation file
        getDocumentationFile: builder.query({
            query: ({ component, filename }) => `/documentation/${component}/${filename}`,
            providesTags: ["Documentation"],
        }),

        // Download documentation file
        downloadDocumentation: builder.mutation({
            query: ({ component, filename, format = "md" }) => ({
                url: `/documentation/${component}/${filename}/download`,
                method: "GET",
                params: { format },
                responseHandler: async (response) => {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${component}_${filename}.${format}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    return { success: true };
                },
            }),
            invalidatesTags: ["Documentation"],
        }),

        // Search documentation
        searchDocumentation: builder.query({
            query: ({ query, component }) => ({
                url: "/documentation/search",
                params: { q: query, component },
            }),
            providesTags: ["Documentation"],
        }),
    }),
});

export const {
    useGetDocumentationListQuery,
    useGetDocumentationComponentQuery,
    useGetDocumentationFileQuery,
    useDownloadDocumentationMutation,
    useSearchDocumentationQuery,
} = documentationApi;
