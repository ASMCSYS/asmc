import { BaseUrl } from "@/utils/constants";
import { server } from "./axios-config";

export const fetchEvents = async (params = { active: "true" }) => {
  const res = await server.get(`${BaseUrl}/events/list`, { params: params });
  return res.data;
};
