# ASMC Frontend - API Integration Guide

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Application:** ASMC Frontend (Next.js)  
**API Base URL:** http://localhost:7055 (Development)  

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Configuration](#api-configuration)
4. [Core API Endpoints](#core-api-endpoints)
5. [Error Handling](#error-handling)
6. [State Management](#state-management)
7. [Best Practices](#best-practices)

---

## Overview

The ASMC Frontend integrates with the backend API using Axios for HTTP requests and Redux Toolkit for state management.

### Key Technologies
- **HTTP Client**: Axios
- **State Management**: Redux Toolkit
- **Authentication**: JWT tokens
- **Error Handling**: Centralized error management

---

## Authentication

### JWT Token Management

#### Token Storage
```javascript
// Store token in cookies
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

// Set token
setCookie('asmc_token', token, { maxAge: 24 * 60 * 60 }); // 24 hours

// Get token
const token = getCookie('asmc_token');

// Remove token
deleteCookie('asmc_token');
```

#### Authentication Flow
```javascript
// Login process
const login = async (credentials) => {
  try {
    const response = await axios.post('/auth/member-login', credentials);
    const { token } = response.data.result;
    
    // Store token
    setCookie('asmc_token', token);
    
    // Update Redux state
    dispatch(setUser(response.data.result.user));
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

---

## API Configuration

### Axios Configuration

#### Base Configuration
```javascript
// utils/axios.js
import axios from 'axios';
import { getCookie } from 'cookies-next';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7055',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getCookie('asmc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      deleteCookie('asmc_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## Core API Endpoints

### Authentication Endpoints

#### Member Login
```javascript
// POST /auth/member-login
const memberLogin = async (credentials) => {
  const response = await api.post('/auth/member-login', credentials);
  return response.data;
};
```

#### Get Current User
```javascript
// GET /auth/me
const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
```

### Member Management

#### Get Members List
```javascript
// GET /members
const getMembers = async (params = {}) => {
  const response = await api.get('/members', { params });
  return response.data;
};
```

#### Create Member
```javascript
// POST /members
const createMember = async (memberData) => {
  const response = await api.post('/members', memberData);
  return response.data;
};
```

### Booking Management

#### Get Bookings
```javascript
// GET /bookings
const getBookings = async (params = {}) => {
  const response = await api.get('/bookings', { params });
  return response.data;
};
```

#### Create Booking
```javascript
// POST /bookings
const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};
```

### Event Management

#### Get Events
```javascript
// GET /events
const getEvents = async (params = {}) => {
  const response = await api.get('/events', { params });
  return response.data;
};
```

#### Get Event Details
```javascript
// GET /events/:id
const getEventDetails = async (eventId) => {
  const response = await api.get(`/events/${eventId}`);
  return response.data;
};
```

---

## Error Handling

### Centralized Error Management

#### Error Handler
```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return { type: 'validation', message: data.message };
      case 401:
        return { type: 'unauthorized', message: 'Please login again' };
      case 403:
        return { type: 'forbidden', message: 'Access denied' };
      case 404:
        return { type: 'not_found', message: 'Resource not found' };
      case 500:
        return { type: 'server_error', message: 'Server error occurred' };
      default:
        return { type: 'unknown', message: 'An error occurred' };
    }
  } else if (error.request) {
    // Network error
    return { type: 'network', message: 'Network error occurred' };
  } else {
    // Other error
    return { type: 'unknown', message: error.message };
  }
};
```

#### Usage in Components
```javascript
// Component error handling
const [error, setError] = useState(null);

const fetchData = async () => {
  try {
    const data = await api.get('/endpoint');
    setData(data.result);
  } catch (error) {
    const errorInfo = handleApiError(error);
    setError(errorInfo);
  }
};
```

---

## State Management

### Redux Toolkit Setup

#### Store Configuration
```javascript
// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import memberReducer from './members/memberSlice';
import bookingReducer from './bookings/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: memberReducer,
    bookings: bookingReducer,
  },
});
```

#### Auth Slice
```javascript
// redux/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { memberLogin, getCurrentUser } from '../../apis/auth.api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await memberLogin(credentials);
      return response.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

---

## Best Practices

### API Call Patterns

#### Custom Hooks
```javascript
// hooks/useApi.js
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiCall();
        setData(response.result);
        setError(null);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};
```

#### Usage in Components
```javascript
// Component using custom hook
const MemberList = () => {
  const { data: members, loading, error } = useApi(
    () => getMembers({ page: 1, limit: 10 }),
    []
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {members?.map(member => (
        <div key={member._id}>{member.firstName}</div>
      ))}
    </div>
  );
};
```

### Form Handling

#### Form Submission
```javascript
// Form submission with validation
const handleSubmit = async (values, { setSubmitting, setErrors }) => {
  try {
    const response = await createMember(values);
    // Handle success
    router.push('/members');
  } catch (error) {
    const errorInfo = handleApiError(error);
    if (errorInfo.type === 'validation') {
      setErrors(errorInfo.errors);
    } else {
      // Show toast notification
      toast.error(errorInfo.message);
    }
  } finally {
    setSubmitting(false);
  }
};
```

---

## Environment Configuration

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:7055
NEXT_PUBLIC_APP_NAME=ASMC
NEXT_PUBLIC_VERSION=1.0.0
```

### API URL Configuration
```javascript
// config/api.js
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7055',
  timeout: 10000,
  retryAttempts: 3,
};
```

---

**Document Version**: 1.0.0  
**Last Updated**: January 2025  

---

*This guide provides comprehensive API integration instructions for the ASMC Frontend. For additional support, refer to the backend API documentation.* 