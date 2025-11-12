import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "../helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../helpers/constants";

// Common API hooks
export const useGetHomeBanner = () => {
  return useQuery({
    queryKey: ["home", "banner"],
    queryFn: () =>
      axios.get(
        "/masters/banner/list?sortBy=1&sortField=createdAt&type=home_page"
      ),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFetchNextPlan = (params) => {
  return useQuery({
    queryKey: ["plans", "next", params],
    queryFn: () =>
      axios.get(`/plans/get-next-plan?${new URLSearchParams(params)}`),
    enabled: !!params,
  });
};

export const useHandleImageUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const token = await AsyncStorage.getItem("asmc_token");
      const formData = new FormData();

      // Append file
      formData.append("file", {
        uri: payload.uri,
        type: payload.type || "image/jpeg",
        name: payload.name || "image.jpg",
      });

      const response = await fetch(`${baseUrl}/common/upload-single-image`, {
        method: "POST",
        headers: {
          Authorization: `BEARER ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
  });
};

export const useGetSettings = (params) => {
  return useQuery({
    queryKey: ["settings", params],
    queryFn: () =>
      axios.get(`/common/settings-default?${new URLSearchParams(params)}`),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGetAppStats = (params) => {
  return useQuery({
    queryKey: ["stats", params],
    queryFn: () =>
      axios.get(`/common/app-stats?${new URLSearchParams(params)}`),
    staleTime: 5 * 60 * 1000,
  });
};
