import type { AppointmentType } from "../types/appointments";

/**
 * Centralized Query Keys Configuration
 * 
 * This provides a type-safe way to manage all React Query cache keys.
 * Using factory functions ensures consistency and prevents typos.
 */

export const queryKeys = {
  // Auth related queries
  auth: {
    all: ["auth"] as const,
    currentUser: () => [...queryKeys.auth.all, "currentUser"] as const,
  },

  // User related queries
  users: {
    all: ["users"] as const,
    me: () => [...queryKeys.users.all, "me"] as const,
  },

  // Appointments related queries
  appointments: {
    all: ["appointments"] as const,
    
    // List of appointments with filters
    list: (sharableId?: string, type?: AppointmentType, page?: number, limit?: number) => 
      [...queryKeys.appointments.all, "list", { sharableId, type, page, limit }] as const,
    
    // Available slots for booking
    availableSlots: (sharableId?: string, weekOffset?: number) =>
      [...queryKeys.appointments.all, "availableSlots", { sharableId, weekOffset }] as const,
    
    // Single appointment details
    detail: (id: string) => 
      [...queryKeys.appointments.all, "detail", id] as const,
  },
} as const;

// Type helper to get query key types
export type QueryKeys = typeof queryKeys;

