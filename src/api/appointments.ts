import { useMutation, useQuery, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { z } from "zod";
import { axiosInstance } from "../lib/axios";
import { queryKeys } from "../lib/queryKeys";
import { API_ROUTES } from "./routes";
import {
  type Appointment,
  type DaySlots,
  type CreateAppointmentRequest,
  type EditAppointmentRequest,
  type DeleteAppointmentResponse,
  type EditAppointmentResponse,
  type AppointmentsResponse,
  type AppointmentType,
  DaySlotsSchema,
  AppointmentSchema,
  AppointmentsResponseSchema,
} from "../types/appointments";

// API Functions
export const appointmentsApi = {
  getAvailableSlots: async (sharableId: string, weekOffset: number = 0): Promise<DaySlots[]> => {
    const response = await axiosInstance.get(API_ROUTES.APPOINTMENTS.AVAILABLE, {
      params: { sharableId, weekOffset },
    });
    return z.array(DaySlotsSchema).parse(response.data);
  },

  getAppointments: async (sharableId: string, type: AppointmentType, page: number = 1, limit: number = 10): Promise<AppointmentsResponse> => {
    const response = await axiosInstance.get(API_ROUTES.APPOINTMENTS.BASE, {
      params: { sharableId, type, page, limit },
    });
    return AppointmentsResponseSchema.parse(response.data);
  },

  createAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await axiosInstance.post(API_ROUTES.APPOINTMENTS.BASE, data);
    return AppointmentSchema.parse(response.data);
  },

  deleteAppointment: async (id: string): Promise<DeleteAppointmentResponse> => {
    const response = await axiosInstance.delete(`${API_ROUTES.APPOINTMENTS.BASE}/${id}`);
    return response.data;
  },

  editAppointment: async (id: string, data: EditAppointmentRequest): Promise<EditAppointmentResponse> => {
    const response = await axiosInstance.patch(`${API_ROUTES.APPOINTMENTS.BASE}/${id}`, data);
    return response.data;
  },
};

export const useAvailableSlots = (sharableId: string | undefined, weekOffset: number = 0) => {
  return useQuery({
    queryKey: queryKeys.appointments.availableSlots(sharableId, weekOffset),
    queryFn: () => appointmentsApi.getAvailableSlots(sharableId!, weekOffset),
    enabled: !!sharableId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
};

export const useAppointments = (sharableId: string | undefined, type: AppointmentType, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.appointments.list(sharableId, type, page, limit),
    queryFn: () => appointmentsApi.getAppointments(sharableId!, type, page, limit),
    enabled: !!sharableId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
};

export const useCreateAppointment = (options?: Omit<UseMutationOptions<Appointment, Error, CreateAppointmentRequest>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentsApi.createAppointment,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.all,
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useDeleteAppointment = (options?: Omit<UseMutationOptions<DeleteAppointmentResponse, Error, string>, "mutationFn">) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentsApi.deleteAppointment,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.all,
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useEditAppointment = (
  options?: Omit<UseMutationOptions<EditAppointmentResponse, Error, { id: string; data: EditAppointmentRequest }>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditAppointmentRequest }) => appointmentsApi.editAppointment(id, data),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.all,
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};
