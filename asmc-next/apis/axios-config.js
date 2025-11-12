'use client'

import { BaseUrl } from '@/utils/constants';
import { getAuthToken } from '@/utils/helper';
import axios from 'axios';

// Default config options
const defaultOptions = {
    baseURL: BaseUrl,
    headers: {
        Authorization: `Bearer ${getAuthToken()}`,
    },
};

// Create instance
export const server = axios.create(defaultOptions);