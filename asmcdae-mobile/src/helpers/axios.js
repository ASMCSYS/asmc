import * as coreAxios from 'axios';
import {baseUrl} from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Create axios instance without the Authorization header initially
export const axios = coreAxios.default.create({
  baseURL: baseUrl,
  headers: {
    common: {},
  },
});

// Flag to track if interceptors are already initialized
let interceptorsInitialized = false;

// Function to get the token from AsyncStorage
const getTokenFromStorage = async () => {
  try {
    const token = await AsyncStorage.getItem('asmc_token');
    return token ? token : null;
  } catch (error) {
    console.log('🔴 Error fetching token from storage', error);
    return null;
  }
};

// Function to update axios default headers with token
export const updateAxiosToken = async () => {
  const token = await getTokenFromStorage();
  if (token) {
    axios.defaults.headers.common.Authorization = `BEARER ${token}`;
    console.log('🟢 Axios token updated successfully');
  } else {
    delete axios.defaults.headers.common.Authorization;
    console.log('🟡 Axios token removed');
  }
};

const axiosInterceptor = () => {
  // Only initialize interceptors once
  if (interceptorsInitialized) {
    console.log('🟡 Axios interceptors already initialized, skipping...');
    return;
  }

  console.log('🟢 Initializing axios interceptors');
  interceptorsInitialized = true;

  // Request interceptor
  axios.interceptors.request.use(
    async function (config) {
      console.log('🟢 Making request to:', config.url);
      const token = await getTokenFromStorage(); // Get token before request
      if (token) {
        config.headers.Authorization = `BEARER ${token}`; // Add token to headers
        console.log('🟢 Token added to request headers');
      } else {
        console.log('🟡 No token found for request');
      }
      return config;
    },
    function (error) {
      // Handle request error
      console.log('🔴 Request interceptor error:', error);
      return Promise.reject(error);
    },
  );

  // Response interceptor
  axios.interceptors.response.use(
    function (response) {
      console.log(
        '🟢 Response received:',
        response.status,
        response?.config?.url || 'unknown URL',
      );
      console.log('🟢 Response data:', JSON.stringify(response.data, null, 2));
      // Return the response data directly
      return response.data;
    },
    async function (error) {
      // Handle response error
      console.log('🔴 Axios response error:', error.message);
      console.log('🔴 Error status:', error?.response?.status);
      console.log('🔴 Error URL:', error?.config?.url);

      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: error?.response?.data?.message || error.message,
        visibilityTime: 3000,
      });

      if (error.response?.status === 403) {
        // Handle session expiry or invalid token scenario
        try {
          // Optionally, you can clear the token on 403 response
          await AsyncStorage.removeItem('asmc_token');
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error',
            text2: 'Session expired. Please login again.',
            visibilityTime: 3000,
          });
          // Redirect the user to the login screen
        } catch (err) {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error',
            text2: 'Session expired. Please login again.',
            visibilityTime: 3000,
          });
        }
      }

      return Promise.reject(error);
    },
  );
};

export default axiosInterceptor;
