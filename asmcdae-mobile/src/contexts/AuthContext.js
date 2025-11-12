import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useGetAuthData} from '../hooks/useAuth';
import axiosInterceptor, {updateAxiosToken} from '../helpers/axios';
import {axios} from '../helpers/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({children}) => {
  console.log('[AuthContext] AuthProvider rendering');
  const [token, setToken] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const {refetch: fetchAuthData} = useGetAuthData();

  // Initialize axios interceptor
  useEffect(() => {
    axiosInterceptor();
  }, []);

  // Update axios token when token state changes
  useEffect(() => {
    if (token) {
      updateAxiosToken();
    }
  }, [token]);

  // Function to fetch auth data directly
  const fetchAuthDataDirectly = async () => {
    try {
      const response = await axios.get('/auth/me');
      if (response?.success) {
        setAuthData(response.result);
        return response;
      }
    } catch (error) {
      console.warn('Failed to fetch auth data:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🟢 AuthContext: Checking for stored token...');
        const storedToken = await AsyncStorage.getItem('asmc_token');
        console.log(
          '🟢 AuthContext: Stored token found:',
          storedToken ? 'YES' : 'NO',
        );
        console.log('🟢 AuthContext: Token value:', storedToken);

        if (storedToken) {
          console.log('🟢 AuthContext: Setting auth state with stored token');
          setToken(storedToken);
          setIsAuth(true);

          // Try to fetch auth data, but don't fail if it doesn't work
          try {
            await fetchAuthDataDirectly();
          } catch (authError) {
            console.warn('Failed to fetch auth data on startup:', authError);
            // Don't logout, just continue without auth data
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async newToken => {
    try {
      console.log('🟢 AuthContext: Setting token in AsyncStorage');
      console.log('🟢 AuthContext: Token to store:', newToken);
      console.log('🟢 AuthContext: Token type:', typeof newToken);
      console.log('🟢 AuthContext: Token length:', newToken?.length);

      // Test AsyncStorage with a simple value first
      await AsyncStorage.setItem('test_key', 'test_value');
      const testValue = await AsyncStorage.getItem('test_key');
      console.log('🟢 AuthContext: AsyncStorage test - stored:', testValue);

      await AsyncStorage.setItem('asmc_token', newToken);

      // Verify the token was stored
      const storedToken = await AsyncStorage.getItem('asmc_token');
      console.log('🟢 AuthContext: Stored token verification:', storedToken);
      console.log('🟢 AuthContext: Stored token type:', typeof storedToken);
      console.log('🟢 AuthContext: Stored token length:', storedToken?.length);

      console.log('🟢 AuthContext: Updating state');
      setToken(newToken);
      setIsAuth(true);

      // Small delay to ensure axios headers are updated
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('🟢 AuthContext: Fetching auth data');
      // Try to fetch auth data, but don't fail if it doesn't work
      try {
        await fetchAuthDataDirectly();
        console.log('🟢 AuthContext: Auth data fetched successfully');
      } catch (authError) {
        console.log(
          '🟡 AuthContext: Failed to fetch auth data after login:',
          authError,
        );
        // Don't throw error, login is still successful
      }

      console.log('🟢 AuthContext: Login completed successfully');
    } catch (error) {
      console.log('🔴 AuthContext: Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🟢 AuthContext: Logging out user');
      await AsyncStorage.removeItem('asmc_token');
      setToken(null);
      setIsAuth(false);
      setAuthData(null);
      console.log('🟢 AuthContext: Logout completed');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateAuthData = newAuthData => {
    setAuthData(newAuthData);
  };

  const value = {
    token,
    isAuth,
    authData,
    isLoading,
    setIsAuth,
    setAuthData,
    login,
    logout,
    updateAuthData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
