import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseUrl } from "@/utils/constants";

import { getAuthToken } from "@/utils/helper";

const authApis = createApi({
    reducerPath: "authApis",
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
    tagTypes: ["Member", "Auth", "GuestEvent"],
    endpoints: (build) => ({
        fetchSingleMember: build.query({
            query: (params) => ({
                url: BaseUrl + "/members",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response?.result,
            providesTags: ["Member"],
            keepUnusedDataFor: 5,
        }),
        fetchAuthUser: build.query({
            query: (params) => ({
                url: BaseUrl + "/auth/me",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response?.result,
            providesTags: ["Auth"],
            keepUnusedDataFor: 5,
        }),
        fetchGuestBooking: build.query({
            query: (params) => ({
                url: BaseUrl + "/events/guest-event-booking",
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => response?.result,
            providesTags: ["GuestEvent"],
            keepUnusedDataFor: 5,
        }),
    }),
});

export const { useFetchSingleMemberQuery, useFetchAuthUserQuery, useFetchGuestBookingQuery } = authApis;
export default authApis;
