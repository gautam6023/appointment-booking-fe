import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { queryKeys } from "../lib/queryKeys";
import { API_ROUTES } from "./routes";
import { type LoginRequest, type SignupRequest, type User, UserSchema } from "../types/auth";

// API Functions
export const authApi = {
  login: async (credentials: LoginRequest): Promise<User> => {
    const response = await axiosInstance.post(API_ROUTES.AUTH.LOGIN, credentials);
    return UserSchema.parse(response.data);
  },

  signup: async (data: SignupRequest): Promise<User> => {
    const response = await axiosInstance.post(API_ROUTES.AUTH.SIGNUP, data);
    return UserSchema.parse(response.data);
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get(API_ROUTES.AUTH.ME);
    return UserSchema.parse(response.data);
  },
};

// React Query Hooks
/**
 * Hook for user login
 * Returns the full mutation object - consumers should handle onSuccess/onError callbacks
 * 
 * @example
 * const loginMutation = useLogin();
 * loginMutation.mutate(credentials, {
 *   onSuccess: (user) => { ... },
 *   onError: (error) => { ... }
 * });
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      // Update the cache with the logged-in user
      queryClient.setQueryData(queryKeys.auth.currentUser(), user);
    },
  });
};

/**
 * Hook for user signup
 * Returns the full mutation object - consumers should handle onSuccess/onError callbacks
 */
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (user) => {
      // Update the cache with the newly registered user
      queryClient.setQueryData(queryKeys.auth.currentUser(), user);
    },
  });
};

/**
 * Hook for user logout
 * Returns the full mutation object - consumers should handle onSuccess/onError callbacks
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear user from cache and invalidate all queries
      queryClient.setQueryData(queryKeys.auth.currentUser(), null);
      queryClient.clear();
    },
  });
};

/**
 * Hook to fetch current authenticated user
 * Returns the query object with user data
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
