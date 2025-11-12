import { QueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../helpers/constants";
import { axios } from "../helpers/axios";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Custom fetch function with authentication using axios
export const authenticatedFetch = async (url, options = {}) => {
  const { method = "GET", body, ...restOptions } = options;

  const config = {
    method,
    ...restOptions,
  };

  if (body) {
    config.data = body;
  }

  return axios(url, config);
};
