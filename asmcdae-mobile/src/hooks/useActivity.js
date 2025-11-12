import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {axios} from '../helpers/axios';

// Activity API hooks
export const useGetTopActivity = () => {
  return useQuery({
    queryKey: ['activity', 'top'],
    queryFn: async () => {
      const response = await axios.get('/activity/top-activity');
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetActivityList = params => {
  return useQuery({
    queryKey: ['activity', 'list', params],
    queryFn: async () => {
      const response = await axios.get(
        `/activity/active-list?${new URLSearchParams(params)}`,
      );
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSingleActivity = id => {
  return useQuery({
    queryKey: ['activity', 'single', id],
    queryFn: async () => {
      const response = await axios.get(`/activity?activity_id=${id}`);
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Events API hooks
export const useGetEventsList = params => {
  return useQuery({
    queryKey: ['events', 'list', params],
    queryFn: async () => {
      const response = await axios.get(
        `/events/list?${new URLSearchParams(params)}`,
      );
      console.log(
        '🟢 [EVENTS_HOOK] Raw response:',
        JSON.stringify(response, null, 2),
      );
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSingleEvent = id => {
  return useQuery({
    queryKey: ['events', 'single', id],
    queryFn: async () => {
      const response = await axios.get(`/events?event_id=${id}`);
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Halls API hooks
export const useGetHallsList = params => {
  return useQuery({
    queryKey: ['halls', 'list', params],
    queryFn: async () => {
      const response = await axios.get(
        `/halls/list?${new URLSearchParams(params)}`,
      );
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSingleHall = id => {
  return useQuery({
    queryKey: ['halls', 'single', id],
    queryFn: async () => {
      const response = await axios.get(`/halls?hall_id=${id}`);
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
