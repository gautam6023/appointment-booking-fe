import { z } from "zod";

// Zod Schemas for validation
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  timezone: z.string().regex(/^[+-]\d{2}:\d{2}$/, "Invalid timezone format"),
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  userId: z.string(),
  sharableId: z.string(),
  timezone: z.string().optional(),
});

// TypeScript Types
export type LoginRequest = z.infer<typeof LoginSchema>;
export type SignupRequest = z.infer<typeof SignupSchema>;
export type User = z.infer<typeof UserSchema>;

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  userId: string;
  sharableId: string;
  timezone?: string;
}

// API Error Type
export interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}
