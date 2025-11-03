/**
 * API Route Constants
 *
 * These are relative paths that will be appended to the baseURL
 * configured in the axios instance (src/lib/axios.ts)
 */

export const API_ROUTES = {
  AUTH: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  USERS: {
    ME: "/users/me",
    REGENERATE_SHARABLE_ID: "/users/me/regenerate-sharable-id",
  },
  APPOINTMENTS: {
    BASE: "/appointments",
    AVAILABLE: "/appointments/available",
  },
} as const;
