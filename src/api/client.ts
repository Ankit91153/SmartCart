import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    const customError = {
      message:
        error?.response?.data?.message ||
        error.message ||
        'Something went wrong',
      status: error?.response?.status || 500,
    };
    return Promise.reject(customError);
  },
);
