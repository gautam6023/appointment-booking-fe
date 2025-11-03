/**
 * Extended ApiError interface for better type safety
 */
interface ApiErrorResponse {
  error?: string;
  message?: string;
  statusText?: string;
  status?: number;
  data?: {
    error?: string;
    message?: string;
  };
}

interface ApiError {
  response?: ApiErrorResponse;
  request?: unknown;
  message?: string;
}

/**
 * Extracts a user-friendly error message from an API error
 */
export function getApiErrorMessage(error: unknown, defaultMessage = "An error occurred"): string {
  // Handle ApiError type
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;

    // Try to get error from response data
    if (apiError.response?.data?.error) {
      return apiError.response.data.error;
    }

    // Try to get message from response data
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }

    // Use status text if available
    if (apiError.response?.statusText) {
      return apiError.response.statusText;
    }
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  return defaultMessage;
}

/**
 * Formats a mutation error specifically for display in toasts
 */
export function formatMutationError(error: unknown): string {
  return getApiErrorMessage(error, "Operation failed");
}

/**
 * Checks if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error && typeof error === "object" && "request" in error) {
    const apiError = error as ApiError;
    // Request was made but no response received
    return !!apiError.request && !apiError.response;
  }
  return false;
}

/**
 * Checks if an error is an authentication error (401)
 */
export function isAuthError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    return apiError.response?.status === 401;
  }
  return false;
}

/**
 * Gets HTTP status code from error
 */
export function getErrorStatus(error: unknown): number | null {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    return apiError.response?.status ?? null;
  }
  return null;
}
