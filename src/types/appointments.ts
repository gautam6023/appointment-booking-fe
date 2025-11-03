import { z } from "zod";

// Zod Schemas for validation
export const SlotSchema = z.object({
  _id: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  date: z.string(),
  isBooked: z.boolean(),
});

export const DaySlotsSchema = z.object({
  dayId: z.number().min(0).max(6),
  slots: z.array(SlotSchema),
});

export const AppointmentSlotSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  date: z.string(),
});

export const AppointmentSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  slotId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  guests: z.array(z.string()).optional(),
  reason: z.string().optional(),
  status: z.enum(["pending", "done"]),
  slot: AppointmentSlotSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  isDeleted: z.boolean().optional(),
});

export const CreateAppointmentSchema = z.object({
  sharableId: z.string().uuid(),
  slotId: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  guests: z.array(z.string()).optional(),
  reason: z.string().max(500, "Reason must be less than 500 characters").optional(),
});

export const EditAppointmentSchema = z
  .object({
    newSlotId: z.string().optional(),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    guests: z.array(z.string()).optional(),
    reason: z.string().max(500, "Reason must be less than 500 characters").optional(),
  })
  .refine(
    (data) => {
      // At least one field must be provided
      return !!(data.newSlotId || data.name || data.email || data.phone || data.guests || data.reason);
    },
    {
      message: "At least one field must be provided to update the appointment",
    }
  );

// TypeScript Types
export type Slot = z.infer<typeof SlotSchema>;
export type DaySlots = z.infer<typeof DaySlotsSchema>;
export type Appointment = z.infer<typeof AppointmentSchema>;
export type AppointmentSlot = z.infer<typeof AppointmentSlotSchema>;
export type CreateAppointmentRequest = z.infer<typeof CreateAppointmentSchema>;
export type EditAppointmentRequest = z.infer<typeof EditAppointmentSchema>;

export interface DeleteAppointmentResponse {
  message: string;
  appointment: Appointment;
}

export interface EditAppointmentResponse {
  message: string;
  appointment: Appointment;
}

// API Error Type
export interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

// Pagination Types
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export const AppointmentsResponseSchema = z.object({
  appointments: z.array(AppointmentSchema),
  pagination: PaginationSchema,
});

export type Pagination = z.infer<typeof PaginationSchema>;
export type AppointmentsResponse = z.infer<typeof AppointmentsResponseSchema>;

// Query Parameters
export type AppointmentType = "past" | "future";
