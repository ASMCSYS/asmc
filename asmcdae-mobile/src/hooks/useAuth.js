import {useState, useEffect} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {axios} from '../helpers/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth state management
export const useAuthState = () => {
  const [token, setToken] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = await AsyncStorage.getItem('asmc_token');
      if (storedToken) {
        setToken(storedToken);
        setIsAuth(true);
      }
    };
    checkAuth();
  }, []);

  const login = async token => {
    await AsyncStorage.setItem('asmc_token', token);
    setToken(token);
    setIsAuth(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('asmc_token');
    setToken(null);
    setIsAuth(false);
    setAuthData(null);
  };

  return {
    token,
    isAuth,
    authData,
    setAuthData,
    login,
    logout,
  };
};

// Auth API hooks
export const useGetAuthData = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await axios.get('/auth/me');
      return response;
    },
    enabled: false, // Only fetch when explicitly called
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: data => axios.put('/auth/change-password', data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['auth']});
    },
  });
};

export const useGetMemberData = params => {
  return useQuery({
    queryKey: ['member', params],
    queryFn: () => axios.get(`/members?${new URLSearchParams(params)}`),
    enabled: !!params?._id,
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: body => axios.put('/members', body),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['member']});
      queryClient.invalidateQueries({queryKey: ['auth']});
    },
  });
};

export const useVerifyMember = () => {
  return useMutation({
    mutationFn: params =>
      axios.get(`/members/verify?${new URLSearchParams(params)}`),
  });
};
