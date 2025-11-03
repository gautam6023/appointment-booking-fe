import axios, { type AxiosError } from "axios";

// Get API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default configuration
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - can be used to add auth tokens, logging, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add custom headers or perform actions before request is sent
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx triggers this function
    return response;
  },
  (error: AxiosError) => {
    // Any status codes outside the range of 2xx trigger this function

    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - could redirect to login or clear auth state
          console.error("Unauthorized access - please login");
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 404:
          // Not found
          console.error("Resource not found");
          break;
        case 500:
          // Server error
          console.error("Server error occurred");
          break;
        default:
          console.error(`API Error: ${status}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response from server - please check your connection");
    } else {
      // Something else happened
      console.error("Request failed:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
